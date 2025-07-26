import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NCRALogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, ['organization', 'organization-staff']);
      if (success) {
        toast.success('Welcome to NCRA Portal');
        // Force navigation to NCRA regardless of role redirect
        window.location.href = '/ncra';
      } else {
        toast.error('Invalid credentials or insufficient permissions');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (type: 'admin' | 'staff') => {
    setIsLoading(true);
    try {
      // Create mock NCRA user for demo
      const mockUser = {
        id: `ncra-${type}-${Date.now()}`,
        email: `ncra.${type}@gov.sl`,
        role: 'organization' as const,
        firstName: type === 'admin' ? 'NCRA' : 'NCRA',
        lastName: type === 'admin' ? 'Administrator' : 'Staff',
        organizationId: 'ncra-001',
        organizationName: 'National Civil Registration Authority',
        isNCRA: true, // Special flag to identify NCRA users
        isEmailVerified: true
      };

      // Store mock user data
      localStorage.setItem('token', `mock-ncra-token-${type}`);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Welcome to NCRA Portal (${type.charAt(0).toUpperCase() + type.slice(1)})`);
      
      // Force navigation to NCRA
      window.location.href = '/ncra';
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error('Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            className="h-12 w-auto"
            src="/sl-coat-of-arms.png"
            alt="Sierra Leone Coat of Arms"
          />
        </div>
        <div className="mt-6 flex justify-center">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-blue-600 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900">NCRA Portal</h2>
          </div>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          National Civil Registration Authority
        </p>
        <p className="text-center text-sm text-gray-500">
          Staff access to civil registration services
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@ncra.gov.sl"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Quick Demo Login:</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                NCRA Admin
              </button>

              <button
                onClick={() => handleDemoLogin('staff')}
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                NCRA Staff
              </button>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/"
              className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-500"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Return to main portal
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          National Civil Registration Authority - Sierra Leone Government
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Secure access for authorized personnel only
        </p>
      </div>
    </div>
  );
};

export default NCRALogin;
