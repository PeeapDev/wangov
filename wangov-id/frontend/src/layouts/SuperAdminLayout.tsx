import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SuperAdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/superadmin-dashboard', icon: 'home' },
    { name: 'Citizens', path: '/superadmin-dashboard/citizens', icon: 'users' },
    { name: 'Organizations', path: '/superadmin-dashboard/organizations', icon: 'building' },
    { name: 'System Admin', path: '/superadmin-dashboard/admins', icon: 'shield' },
    { name: 'Business Approval', path: '/superadmin-dashboard/business-approval', icon: 'clipboard-check' },
    { name: 'API Key Approval', path: '/superadmin-dashboard/api-key-approval', icon: 'key' },
    { name: 'Provider Management', path: '/superadmin-dashboard/provider', icon: 'building-office' },
    { name: 'Invoice Management', path: '/superadmin-dashboard/invoices', icon: 'document-text' },
    { name: 'API Management', path: '/superadmin-dashboard/api', icon: 'code' },
    { name: 'System Logs', path: '/superadmin-dashboard/logs', icon: 'list' },
    { name: 'Analytics', path: '/superadmin-dashboard/analytics', icon: 'chart-bar' },
    { name: 'Communication', path: '/superadmin-dashboard/communication', icon: 'chat-bubble-left-right' },
    { name: 'Settings', path: '/superadmin-dashboard/settings', icon: 'cog' },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'block' : 'hidden'
        } fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform bg-green-900 overflow-y-auto lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center">
            <Link to="/superadmin-dashboard">
              <span className="text-white text-2xl font-semibold">WanGov-ID</span>
              <span className="text-sm text-white block mt-1">Super Admin Portal</span>
            </Link>
          </div>
        </div>

        <nav className="mt-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${
                location.pathname === link.path || 
                (link.path !== '/superadmin-dashboard' && location.pathname.startsWith(link.path))
                  ? 'bg-green-800 text-white'
                  : 'text-green-100 hover:bg-green-800 hover:text-white'
              } flex items-center px-6 py-3 text-sm`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {/* Simple icon representation */}
                {link.icon === 'home' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                )}
                {link.icon === 'users' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                )}
                {link.icon === 'building' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                )}
                {link.icon === 'shield' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                )}
                {link.icon === 'code' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                )}
                {link.icon === 'list' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                )}
                {link.icon === 'chart-bar' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                )}
                {link.icon === 'lock' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                )}
                {link.icon === 'cog' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                )}
                {link.icon === 'clipboard-check' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                )}
                {link.icon === 'key' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                )}
                {link.icon === 'building-office' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.75 21h16.5M4.5 3h15l-.75 18h-13.5L4.5 3zM7.5 6v3m3-3v3m3-3v3m3-3v3M7.5 12v3m3-3v3m3-3v3m3-3v3"
                  />
                )}
                {link.icon === 'chat-bubble-left-right' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                )}
              </svg>
              <span className="mx-3">{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white shadow">
          {/* Mobile menu button */}
          <button
            className="text-gray-500 focus:outline-none lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6H20M4 12H20M4 18H11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>

          {/* Title based on current path */}
          <h2 className="text-xl font-semibold text-gray-700">
            {navLinks.find(link => 
              location.pathname === link.path || 
              (link.path !== '/superadmin-dashboard' && location.pathname.startsWith(link.path))
            )?.name || 'Dashboard'}
          </h2>

          {/* User dropdown */}
          <div className="relative flex items-center space-x-3">
            <span className="text-gray-700">
              {user?.firstName} {user?.lastName}
            </span>
            <button 
              className="text-red-600 hover:text-red-800"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
