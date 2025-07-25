import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const OrgLoginPage: React.FC = () => {
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
      const success = await login(email, password, ['organization', 'organization-staff']);
      
      if (success) {
        const from = (location.state as any)?.from || '/organization';
        navigate(from, { replace: true });
        toast.success('Welcome to your organization portal');
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
      const success = await login(demoEmail, demoPassword, ['organization', 'organization-staff']);
      
      if (success) {
        const from = (location.state as any)?.from || '/organization';
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
            <h1 className="text-3xl font-bold text-gray-800">Organization Portal</h1>
            <p className="text-gray-600 mt-2">Access your WanGov-ID organization services</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="organization@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <Link to="/org/auth/forgot-password" className="font-medium text-green-600">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 border border-transparent rounded-md text-white bg-green-700"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
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
                    onClick={() => handleDemoLogin('organization@example.com', 'password123', 'Organization')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Organization Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('orgstaff@example.com', 'password123', 'Organization Staff')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Staff Demo
                  </button>
                </div>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm font-medium text-green-600">
                ← Return to citizen login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgLoginPage;
