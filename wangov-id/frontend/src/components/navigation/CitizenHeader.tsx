import React, { useState, Fragment } from 'react';
import SearchBar from '../search/SearchBar';
import { useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useAuth, User } from '../../contexts/AuthContext';

interface CitizenHeaderProps {
  openSidebar: () => void;
  user: User | null;
}

const CitizenHeader: React.FC<CitizenHeaderProps> = ({ openSidebar, user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 md:hidden"
              onClick={openSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-green-800">Citizen Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center">
            {/* Search Bar */}
            <div className="hidden md:block w-64 lg:w-96 mr-4">
              <SearchBar 
                placeholder="Search your applications and services..." 
                variant="citizen" 
                userRole="citizen"
              />
            </div>
            <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
              {/* Notifications */}
              <div className="relative">
                <button
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <span className="sr-only">View notifications</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
                {/* Notification dropdown */}
                {notificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">Notifications</p>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="px-4 py-3 border-b">
                          <p className="text-sm text-gray-700">Your ID verification has been approved.</p>
                          <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                        </div>
                        <div className="px-4 py-3 border-b">
                          <p className="text-sm text-gray-700">Document renewal reminder: Your driver's license will expire in 30 days.</p>
                          <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-sm text-gray-700">Welcome to WanGov-ID! Complete your profile for full access.</p>
                          <p className="text-xs text-gray-500 mt-1">1 week ago</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t text-center">
                        <button className="text-sm text-green-600 hover:text-green-800">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <Menu as="div" className="ml-3 relative">
                <div>
                  <Menu.Button className="bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-green-800 flex items-center justify-center text-white uppercase">
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/citizen/profile"
                            className={`block px-4 py-2 text-sm ${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            }`}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/citizen/settings"
                            className={`block px-4 py-2 text-sm ${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            }`}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            }`}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CitizenHeader;
