import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  AdjustmentsHorizontalIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface AppSetting {
  id: string;
  name: string;
  key: string;
  value: string | number | boolean;
  description: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: string[];
  category: 'general' | 'security' | 'notification' | 'verification' | 'appearance';
  updatedAt: string;
}

const AppSettings: React.FC = () => {
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const categories = [
    { id: 'general', name: 'General Settings' },
    { id: 'security', name: 'Security' },
    { id: 'notification', name: 'Notifications' },
    { id: 'verification', name: 'Verification' },
    { id: 'appearance', name: 'Appearance' }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockSettings: AppSetting[] = [
          {
            id: '1',
            name: 'System Name',
            key: 'system_name',
            value: 'WanGov ID System',
            description: 'The name of the system displayed in the UI and emails',
            type: 'text',
            category: 'general',
            updatedAt: '2024-01-15T10:30:00Z',
          },
          {
            id: '2',
            name: 'Application Version',
            key: 'app_version',
            value: '2.3.5',
            description: 'Current version of the application',
            type: 'text',
            category: 'general',
            updatedAt: '2024-01-15T10:30:00Z',
          },
          {
            id: '3',
            name: 'Support Email',
            key: 'support_email',
            value: 'support@wangov.sl',
            description: 'Email address for user support inquiries',
            type: 'text',
            category: 'general',
            updatedAt: '2024-01-10T09:45:00Z',
          },
          {
            id: '4',
            name: 'Session Timeout',
            key: 'session_timeout',
            value: 30,
            description: 'User session timeout in minutes',
            type: 'number',
            category: 'security',
            updatedAt: '2024-01-20T14:15:00Z',
          },
          {
            id: '5',
            name: 'Password Expiry Days',
            key: 'password_expiry',
            value: 90,
            description: 'Number of days before password must be changed',
            type: 'number',
            category: 'security',
            updatedAt: '2023-12-15T08:30:00Z',
          },
          {
            id: '6',
            name: 'Enable 2FA',
            key: 'enable_2fa',
            value: true,
            description: 'Require two-factor authentication for all admin users',
            type: 'boolean',
            category: 'security',
            updatedAt: '2024-01-05T16:30:00Z',
          },
          {
            id: '7',
            name: 'Failed Login Attempts',
            key: 'max_login_attempts',
            value: 5,
            description: 'Maximum failed login attempts before account lockout',
            type: 'number',
            category: 'security',
            updatedAt: '2023-12-10T11:20:00Z',
          },
          {
            id: '8',
            name: 'Email Notifications',
            key: 'email_notifications',
            value: true,
            description: 'Send email notifications for important system events',
            type: 'boolean',
            category: 'notification',
            updatedAt: '2024-01-02T13:15:00Z',
          },
          {
            id: '9',
            name: 'SMS Notifications',
            key: 'sms_notifications',
            value: true,
            description: 'Send SMS notifications for critical alerts',
            type: 'boolean',
            category: 'notification',
            updatedAt: '2023-12-20T08:45:00Z',
          },
          {
            id: '10',
            name: 'Verification Method',
            key: 'primary_verification',
            value: 'biometric',
            description: 'Primary method for identity verification',
            type: 'select',
            options: ['document', 'biometric', 'hybrid'],
            category: 'verification',
            updatedAt: '2023-11-15T14:10:00Z',
          },
          {
            id: '11',
            name: 'Theme Color',
            key: 'theme_color',
            value: 'green',
            description: 'Primary color theme for the application',
            type: 'select',
            options: ['green', 'blue', 'purple', 'orange'],
            category: 'appearance',
            updatedAt: '2023-12-01T09:00:00Z',
          },
          {
            id: '12',
            name: 'Dark Mode',
            key: 'dark_mode',
            value: false,
            description: 'Enable dark mode for admin interface',
            type: 'boolean',
            category: 'appearance',
            updatedAt: '2024-01-08T10:25:00Z',
          }
        ];
        
        setSettings(mockSettings);
        
        // Initialize form values
        const initialValues: Record<string, any> = {};
        mockSettings.forEach(setting => {
          initialValues[setting.key] = setting.value;
        });
        setFormValues(initialValues);
        
        setIsLoading(false);
      }, 600);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load application settings');
      setIsLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string | number | boolean) => {
    setFormValues({
      ...formValues,
      [key]: value
    });
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
    setEditMode(false);
    // In a real app, this would call an API to save the settings
  };

  const handleCancelEdit = () => {
    // Reset form values to original settings
    const originalValues: Record<string, any> = {};
    settings.forEach(setting => {
      originalValues[setting.key] = setting.value;
    });
    setFormValues(originalValues);
    setEditMode(false);
  };

  const renderSettingInput = (setting: AppSetting) => {
    switch (setting.type) {
      case 'text':
        return (
          <input
            type="text"
            id={setting.key}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={formValues[setting.key] as string}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            disabled={!editMode}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            id={setting.key}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={formValues[setting.key] as number}
            onChange={(e) => handleInputChange(setting.key, parseInt(e.target.value, 10))}
            disabled={!editMode}
          />
        );
      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={setting.key}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              checked={formValues[setting.key] as boolean}
              onChange={(e) => handleInputChange(setting.key, e.target.checked)}
              disabled={!editMode}
            />
            <label htmlFor={setting.key} className="ml-2 block text-sm text-gray-900">
              {formValues[setting.key] ? 'Enabled' : 'Disabled'}
            </label>
          </div>
        );
      case 'select':
        return (
          <select
            id={setting.key}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={formValues[setting.key] as string}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            disabled={!editMode}
          >
            {setting.options?.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  // Filter settings by active category
  const filteredSettings = settings.filter(setting => setting.category === activeCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <AdjustmentsHorizontalIcon className="w-6 h-6 mr-2 text-green-600" />
          Application Settings
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Configure system-wide application settings
        </p>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`py-2 px-3 text-sm font-medium border-b-2 ${
                activeCategory === category.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Edit/Save Controls */}
      <div className="flex justify-between mb-4">
        <div className="text-sm text-gray-500">
          {editMode ? (
            <span className="flex items-center text-amber-600">
              <InformationCircleIcon className="w-5 h-5 mr-1" />
              You are in edit mode. Make your changes and save.
            </span>
          ) : (
            <span>Click "Edit Settings" to make changes</span>
          )}
        </div>
        <div className="flex space-x-3">
          {editMode ? (
            <>
              <button
                onClick={handleSaveSettings}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                <XCircleIcon className="w-5 h-5 mr-2" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
              Edit Settings
            </button>
          )}
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white border rounded-lg shadow overflow-hidden">
        {filteredSettings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No settings found in this category
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredSettings.map((setting) => (
              <div key={setting.id} className="p-6 hover:bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                  <div className="col-span-1 lg:col-span-1">
                    <label htmlFor={setting.key} className="block text-sm font-medium text-gray-700">
                      {setting.name}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">{setting.description}</p>
                  </div>
                  <div className="col-span-1 lg:col-span-2">
                    {renderSettingInput(setting)}
                  </div>
                  <div className="col-span-1 text-right text-xs text-gray-500">
                    Last updated: {new Date(setting.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Operations Section - for General category only */}
      {activeCategory === 'general' && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Operations</h3>
          <div className="bg-white border rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="text-sm font-medium text-gray-900 mb-2">System Backup</h4>
                <p className="text-xs text-gray-600 mb-4">Create a full backup of all system data and configuration</p>
                <button
                  onClick={() => toast.success('Backup initiated')}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                >
                  <CloudArrowUpIcon className="w-5 h-5 mr-2 text-blue-500" />
                  Create Backup
                </button>
              </div>
              
              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Clear Cache</h4>
                <p className="text-xs text-gray-600 mb-4">Clear system cache to resolve potential performance issues</p>
                <button
                  onClick={() => toast.success('Cache cleared')}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                >
                  <ArrowPathIcon className="w-5 h-5 mr-2 text-amber-500" />
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppSettings;
