import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import ProviderLayout from '../layouts/ProviderLayout';
import ProviderDashboard from '../pages/provider/ProviderDashboard';
import StaffManagement from '../pages/provider/StaffManagement';
import ServicesManagement from '../pages/provider/ServicesManagement';
import ProviderLanding from '../pages/provider/ProviderLanding';
import ProviderLogin from '../pages/provider/ProviderLogin';
import ProviderInvoices from '../pages/provider/ProviderInvoices';
import Unauthorized from '../pages/provider/Unauthorized';
import { ssoService } from '../services/ssoService';

// Protected route component for provider portal
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({ 
  children, 
  requiredRole 
}) => {
  const isAuthenticated = ssoService.isAuthenticated();
  const currentUser = ssoService.getCurrentUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role/permission
  if (requiredRole && currentUser && !currentUser.permissions.includes(requiredRole) && !currentUser.permissions.includes('admin')) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

// Public route component
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // This is a simplified version - in a real app we would check authentication status
  return <>{children}</>;
};

// Placeholder components for routes not yet implemented
const Reports = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Reports</h1>
    <p className="text-gray-600 mb-4">View and generate reports for your provider services.</p>
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <p className="text-yellow-700">This page is currently under development.</p>
    </div>
  </div>
);

const Settings = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Provider Settings</h1>
    <p className="text-gray-600 mb-4">Configure your provider portal settings.</p>
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <p className="text-yellow-700">This page is currently under development.</p>
    </div>
  </div>
);

// ProviderLogin component is imported from '../pages/provider/ProviderLogin'
// Unauthorized component is imported from '../pages/provider/Unauthorized'

// Provider portal routes - these will be used when a subdomain matches a provider
const providerRoutes: RouteObject[] = [
  // Public routes
  {
    path: '/',
    element: <PublicRoute><ProviderLanding /></PublicRoute>,
  },
  {
    path: '/login',
    element: <PublicRoute><ProviderLogin /></PublicRoute>,
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  // Protected routes with provider layout
  {
    path: '/dashboard',
    element: <ProtectedRoute requiredRole="provider-admin"><ProviderLayout /></ProtectedRoute>,
    children: [
      {
        path: '',
        element: <ProviderDashboard />
      },
      {
        path: 'staff',
        element: <StaffManagement />
      },
      {
        path: 'services',
        element: <ServicesManagement />
      },
      {
        path: 'reports',
        element: <Reports />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'invoices/*',
        element: <ProviderInvoices />
      }
    ]
  }
];

export default providerRoutes;
