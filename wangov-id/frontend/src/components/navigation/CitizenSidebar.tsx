import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface CitizenSidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const CitizenSidebar: React.FC<CitizenSidebarProps> = ({ isOpen, closeSidebar }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/citizen/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'My Profile', href: '/citizen/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'Documents', href: '/citizen/documents', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2' },
    { name: 'Services', href: '/citizen/services', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Notifications', href: '/citizen/notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { name: 'Settings', href: '/citizen/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-green-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={closeSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-shrink-0 flex items-center px-4">
            <img
              className="h-8 w-auto"
              src="/sl-coat-of-arms.png"
              alt="Sierra Leone Coat of Arms"
            />
            <span className="ml-2 text-white text-lg font-bold">WanGov-ID</span>
          </div>
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        isActive
                          ? 'bg-green-900 text-white'
                          : 'text-green-100 hover:bg-green-700'
                      }`
                    }
                    onClick={closeSidebar}
                  >
                    <svg
                      className="mr-4 h-6 w-6 text-green-200"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-green-700 p-4">
            <div className="flex items-center">
              <div>
                <div className="h-8 w-8 rounded-full bg-green-700 flex items-center justify-center text-white">
                  ID
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">National ID</p>
                <p className="text-xs text-green-200">SL-12345-A</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-14"></div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-green-800">
              <img
                className="h-8 w-auto"
                src="/sl-coat-of-arms.png"
                alt="Sierra Leone Coat of Arms"
              />
              <span className="ml-2 text-white text-lg font-bold">WanGov-ID</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 bg-green-800 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-green-900 text-white'
                            : 'text-green-100 hover:bg-green-700'
                        }`
                      }
                    >
                      <svg
                        className="mr-3 h-6 w-6 text-green-200"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={item.icon}
                        />
                      </svg>
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>
              <div className="flex-shrink-0 flex border-t border-green-700 bg-green-800 p-4">
                <div className="flex items-center">
                  <div>
                    <div className="h-9 w-9 rounded-full bg-green-700 flex items-center justify-center text-white">
                      ID
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">National ID</p>
                    <p className="text-xs text-green-200">SL-12345-A</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CitizenSidebar;
