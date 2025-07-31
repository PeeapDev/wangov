import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// SuperAdmin Pages
import OrganizationDetail from '../pages/superadmin/OrganizationDetail';
import SystemLogs from '../pages/superadmin/SystemLogs';
import SuperAdminAnalytics from '../pages/superadmin/Analytics';
import Communication from '../pages/superadmin/Communication';
import SecurityManagement from '../pages/superadmin/SecurityManagement';
import SuperAdminSettings from '../pages/superadmin/Settings';
import SuperAdminDashboard from '../pages/superadmin/SuperAdminDashboard';
import SuperAdminInvoices from '../pages/superadmin/SuperAdminInvoices';
import BusinessApproval from '../pages/superadmin/BusinessApproval';
import ApiKeyApproval from '../pages/superadmin/ApiKeyApproval';
import ProviderManagement from '../pages/superadmin/ProviderManagement';
import CitizensManagement from '../pages/superadmin/CitizensManagement';
import OrganizationsManagement from '../pages/superadmin/OrganizationsManagement';
import AdminsManagement from '../pages/superadmin/AdminsManagement';
import ApiManagement from '../pages/superadmin/ApiManagement';

// Settings Sub-Pages
import RegionSettings from '../pages/superadmin/settings/RegionSettings';
import AppSettings from '../pages/superadmin/settings/AppSettings';
import EmailSmtpSettings from '../pages/superadmin/settings/EmailSmtpSettings';
import RolesSettings from '../pages/superadmin/settings/RolesSettings';
import SmsSettings from '../pages/superadmin/settings/SmsSettings';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import CitizenLayout from '../layouts/CitizenLayout';
import OrganizationLayout from '../layouts/OrganizationLayout';
import AdminLayout from '../layouts/AdminLayout';
import SuperAdminLayout from '../layouts/SuperAdminLayout';
import SuperAdminStaffLayout from '../layouts/SuperAdminStaffLayout';
import OrganizationStaffLayout from '../layouts/OrganizationStaffLayout';
import NCRALayout from '../layouts/NCRALayout';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import AboutPage from '../pages/public/AboutPage';
import LoginPage from '../pages/public/LoginPage';
import GovLoginPage from '../pages/public/GovLoginPage';
import OrgLoginPage from '../pages/public/OrgLoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import RegistrationChoice from '../pages/public/RegistrationChoice';
import CitizenRegistration from '../pages/public/CitizenRegistration';
import ResidentPermitRegistration from '../pages/public/ResidentPermitRegistration';
import RegistrationConfirmation from '../pages/public/RegistrationConfirmation';

// Citizen Pages
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import CitizenWallet from '../pages/citizen/CitizenWallet';

// NCRA Pages
import NCRADashboard from '../pages/ncra/NCRADashboard';
import NCRALogin from '../pages/ncra/NCRALogin';
import NCRAApplications from '../pages/ncra/NCRAApplications';
import NCRAInvoices from '../pages/ncra/NCRAInvoices';
import NCRACitizensManagement from '../pages/ncra/CitizensManagement';
import RejectedCitizens from '../pages/ncra/RejectedCitizens';
import NCRAWallet from '../pages/ncra/NCRAWallet';

// NCRA Application Pages
import AllApplications from '../pages/ncra/applications/AllApplications';
import ProcessingApplications from '../pages/ncra/applications/ProcessingApplications';
import PendingApplications from '../pages/ncra/applications/PendingApplications';

// Organization Pages
import OrganizationDashboard from '../pages/organization/OrganizationDashboard';
import BusinessRegistration from '../pages/organization/BusinessRegistration';
import DeveloperSandbox from '../pages/organization/DeveloperSandbox';
import SdkDocumentation from '../pages/organization/SdkDocumentation';
import OrgAnalytics from '../pages/organization/Analytics';
import OrgSettings from '../pages/organization/Settings';
import Members from '../pages/organization/Members';
import Verification from '../pages/organization/Verification';
import StaffManagement from '../pages/organization/StaffManagement';
import OrganizationInvoices from '../pages/organization/OrganizationInvoices';
import BusinessSSOManagement from '../pages/organization/BusinessSSOManagement';
import OrganizationWallet from '../pages/organization/OrganizationWallet';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminInvoices from '../pages/admin/AdminInvoices';

// Government Pages
import GovernmentWallet from '../pages/government/GovernmentWallet';

// Test Pages
import WordPressDownload from '../pages/test/WordPressDownload';

// SuperAdmin Wallet
import SuperAdminWallet from '../pages/superadmin/SuperAdminWallet';

// Additional Pages
import OAuthCallback from '../pages/auth/OAuthCallback';

// SuperAdmin Staff Pages
import SuperAdminStaffDashboard from '../pages/superadmin-staff/SuperAdminStaffDashboard';

// Organization Staff Pages
import OrganizationStaffDashboard from '../pages/organization-staff/OrganizationStaffDashboard';

// Dashboard Redirect Component
const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  switch (user.role) {
    case 'citizen':
      return <Navigate to="/citizen" replace />;
    case 'organization':
      return <Navigate to="/organization" replace />;
    case 'organization-staff':
      return <Navigate to="/organization-staff" replace />;
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'superadmin':
      return <Navigate to="/superadmin-dashboard" replace />;
    case 'superadmin-staff':
      return <Navigate to="/superadmin-admin" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Route Protection Components
const ProtectedRoute: React.FC<{ 
  children?: React.ReactNode;
  requiredRole?: 'citizen' | 'organization' | 'organization-staff' | 'admin' | 'superadmin' | 'superadmin-staff' | 'ncra'; 
}> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    // Show loading spinner while auth is being checked
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    if (requiredRole === 'ncra') {
      return <Navigate to="/ncra/auth/login" replace />;
    } else if (requiredRole === 'organization' || requiredRole === 'organization-staff') {
      return <Navigate to="/org/auth/login" replace />;
    } else if (requiredRole === 'admin' || requiredRole === 'superadmin' || requiredRole === 'superadmin-staff') {
      return <Navigate to="/gov/auth/login" replace />;
    } else {
      // Default to citizen login
      return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
    }
  }
  
  // Special handling for NCRA routes - check if user is NCRA even if role is different
  if (requiredRole === 'ncra' && user?.isNCRA === true) {
    // Allow access for NCRA users even if their role is organization or organization-staff
    // This ensures backward compatibility
  } 
  // Standard role checking for other roles
  else if (requiredRole && user?.role !== requiredRole) {
    // Get current path to prevent redirect loops
    const currentPath = window.location.pathname;
    
    // Redirect to appropriate dashboard based on role if trying to access unauthorized route
    switch (user?.role) {
      case 'ncra':
        if (currentPath !== '/ncra') return <Navigate to="/ncra" replace />;
        break;
      case 'citizen':
        if (currentPath !== '/citizen') return <Navigate to="/citizen" replace />;
        break;
      case 'organization':
        // Check for NCRA flag here too
        if (user?.isNCRA === true) {
          if (currentPath !== '/ncra') return <Navigate to="/ncra" replace />;
        } else {
          if (currentPath !== '/organization') return <Navigate to="/organization" replace />;
        }
        break;
      case 'organization-staff':
        // Check for NCRA flag here too
        if (user?.isNCRA === true) {
          if (currentPath !== '/ncra') return <Navigate to="/ncra" replace />;
        } else {
          if (currentPath !== '/organization-staff') return <Navigate to="/organization-staff" replace />;
        }
        break;
      case 'admin':
        if (currentPath !== '/admin') return <Navigate to="/admin" replace />;
        break;
      case 'superadmin':
        if (currentPath !== '/superadmin-dashboard') return <Navigate to="/superadmin-dashboard" replace />;
        break;
      case 'superadmin-staff':
        if (currentPath !== '/superadmin-admin') return <Navigate to="/superadmin-admin" replace />;
        break;
      default:
        // If role is undefined or not recognized, redirect to appropriate login page
        if (requiredRole === 'superadmin' || requiredRole === 'superadmin-staff' || requiredRole === 'admin') {
          return <Navigate to="/gov/auth/login" replace />;
        } else if (requiredRole === 'organization' || requiredRole === 'organization-staff') {
          return <Navigate to="/org/auth/login" replace />;
        } else if (requiredRole === 'ncra') {
          return <Navigate to="/ncra/auth/login" replace />;
        } else {
          return <Navigate to="/login" replace />;
        }
    }
    
    // If we reach here, it means we're already on the correct route but with wrong role
    // Show unauthorized message instead of redirecting
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    </div>;
  }
  
  // If all checks pass, render the children
  return <>{children || <Outlet />}</>;
};

// Public Route - redirects to dashboard if already authenticated
const PublicRoute: React.FC<{ 
  children?: React.ReactNode;
  routeType?: 'citizen' | 'government' | 'organization' | 'ncra';
}> = ({ children, routeType = 'citizen' }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    switch (user?.role) {
      case 'ncra':
        return <Navigate to="/ncra" replace />;
      case 'citizen':
        return <Navigate to="/citizen" replace />;
      case 'organization':
        // Check if this is an NCRA user
        if (user?.isNCRA) {
          return <Navigate to="/ncra" replace />;
        }
        return <Navigate to="/organization" replace />;
      case 'organization-staff':
        // Check if this is an NCRA staff user
        if (user?.isNCRA) {
          return <Navigate to="/ncra" replace />;
        }
        return <Navigate to="/organization-staff" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'superadmin':
        return <Navigate to="/superadmin-dashboard" replace />;
      case 'superadmin-staff':
        return <Navigate to="/superadmin-admin" replace />;
      default:
        return <Navigate to="/citizen" replace />;
    }
  }
  
  // If not authenticated, render the public route
  return <>{children || <Outlet />}</>;
};

// Router configuration
const router = createBrowserRouter([
  // Public routes
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <PublicRoute><LandingPage /></PublicRoute>,
      },
      {
        path: "/about",
        element: <PublicRoute><AboutPage /></PublicRoute>,
      },
      {
        path: "/login",
        element: <PublicRoute routeType="citizen"><LoginPage /></PublicRoute>,
      },
      {
        path: "/admin-login",
        element: <Navigate to="/gov/auth/login" replace />,
      },
      {
        path: "/org-login",
        element: <Navigate to="/org/auth/login" replace />,
      },
      {
        path: "/register",
        element: <PublicRoute><RegistrationChoice /></PublicRoute>,
      },
      {
        path: "/register/citizen",
        element: <PublicRoute><CitizenRegistration /></PublicRoute>,
      },
      {
        path: "/register/resident-permit",
        element: <PublicRoute><ResidentPermitRegistration /></PublicRoute>,
      },
      {
        path: "/register/confirmation",
        element: <PublicRoute><RegistrationConfirmation /></PublicRoute>,
      },
      {
        path: "/test/wordpress-download",
        element: <WordPressDownload />,
      },
      {
        path: "/auth/callback",
        element: <PublicRoute><OAuthCallback /></PublicRoute>,
      },
    ],
  },
  
  // Government Admin Login Route
  {
    path: "/gov",
    children: [
      {
        path: "",
        element: <Navigate to="/gov/auth/login" replace />,
      },
      {
        path: "auth/login",
        element: <PublicRoute routeType="government"><GovLoginPage /></PublicRoute>,
      },
      {
        path: "auth/forgot-password",
        element: <PublicRoute><div className="p-4">Government Password Reset</div></PublicRoute>,
      },
    ],
  },
  
  // Organization Login Route
  {
    path: "/org",
    children: [
      {
        path: "",
        element: <Navigate to="/org/auth/login" replace />,
      },
      {
        path: "auth/login",
        element: <PublicRoute routeType="organization"><OrgLoginPage /></PublicRoute>,
      },
      {
        path: "auth/forgot-password",
        element: <PublicRoute><div className="p-4">Organization Password Reset</div></PublicRoute>,
      },
    ],
  },
  
  // Citizen routes
  {
    path: "/citizen",
    element: <ProtectedRoute requiredRole="citizen"><CitizenLayout /></ProtectedRoute>,
    children: [
      {
        path: "",
        element: <CitizenDashboard />,
      },
      {
        path: "profile",
        element: <div className="p-4">Citizen Profile Page</div>,
      },
      {
        path: "documents",
        element: <div className="p-4">Citizen Documents Page</div>,
      },
      {
        path: "services",
        element: <div className="p-4">Available Services Page</div>,
      },
      {
        path: "notifications",
        element: <div className="p-4">Notifications Page</div>,
      },
      {
        path: "settings",
        element: <div className="p-4">Account Settings Page</div>,
      },
      {
        path: "wallet",
        element: <CitizenWallet />,
      },
      {
        path: "dashboard",
        element: <Navigate to="/citizen" replace />,
      },
    ],
  },
  
  // Organization routes
  {
    path: "/organization",
    element: <ProtectedRoute requiredRole="organization"><OrganizationLayout /></ProtectedRoute>,
    children: [
      {
        path: "",
        element: <OrganizationDashboard />,
      },
      {
        path: "verification",
        element: <Verification />,
      },
      {
        path: "members",
        element: <Members />,
      },
      {
        path: "staff",
        element: <StaffManagement />,
      },
      {
        path: "sso",
        element: <BusinessSSOManagement />,
      },
      {
        path: "services",
        element: <div className="p-4">Organization Services Page</div>,
      },
      {
        path: "api-keys",
        element: <div className="p-4">API Keys Management Page</div>,
      },
      {
        path: "analytics",
        element: <OrgAnalytics />,
      },
      {
        path: "settings",
        element: <OrgSettings />,
      },
      {
        path: "staff-management",
        element: <StaffManagement />,
      },
      {
        path: "business-registration",
        element: <BusinessRegistration />,
      },
      {
        path: "developer-sandbox",
        element: <DeveloperSandbox />,
      },
      {
        path: "sdk-documentation",
        element: <SdkDocumentation />,
      },
      {
        path: "invoices/*",
        element: <OrganizationInvoices />,
      },
      {
        path: "wallet",
        element: <OrganizationWallet />,
      },
      {
        path: "dashboard",
        element: <Navigate to="/organization" replace />,
      },
    ],
  },
  
  // Admin routes
  {
    path: "/admin",
    element: <ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>,
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },
      {
        path: "citizens",
        element: <div className="p-4">Citizens Management Page</div>,
      },
      {
        path: "organizations",
        element: <div className="p-4">Organizations Management Page</div>,
      },
      {
        path: "system-logs",
        element: <div className="p-4">System Logs Page</div>,
      },
      {
        path: "api-management",
        element: <div className="p-4">API Management Page</div>,
      },
      {
        path: "analytics",
        element: <div className="p-4">System Analytics Page</div>,
      },
      {
        path: "security",
        element: <div className="p-4">Security Settings Page</div>,
      },
      {
        path: "settings",
        element: <div className="p-4">System Settings Page</div>,
      },
      {
        path: "invoices/*",
        element: <AdminInvoices />,
      },
      {
        path: "wallet",
        element: <GovernmentWallet />,
      },
      {
        path: "dashboard",
        element: <Navigate to="/admin" replace />,
      },
    ],
  },

  // SuperAdmin routes
  {
    path: "/superadmin-dashboard",
    element: <ProtectedRoute requiredRole="superadmin"><SuperAdminLayout /></ProtectedRoute>,
    children: [
      {
        path: "",
        element: <SuperAdminDashboard />,
      },
      {
        path: "citizens",
        element: <CitizensManagement />,
      },
      {
        path: "organizations",
        element: <OrganizationsManagement />,
      },
      {
        path: "organizations/:orgId",
        element: <OrganizationDetail />,
      },
      {
        path: "admins",
        element: <AdminsManagement />,
      },
      {
        path: "api",
        element: <ApiManagement />,
      },
      {
        path: "logs",
        element: <SystemLogs />,
      },
      {
        path: "analytics",
        element: <SuperAdminAnalytics />,
      },
      {
        path: "security",
        element: <SecurityManagement />,
      },
      {
        path: "settings",
        element: <SuperAdminSettings />,
        children: [
          {
            path: "",
            element: <Navigate to="region" replace />
          },
          {
            path: "region",
            element: <React.Suspense fallback={<div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>}>
              <RegionSettings />
            </React.Suspense>
          },
          {
            path: "app",
            element: <React.Suspense fallback={<div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>}>
              <AppSettings />
            </React.Suspense>
          },
          {
            path: "email",
            element: <React.Suspense fallback={<div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>}>
              <EmailSmtpSettings />
            </React.Suspense>
          },
          {
            path: "roles",
            element: <React.Suspense fallback={<div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>}>
              <RolesSettings />
            </React.Suspense>
          },
          {
            path: "sms",
            element: <React.Suspense fallback={<div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>}>
              <SmsSettings />
            </React.Suspense>
          }
        ]
      },
      {
        path: "business-approval",
        element: <BusinessApproval />,
      },
      {
        path: "api-key-approval",
        element: <ApiKeyApproval />,
      },
      {
        path: "provider-management",
        element: <ProviderManagement />,
      },
      {
        path: "provider",
        element: <ProviderManagement />,
      },
      {
        path: "communication",
        element: <Communication />,
      },
      {
        path: "invoices/*",
        element: <SuperAdminInvoices />,
      },
      {
        path: "wallet",
        element: <SuperAdminWallet />,
      },
      {
        path: "dashboard",
        element: <Navigate to="/superadmin-dashboard" replace />,
      },
    ],
  },

  // SuperAdmin Staff routes
  {
    path: "/superadmin-admin",
    element: <ProtectedRoute requiredRole="superadmin-staff"><SuperAdminStaffLayout /></ProtectedRoute>,
    children: [
      {
        path: "",
        element: <SuperAdminStaffDashboard />,
      },
      {
        path: "users",
        element: <div className="p-4">User Management</div>,
      },
      {
        path: "organizations",
        element: <div className="p-4">Organizations Management</div>,
      },
      {
        path: "reports",
        element: <div className="p-4">Reports Generation</div>,
      },
      {
        path: "tickets",
        element: <div className="p-4">Support Tickets</div>,
      },
      {
        path: "profile",
        element: <div className="p-4">My Profile</div>,
      },
      {
        path: "settings",
        element: <div className="p-4">Staff Settings</div>,
      },
    ],
  },

  // Organization Staff routes
  {
    path: "/organization-staff",
    element: <ProtectedRoute requiredRole="organization-staff"><OrganizationStaffLayout /></ProtectedRoute>,
    children: [
      {
        path: "",
        element: <OrganizationStaffDashboard />,
      },
      {
        path: "citizens",
        element: <div className="p-4">Citizens Management</div>,
      },
      {
        path: "verification",
        element: <div className="p-4">ID Verification Portal</div>,
      },
      {
        path: "records",
        element: <div className="p-4">Records Management</div>,
      },
      {
        path: "reports",
        element: <div className="p-4">Reports Generation</div>,
      },
      {
        path: "profile",
        element: <div className="p-4">My Profile</div>,
      },
      {
        path: "help",
        element: <div className="p-4">Help & Support</div>,
      },
    ],
  },

  // Top-level dashboard route that redirects based on user role
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardRedirect />
      </ProtectedRoute>
    ),
  },
  
  // Additional dashboard routes for common paths
  {
    path: "/citizen/dashboard",
    element: <Navigate to="/citizen" replace />,
  },
  {
    path: "/organization/dashboard", 
    element: <Navigate to="/organization" replace />,
  },
  {
    path: "/admin/dashboard",
    element: <Navigate to="/admin" replace />,
  },
  {
    path: "/superadmin/dashboard",
    element: <Navigate to="/superadmin-dashboard" replace />,
  },

  // NCRA Routes (Public Login)
  {
    path: "/ncra/auth/login",
    element: <PublicRoute routeType="ncra"><NCRALogin /></PublicRoute>,
  },
  {
    path: "/ncra/login",
    element: <Navigate to="/ncra/auth/login" replace />,
  },

  // NCRA Routes (Protected)
  {
    path: "/ncra",
    element: <ProtectedRoute requiredRole="ncra"><NCRALayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <NCRADashboard />,
      },
      {
        path: "applications",
        element: <NCRAApplications />,
        children: [
          {
            index: true,
            element: <AllApplications />,
          },
          {
            path: "processing",
            element: <ProcessingApplications />,
          },
          {
            path: "pending",
            element: <PendingApplications />,
          },
        ],
      },
      {
        path: "invoices/*",
        element: <NCRAInvoices />,
      },
      {
        path: "citizens",
        element: <NCRACitizensManagement />,
      },
      {
        path: "rejected",
        element: <RejectedCitizens />,
      },
      {
        path: "wallet",
        element: <NCRAWallet />,
      },
      // Add more NCRA routes here as we build them
      // { path: "appointments", element: <NCRAAppointments /> },
      // { path: "biometric", element: <NCRABiometric /> },
    ],
  },
  
  // Fallback route for 404s
  {
    path: "*",
    element: (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Return to Home
        </a>
      </div>
    ),
  },
]);

// Export routes to make them available for testing
export const exportedForTesting = {};

export default router;
