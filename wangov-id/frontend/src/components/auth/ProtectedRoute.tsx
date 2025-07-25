import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loading state while checking authentication
    return <div className="flex h-screen items-center justify-center">Authenticating...</div>;
  }

  // If not logged in, redirect to login page with return URL
  if (!user) {
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check if the user has one of the allowed roles
  if (!allowedRoles.includes(user.role)) {
    // Redirect based on the user's actual role
    if (user.role === 'citizen') {
      return <Navigate to="/citizen/dashboard" replace />;
    } else if (user.role === 'organization_admin') {
      return <Navigate to="/organization/dashboard" replace />;
    } else if (user.role === 'super_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      // Fallback to login if role is unknown
      return <Navigate to="/login" replace />;
    }
  }

  // User has the correct role, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
