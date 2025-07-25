import React, { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { isProviderSubdomain, getSubdomain } from '../utils/subdomainHandler';
import router from './index';
import providerRoutes from './providerRoutes';
import { toast } from 'react-hot-toast';

const SubdomainRouter: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [appRouter, setAppRouter] = useState<any>(null);

  useEffect(() => {
    const determineRouter = async () => {
      try {
        const subdomain = getSubdomain();
        const isProvider = await isProviderSubdomain();
        
        // If it's a provider subdomain, use provider routes, otherwise use main routes
        if (isProvider) {
          console.log(`Provider subdomain detected: ${subdomain}, loading provider portal`);
          // Create a router with provider-specific routes
          setAppRouter(createBrowserRouter(providerRoutes));
          
          // Add some basic styling to match provider portals
          document.body.classList.add('provider-portal');
          document.title = `${subdomain?.toUpperCase()} Portal | WanGov ID`;
        } else {
          console.log('Using main application routes');
          // Use the pre-configured main router
          setAppRouter(router);
          document.body.classList.remove('provider-portal');
        }
      } catch (error) {
        console.error('Error determining routes:', error);
        toast.error('Error initializing application. Please try again.');
        
        // Fallback to main routes on error
        setAppRouter(router);
      } finally {
        setLoading(false);
      }
    };

    determineRouter();
    
    // Clean up function
    return () => {
      document.body.classList.remove('provider-portal');
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading WanGov ID application...</p>
          <p className="mt-2 text-sm text-gray-500">
            {getSubdomain() ? `Detecting provider: ${getSubdomain()}` : 'Loading main application'}
          </p>
        </div>
      </div>
    );
  }

  return appRouter ? <RouterProvider router={appRouter} /> : null;
};

export default SubdomainRouter;
