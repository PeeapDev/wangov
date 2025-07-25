import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OrganizationStaffLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/organization-staff', icon: 'home' },
    { name: 'Citizens', path: '/organization-staff/citizens', icon: 'users' },
    { name: 'Verification', path: '/organization-staff/verification', icon: 'check' },
    { name: 'Records', path: '/organization-staff/records', icon: 'document' },
    { name: 'Reports', path: '/organization-staff/reports', icon: 'chart-bar' },
    { name: 'My Profile', path: '/organization-staff/profile', icon: 'user' },
    { name: 'Help', path: '/organization-staff/help', icon: 'question' },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'block' : 'hidden'
        } fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform bg-purple-800 overflow-y-auto lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center">
            <Link to="/organization-staff">
              <span className="text-white text-2xl font-semibold">WanGov-ID</span>
              <span className="text-sm text-white block mt-1">Organization Staff Portal</span>
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
                (link.path !== '/organization-staff' && location.pathname.startsWith(link.path))
                  ? 'bg-purple-700 text-white'
                  : 'text-purple-100 hover:bg-purple-700 hover:text-white'
              } flex items-center px-6 py-3 text-sm`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {/* Simple icon representation based on type */}
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
                {link.icon === 'check' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
                {link.icon === 'document' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
                {link.icon === 'user' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                )}
                {link.icon === 'question' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
              (link.path !== '/organization-staff' && location.pathname.startsWith(link.path))
            )?.name || 'Dashboard'}
          </h2>

          {/* Organization name */}
          <div className="hidden md:block">
            <span className="text-gray-700 font-medium">
              {user?.organizationName || 'Organization Staff Portal'}
            </span>
          </div>

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

export default OrganizationStaffLayout;
