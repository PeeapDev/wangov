import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProviderDetails } from '../../utils/subdomainHandler';
import { toast } from 'react-hot-toast';
import { ssoService } from '../../services/ssoService';

const ProviderLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [loadingProvider, setLoadingProvider] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        const providerData = await getProviderDetails();
        setProvider(providerData);
        document.title = `${providerData.name} Login | WanGov ID`;
      } catch (error) {
        console.error('Error fetching provider details:', error);
        toast.error('Unable to load provider portal');
      } finally {
        setLoadingProvider(false);
      }
    };
    
    fetchProviderDetails();
  }, []);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      // Use WanGov SSO service for authentication
      const result = await ssoService.login(email, password, provider?.id);
      
      if (result.success && result.user) {
        // Check if user has access to this provider
        if (provider?.id && !ssoService.hasProviderAccess(provider.id)) {
          toast.error('You do not have access to this provider portal');
          await ssoService.logout();
          return;
        }
        
        toast.success(`Welcome back, ${result.user.name}!`);
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Authentication service unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleWanGovSSO = async () => {
    setLoading(true);
    
    try {
      toast.loading('Redirecting to WanGov ID...', { duration: 1000 });
      
      // Construct OAuth parameters
      const currentUrl = window.location.origin + '/auth/callback';
      const state = Math.random().toString(36).substring(2, 15);
      const clientId = 'wangov-universal'; // Use universal client for all subdomains
      
      // Build SSO redirect URL
      const ssoUrl = new URL('http://localhost:3010/auth/authorize');
      ssoUrl.searchParams.set('redirect_uri', currentUrl);
      ssoUrl.searchParams.set('client_id', clientId);
      ssoUrl.searchParams.set('state', state);
      ssoUrl.searchParams.set('response_type', 'code');
      ssoUrl.searchParams.set('scope', 'profile email organization_access');
      
      // Store state for validation when user returns
      sessionStorage.setItem('oauth_state', state);
      sessionStorage.setItem('oauth_provider_id', provider?.id || '');
      
      // Redirect to SSO service
      window.location.href = ssoUrl.toString();
    } catch (error) {
      console.error('SSO Redirect error:', error);
      toast.error('Unable to redirect to WanGov ID. Please try again.');
      setLoading(false);
    }
  };
  
  if (loadingProvider) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!provider) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-2xl font-bold text-red-600">Provider Not Found</h1>
        <p className="mt-2 text-gray-600">This provider portal is not available.</p>
        <Link to="/" className="mt-4 text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }
  
  // Define styles based on provider branding
  const buttonStyle = {
    backgroundColor: provider.primaryColor,
    borderColor: provider.secondaryColor
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            {provider.logo ? (
              <img
                src={provider.logo}
                alt={provider.name}
                className="h-16 w-auto"
                onError={(e) => {
                  // Fallback if logo doesn't load
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://via.placeholder.com/150x50?text=" + provider.name.charAt(0);
                }}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700">
                {provider.name.charAt(0)}
              </div>
            )}
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{provider.name}</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in with your WanGov ID credentials to access the provider portal.
            </p>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 mb-2">
                <strong>Demo Login Options:</strong>
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Manual:</strong> Use any email ending with @wangov.sl and a password with at least 6 characters</li>
                <li>• <strong>SSO:</strong> Click "Sign in with WanGov ID" for instant authentication</li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleLogin}>
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
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                    placeholder="john.doe@wangov.sl"
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
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
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
                  disabled={loading}
                  style={buttonStyle}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleWanGovSSO}
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign in with WanGov ID
                </button>
                
                <a 
                  href="/"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Return to Portal Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block relative w-0 flex-1" style={{ backgroundColor: provider.secondaryColor }}>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold text-white mb-6">
              Welcome to the {provider.name} Staff Portal
            </h2>
            <p className="text-lg text-white opacity-90">
              This secure portal allows authorized staff to manage services, view reports, and manage users 
              for the {provider.name}. If you need access, please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderLogin;
