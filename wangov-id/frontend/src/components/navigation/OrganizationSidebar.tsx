import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface SubMenuItem {
  name: string;
  href: string;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  subItems?: SubMenuItem[];
}

interface OrganizationSidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const OrganizationSidebar: React.FC<OrganizationSidebarProps> = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemName: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedItems(newExpanded);
  };

  const navigation = [
    { name: 'Dashboard', href: '/organization', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Business Registration', href: '/organization/business-registration', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { name: 'Verification', href: '/organization/verification', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { name: 'Staff Management', href: '/organization/staff', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { 
      name: 'API Keys', 
      href: '/organization/api-keys', 
      icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
      subItems: [
        { name: 'Developer Sandbox', href: '/organization/developer-sandbox' },
        { name: 'SDK Documentation', href: '/organization/sdk-documentation' }
      ]
    },
    { name: 'Analytics', href: '/organization/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { 
      name: 'Invoice Management', 
      href: '/organization/invoices', 
      icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
      subItems: [
        { name: 'All Invoices', href: '/organization/invoices' },
        { name: 'Create Invoice', href: '/organization/invoices/create' },
        { name: 'Templates', href: '/organization/invoices/templates' },
        { name: 'Settings', href: '/organization/invoices/settings' }
      ]
    },
    { name: 'Settings', href: '/organization/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
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
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-blue-800">
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
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isExpanded = expandedItems.has(item.name);
                const isSubItemActive = hasSubItems && item.subItems?.some(subItem => location.pathname === subItem.href);
                
                return (
                  <div key={item.name}>
                    {hasSubItems ? (
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={`group flex items-center w-full px-2 py-2 text-base font-medium rounded-md ${
                          isActive || isSubItemActive
                            ? 'bg-blue-900 text-white'
                            : 'text-blue-100 hover:bg-blue-700'
                        }`}
                      >
                        <svg
                          className="mr-4 h-6 w-6 text-blue-200"
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
                        <span className="flex-1 text-left">{item.name}</span>
                        <svg
                          className={`ml-2 h-4 w-4 transform transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    ) : (
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                            isActive
                              ? 'bg-blue-900 text-white'
                              : 'text-blue-100 hover:bg-blue-700'
                          }`
                        }
                        onClick={closeSidebar}
                      >
                        <svg
                          className="mr-4 h-6 w-6 text-blue-200"
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
                    )}
                    
                    {/* Sub-menu items */}
                    {hasSubItems && isExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.subItems?.map((subItem) => (
                          <NavLink
                            key={subItem.name}
                            to={subItem.href}
                            className={({ isActive }) =>
                              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                isActive
                                  ? 'bg-blue-800 text-white'
                                  : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                              }`
                            }
                            onClick={closeSidebar}
                          >
                            <span className="mr-3 h-1 w-1 bg-blue-300 rounded-full"></span>
                            {subItem.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-blue-700 p-4">
            <div className="flex items-center">
              <div>
                <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center text-white">
                  ORG
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Organization</p>
                <p className="text-xs text-blue-200">ID: ORG-56789</p>
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
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-800">
              <img
                className="h-8 w-auto"
                src="/sl-coat-of-arms.png"
                alt="Sierra Leone Coat of Arms"
              />
              <span className="ml-2 text-white text-lg font-bold">WanGov-ID</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 bg-blue-800 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-blue-900 text-white'
                            : 'text-blue-100 hover:bg-blue-700'
                        }`
                      }
                    >
                      <svg
                        className="mr-3 h-6 w-6 text-blue-200"
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
              <div className="flex-shrink-0 flex border-t border-blue-700 bg-blue-800 p-4">
                <div className="flex items-center">
                  <div>
                    <div className="h-9 w-9 rounded-full bg-blue-700 flex items-center justify-center text-white">
                      ORG
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Organization</p>
                    <p className="text-xs text-blue-200">ID: ORG-56789</p>
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

export default OrganizationSidebar;
