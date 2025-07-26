import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const GovLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password, ['superadmin', 'superadmin-staff', 'admin']);
      
      if (success) {
        // Get the redirect path from location state or default to superadmin dashboard
        const from = (location.state as any)?.from || '/superadmin-dashboard';
        navigate(from, { replace: true });
        toast.success('Welcome to WanGov-ID Administration');
      } else {
        toast.error('Invalid credentials or insufficient permissions');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string, roleLabel: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsSubmitting(true);
    
    try {
      const success = await login(demoEmail, demoPassword, ['superadmin', 'superadmin-staff', 'admin']);
      
      if (success) {
        // Get the redirect path from location state or default to superadmin dashboard
        const from = (location.state as any)?.from || '/superadmin-dashboard';
        navigate(from, { replace: true });
        toast.success(`Demo login successful as ${roleLabel}!`);
      } else {
        toast.error('Demo login failed. Please check the database.');
      }
    } catch (error) {
      toast.error('Demo login failed. Please try again.');
      console.error('Demo login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWanGovSSO = async () => {
    setIsSubmitting(true);
    
    try {
      toast.loading('Redirecting to WanGov SSO...', { duration: 1000 });
      
      // Construct OAuth parameters
      const currentUrl = window.location.origin + '/auth/callback';
      const state = Math.random().toString(36).substring(2, 15);
      const clientId = 'wangov-gov-portal';
      
      // Build SSO redirect URL
      const ssoUrl = new URL('http://localhost:3010');
      ssoUrl.searchParams.set('redirect_uri', currentUrl);
      ssoUrl.searchParams.set('client_id', clientId);
      ssoUrl.searchParams.set('state', state);
      ssoUrl.searchParams.set('response_type', 'code');
      ssoUrl.searchParams.set('scope', 'profile email government_access');
      
      // Store state for validation when user returns
      sessionStorage.setItem('oauth_state', state);
      sessionStorage.setItem('oauth_client_id', clientId);
      
      // Redirect to SSO service
      window.location.href = ssoUrl.toString();
    } catch (error) {
      console.error('SSO Redirect error:', error);
      toast.error('Unable to redirect to WanGov SSO. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <img 
              src="/assets/sierra-leone-coat-of-arms.png" 
              alt="Sierra Leone Coat of Arms"
              className="mx-auto h-24 mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-800">Government Administration Login</h1>
            <p className="text-gray-600 mt-2">WanGov-ID System Management Portal</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@wangov.sl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <Link to="/gov/auth/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
              
              {/* Demo Account Buttons */}
              <div className="mt-4 space-y-3">
                <div className="text-center text-sm text-gray-600 mb-3">
                  Quick Demo Login:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('superadmin@wangov.sl', 'password123', 'SuperAdmin')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 2.676-.732 5.154-2.033 7.323-3.773.896-.719 1.677-1.533 2.323-2.41z" />
                    </svg>
                    SuperAdmin Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin@wangov.sl', 'password123', 'Admin')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Demo
                  </button>
                </div>
              </div>
            </form>
            
            {/* WanGov SSO Section */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleWanGovSSO}
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center py-2 px-4 border border-blue-300 rounded-md shadow-sm bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  Login with WanGov ID
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Security Notice
                  </span>
                </div>
              </div>
              
              <div className="mt-6 text-center text-xs text-gray-600">
                <p>This is a secure government system.</p>
                <p className="mt-1">Unauthorized access is prohibited and may be subject to legal action.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-medium text-green-600 hover:text-green-500">
              ← Return to citizen login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovLoginPage;
