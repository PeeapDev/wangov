import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: 'identityVerification' | 'apiAccess' | 'staffManagement' | 'invoicing' | 'reporting';
  redirectTo?: string;
}

interface OrganizationPermissions {
  identityVerification: boolean;
  apiAccess: boolean;
  staffManagement: boolean;
  invoicing: boolean;
  reporting: boolean;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  children, 
  permission, 
  redirectTo = '/organization' 
}) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<OrganizationPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, we'd fetch organization permissions from the API
    // For now, we'll use mock data based on the user's organization
    const fetchOrganizationPermissions = async () => {
      try {
        // Mock API call
        setTimeout(() => {
          // Check if the user has a stored organization profile in local storage
          const orgProfile = localStorage.getItem('organizationProfile');
          
          if (orgProfile) {
            const profile = JSON.parse(orgProfile);
            if (profile.permissions) {
              setPermissions(profile.permissions);
            } else {
              // Default permissions if not specified
              setPermissions({
                identityVerification: true, // Most organizations have this by default
                apiAccess: false,
                staffManagement: true,
                invoicing: false,
                reporting: true
              });
            }
          } else {
            // Default permissions based on organization stored in user object
            // In a real app, we would fetch this from the API
            const mockPermissions: Record<string, OrganizationPermissions> = {
              'Ministry of Education': {
                identityVerification: true,
                apiAccess: true,
                staffManagement: true,
                invoicing: true,
                reporting: true
              },
              'Sierra Leone Commercial Bank': {
                identityVerification: true,
                apiAccess: true,
                staffManagement: true,
                invoicing: false,
                reporting: true
              },
              'Save the Children SL': {
                identityVerification: true,
                apiAccess: false,
                staffManagement: true,
                invoicing: false,
                reporting: true
              },
              'TechHub Sierra Leone': {
                identityVerification: false,
                apiAccess: false,
                staffManagement: false,
                invoicing: false,
                reporting: false
              }
            };
            
            // Default permissions if we don't have specific ones for this organization
            const defaultPermissions = {
              identityVerification: true,
              apiAccess: false,
              staffManagement: true,
              invoicing: false,
              reporting: true
            };
            
            if (user?.organizationName) {
              setPermissions(mockPermissions[user.organizationName] || defaultPermissions);
            } else {
              setPermissions(defaultPermissions);
            }
          }
          
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching organization permissions:', error);
        setError('Failed to load organization permissions');
        setIsLoading(false);
      }
    };

    if (user && user.role === 'organization') {
      fetchOrganizationPermissions();
    } else {
      setIsLoading(false);
      setError('User is not part of an organization');
    }
  }, [user]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Handle verification status and permission check
  if (!permissions) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if the organization has the required permission
  if (!permissions[permission]) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <ShieldExclamationIcon className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
        <p className="text-gray-600 text-center max-w-md mb-6">
          Your organization does not have permission to access this feature. 
          Contact the system administrator if you believe this is an error.
        </p>
        <a 
          href={redirectTo} 
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Return to Dashboard
        </a>
      </div>
    );
  }

  // If the organization has the permission, show the protected content
  return <>{children}</>;
};

export default PermissionGuard;
