import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { 
  HomeIcon,
  DocumentTextIcon,
  CalendarIcon,
  FingerPrintIcon,
  CreditCardIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const NCRALayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/ncra', icon: HomeIcon },
    { name: 'Applications', href: '/ncra/applications', icon: DocumentTextIcon },
    { name: 'Appointments', href: '/ncra/appointments', icon: CalendarIcon },
    { name: 'Biometric Capture', href: '/ncra/biometric', icon: FingerPrintIcon },
    { name: 'ID Cards', href: '/ncra/id-cards', icon: CreditCardIcon },
    { name: 'Invoice Management', href: '/ncra/invoices', icon: DocumentTextIcon },
    { name: 'Notifications', href: '/ncra/notifications', icon: BellIcon },
    { name: 'Administration', href: '/ncra/admin', icon: Cog6ToothIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/ncra') {
      return location.pathname === '/ncra';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-blue-900 text-white flex flex-col">
          {/* Logo */}
          <div className="p-6">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-blue-300" />
              <div className="ml-3">
                <h1 className="text-xl font-bold">NCRA</h1>
                <p className="text-blue-200 text-sm">Civil Registration Authority</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-blue-800">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.email || 'NCRA Staff'
                  }
                </p>
                <p className="text-xs text-blue-200">{user?.role || 'Staff'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Navigation Bar */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <nav className="flex space-x-4">
                  <Link
                    to="/"
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    WanGov
                  </Link>
                  <span className="text-gray-300">/</span>
                  <span className="text-sm font-medium text-gray-900">NCRA</span>
                </nav>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    Sierra Leone Government
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default NCRALayout;
