import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const LandingPage: React.FC = () => {
  const handleWanGovSignup = async () => {
    try {
      toast.loading('Redirecting to WanGov Registration...', { duration: 1000 });
      
      // Generate OAuth state for security
      const state = Math.random().toString(36).substring(2, 15);
      const clientId = 'wangov-universal';
      
      // Build OAuth authorization URL for signup
      const authUrl = new URL('http://localhost:3010/');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/callback`);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', 'profile email nin');
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('signup', 'true'); // Indicate this is for signup
      
      // Store state for validation when user returns
      sessionStorage.setItem('oauth_state', state);
      sessionStorage.setItem('oauth_client_id', clientId);
      
      // Redirect to WanGov SSO for signup
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('SSO Signup Redirect error:', error);
      toast.error('Unable to redirect to WanGov Registration. Please try again.');
    }
  };

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-green-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src="/images/sierra-leone-landscape.jpg"
            alt="Sierra Leone landscape"
          />
          <div className="absolute inset-0 bg-green-800 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">WanGov-ID</h1>
          <p className="mt-6 text-xl text-green-100 max-w-3xl">
            Sierra Leone's National Digital Identity System - Empowering citizens through secure digital identities.
          </p>
          <div className="mt-10 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4">
            <Link
              to="/register"
              className="inline-block bg-green-600 border border-transparent rounded-md py-3 px-5 text-base font-medium text-white hover:bg-green-700"
            >
              Register for an ID
            </Link>
            <Link
              to="/login"
              className="inline-block bg-white border border-transparent rounded-md py-3 px-5 text-base font-medium text-green-700 hover:bg-green-50"
            >
              Citizen Sign In
            </Link>
          </div>
          
          <div className="mt-6 flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full">
              <Link
                to="/gov/auth/login"
                className="inline-block bg-gray-100 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-800 hover:bg-gray-200 text-center flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Government Admin Portal
              </Link>
              <Link
                to="/org/auth/login"
                className="inline-block bg-gray-100 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-800 hover:bg-gray-200 text-center flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Organization Portal
              </Link>
              <Link
                to="/ncra/auth/login"
                className="inline-block bg-blue-100 border border-blue-300 rounded-md py-2 px-4 text-sm font-medium text-blue-800 hover:bg-blue-200 text-center flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                NCRA Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Digital Identity</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Your Identity, Your Control
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              A single, secure identity for all government services and beyond.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-green-600 rounded-md shadow-lg">
                        <svg 
                          className="h-6 w-6 text-white" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Secure & Verifiable</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Advanced security measures ensure your identity is protected. Biometric verification prevents impersonation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-green-600 rounded-md shadow-lg">
                        <svg 
                          className="h-6 w-6 text-white" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Simplified Services</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Access government services with a single digital identity. No more multiple registrations or paperwork.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-green-600 rounded-md shadow-lg">
                        <svg 
                          className="h-6 w-6 text-white" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Digital Documents</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Store and share your important documents securely. Government-issued credentials at your fingertips.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="bg-green-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Trusted by Sierra Leoneans nationwide
            </h2>
            <p className="mt-3 text-xl text-green-200 sm:mt-4">
              Join millions of citizens already benefiting from WanGov-ID.
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-green-200">Citizens registered</dt>
              <dd className="order-1 text-5xl font-extrabold text-white">2.5M+</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-green-200">Partner organizations</dt>
              <dd className="order-1 text-5xl font-extrabold text-white">150+</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-green-200">Digital transactions</dt>
              <dd className="order-1 text-5xl font-extrabold text-white">1M+</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-green-700 rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Ready to get started?</span>
                  <span className="block">Register for your WanGov-ID today.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-green-200">
                  Join the digital transformation of Sierra Leone. Get access to government services, healthcare, education, and more with a single secure identity.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleWanGovSignup}
                    className="bg-white border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium text-green-700 hover:bg-green-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                    Register with WanGov ID
                  </button>
                  <Link
                    to="/register"
                    className="bg-transparent border border-white rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium text-white hover:bg-white hover:text-green-700 transition-colors"
                  >
                    Traditional Registration
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative -mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
              <img
                className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
                src="/images/id-card-sample.jpg"
                alt="WanGov-ID Sample"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
