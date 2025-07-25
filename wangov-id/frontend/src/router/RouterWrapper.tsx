import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import SubdomainRouter from './SubdomainRouter';

const RouterWrapper: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // SubdomainRouter will determine which router to use based on the current subdomain
  return <SubdomainRouter />;
};

export default RouterWrapper;
