import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { getProviderDetails, ProviderDetails } from '../../utils/subdomainHandler';

const Unauthorized: React.FC = () => {
  const [provider, setProvider] = useState<ProviderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProviderDetails = async () => {
      try {
        const providerData = await getProviderDetails();
        setProvider(providerData);
        document.title = `Access Denied | ${providerData.name}`;
      } catch (error) {
        console.error('Error loading provider details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProviderDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#fafafa' }}
    >
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
            <ShieldExclamationIcon className="h-12 w-12 text-red-600" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You don't have permission to access this page in the {provider?.name} portal.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <p className="text-gray-700">
            This might be because:
          </p>
          <ul className="list-disc text-left pl-5 text-gray-600 space-y-2">
            <li>You are not logged in</li>
            <li>Your account doesn't have the required permissions</li>
            <li>Your session has expired</li>
            <li>The requested resource requires additional authentication</li>
          </ul>
          
          <div className="pt-4">
            <Link
              to="/login"
              style={{ backgroundColor: provider?.primaryColor }}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign in
            </Link>
            
            <Link
              to="/"
              className="mt-3 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Portal Home
            </Link>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            If you believe this is an error, please contact the {provider?.name} administrator for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
