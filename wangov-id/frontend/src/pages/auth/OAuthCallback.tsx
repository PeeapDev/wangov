import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // Check for OAuth errors
        if (error) {
          toast.error(`Authentication failed: ${error}`);
          navigate('/login');
          return;
        }

        // Validate state parameter
        const storedState = sessionStorage.getItem('oauth_state');
        if (!state || !storedState || state !== storedState) {
          toast.error('Invalid authentication state. Please try again.');
          navigate('/login');
          return;
        }

        // Validate authorization code
        if (!code) {
          toast.error('No authorization code received. Please try again.');
          navigate('/login');
          return;
        }

        // Exchange authorization code for tokens
        const response = await fetch('http://localhost:3010/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: `${window.location.origin}/auth/callback`,
            client_id: sessionStorage.getItem('oauth_client_id') || 'wangov-universal',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange authorization code for tokens');
        }

        const tokenData = await response.json();
        
        // Store tokens
        if (tokenData.access_token) {
          localStorage.setItem('token', tokenData.access_token);
          if (tokenData.refresh_token) {
            localStorage.setItem('refresh_token', tokenData.refresh_token);
          }
        }

        // Clean up OAuth session data
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_client_id');

        // Update auth context
        await checkAuthStatus();

        toast.success('Successfully logged in!');
        
        // Redirect to appropriate dashboard based on user role
        navigate('/dashboard');

      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      } finally {
        setProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, checkAuthStatus]);

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Authentication</h2>
          <p className="text-gray-600">Please wait while we complete your login...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;
