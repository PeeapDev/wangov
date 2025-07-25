import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Cog6ToothIcon,
  GlobeAltIcon,
  AdjustmentsHorizontalIcon,
  EnvelopeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('region');

  const settingsTabs = [
    { id: 'region', name: 'Region Settings', path: 'region', icon: <GlobeAltIcon className="w-5 h-5" /> },
    { id: 'app', name: 'Application Settings', path: 'app', icon: <AdjustmentsHorizontalIcon className="w-5 h-5" /> },
    { id: 'email', name: 'Email & SMTP', path: 'email', icon: <EnvelopeIcon className="w-5 h-5" /> },
    { id: 'roles', name: 'Roles & Permissions', path: 'roles', icon: <UserGroupIcon className="w-5 h-5" /> },
    { id: 'sms', name: 'SMS Configuration', path: 'sms', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> },
  ];

  // When a tab is clicked, navigate to its corresponding route
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`/superadmin-dashboard/settings/${tabId}`);
  };

  // Determine active tab from URL
  React.useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && settingsTabs.some(tab => tab.id === path)) {
      setActiveTab(path);
    } else if (location.pathname === '/superadmin-dashboard/settings') {
      // Default to first tab if on base settings URL
      navigate(`/superadmin-dashboard/settings/${settingsTabs[0].id}`);
    }
  }, [location.pathname, navigate]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Cog6ToothIcon className="w-8 h-8 mr-3 text-green-600" />
          System Settings
        </h1>
        <p className="text-gray-600 mt-1">Configure and manage system-wide settings</p>
      </div>

      {/* Tabs and Content Container */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="mr-2">{tab.icon}</div>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Settings;
