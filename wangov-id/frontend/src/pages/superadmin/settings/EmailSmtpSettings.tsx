import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface SmtpSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: 'none' | 'tls' | 'ssl';
  fromEmail: string;
  fromName: string;
  replyToEmail: string;
  enabled: boolean;
}

const EmailSmtpSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SmtpSettings>({
    host: '',
    port: 587,
    username: '',
    password: '************',
    encryption: 'tls',
    fromEmail: '',
    fromName: '',
    replyToEmail: '',
    enabled: false
  });
  const [editMode, setEditMode] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchSmtpSettings();
  }, []);

  const fetchSmtpSettings = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        setSettings({
          host: 'smtp.wangov.sl',
          port: 587,
          username: 'notifications@wangov.sl',
          password: '************',
          encryption: 'tls',
          fromEmail: 'no-reply@wangov.sl',
          fromName: 'WanGov ID System',
          replyToEmail: 'support@wangov.sl',
          enabled: true
        });
        setIsLoading(false);
      }, 600);
    } catch (error) {
      console.error('Failed to fetch SMTP settings:', error);
      toast.error('Failed to load SMTP configuration');
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof SmtpSettings, value: string | number | boolean) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };

  const handleSaveSettings = () => {
    toast.success('SMTP settings saved successfully');
    setEditMode(false);
    // In a real app, this would call an API to save the settings
  };

  const handleCancelEdit = () => {
    // Reset to original settings
    fetchSmtpSettings();
    setEditMode(false);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    // In a real app, this would call an API to test the SMTP connection
    setTimeout(() => {
      toast.success('SMTP connection successful');
      setIsTesting(false);
    }, 1500);
  };

  const handleSendTestEmail = () => {
    if (!testEmail) {
      toast.error('Please enter a test email address');
      return;
    }
    
    setIsTesting(true);
    // In a real app, this would call an API to send a test email
    setTimeout(() => {
      toast.success(`Test email sent to ${testEmail}`);
      setIsTesting(false);
      setTestEmail('');
    }, 1500);
  };

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
          <EnvelopeIcon className="w-6 h-6 mr-2 text-green-600" />
          Email & SMTP Settings
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Configure email server settings for system notifications
        </p>
      </div>

      {/* Status and Edit Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${settings.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm font-medium ${settings.enabled ? 'text-green-700' : 'text-red-700'}`}>
            {settings.enabled ? 'SMTP Configured & Active' : 'SMTP Not Configured'}
          </span>
        </div>
        <div className="flex space-x-3">
          {editMode ? (
            <>
              <button
                onClick={handleSaveSettings}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Save Settings
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
              Edit SMTP Settings
            </button>
          )}
        </div>
      </div>

      {/* SMTP Settings Form */}
      <div className="bg-white border rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SMTP Server Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Server Host */}
            <div>
              <label htmlFor="smtp-host" className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Server Host
              </label>
              <input
                type="text"
                id="smtp-host"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={settings.host}
                onChange={(e) => handleInputChange('host', e.target.value)}
                disabled={!editMode}
                placeholder="e.g. smtp.example.com"
              />
            </div>
            
            {/* Server Port */}
            <div>
              <label htmlFor="smtp-port" className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Port
              </label>
              <input
                type="number"
                id="smtp-port"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={settings.port}
                onChange={(e) => handleInputChange('port', parseInt(e.target.value, 10))}
                disabled={!editMode}
                placeholder="e.g. 587"
              />
            </div>
            
            {/* Username */}
            <div>
              <label htmlFor="smtp-username" className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Username
              </label>
              <input
                type="text"
                id="smtp-username"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={settings.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                disabled={!editMode}
                placeholder="username or email address"
              />
            </div>
            
            {/* Password */}
            <div>
              <label htmlFor="smtp-password" className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="smtp-password"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={settings.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={!editMode}
                  placeholder="password"
                />
                {editMode && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <span className="text-gray-500">Hide</span>
                    ) : (
                      <span className="text-gray-500">Show</span>
                    )}
                  </button>
                )}
              </div>
            </div>
            
            {/* Encryption */}
            <div>
              <label htmlFor="smtp-encryption" className="block text-sm font-medium text-gray-700 mb-1">
                Encryption
              </label>
              <select
                id="smtp-encryption"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={settings.encryption}
                onChange={(e) => handleInputChange('encryption', e.target.value as 'none' | 'tls' | 'ssl')}
                disabled={!editMode}
              >
                <option value="none">None</option>
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
              </select>
            </div>
            
            {/* Enable/Disable */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="smtp-enabled"
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                checked={settings.enabled}
                onChange={(e) => handleInputChange('enabled', e.target.checked)}
                disabled={!editMode}
              />
              <label htmlFor="smtp-enabled" className="ml-2 block text-sm text-gray-900">
                Enable SMTP Server
              </label>
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-4 mt-8">Email Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Email */}
            <div>
              <label htmlFor="from-email" className="block text-sm font-medium text-gray-700 mb-1">
                From Email Address
              </label>
              <input
                type="email"
                id="from-email"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={settings.fromEmail}
                onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                disabled={!editMode}
                placeholder="e.g. no-reply@example.com"
              />
            </div>
            
            {/* From Name */}
            <div>
              <label htmlFor="from-name" className="block text-sm font-medium text-gray-700 mb-1">
                From Name
              </label>
              <input
                type="text"
                id="from-name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={settings.fromName}
                onChange={(e) => handleInputChange('fromName', e.target.value)}
                disabled={!editMode}
                placeholder="e.g. System Notifications"
              />
            </div>
            
            {/* Reply-To Email */}
            <div>
              <label htmlFor="reply-to" className="block text-sm font-medium text-gray-700 mb-1">
                Reply-To Email Address
              </label>
              <input
                type="email"
                id="reply-to"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={settings.replyToEmail}
                onChange={(e) => handleInputChange('replyToEmail', e.target.value)}
                disabled={!editMode}
                placeholder="e.g. support@example.com"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Test SMTP Connection & Send Test Email */}
      <div className="bg-white border rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Test SMTP Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Test Connection</h4>
              <p className="text-xs text-gray-600 mb-4">
                Test the connection to the SMTP server with the current settings
              </p>
              <button
                onClick={handleTestConnection}
                disabled={isTesting}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                <ShieldCheckIcon className="w-5 h-5 mr-2 text-blue-500" />
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
            
            <div className="p-4 border rounded-lg bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Send Test Email</h4>
              <div className="mb-3">
                <label htmlFor="test-email" className="block text-xs text-gray-600 mb-1">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  id="test-email"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <button
                onClick={handleSendTestEmail}
                disabled={isTesting}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                <PaperAirplaneIcon className="w-5 h-5 mr-2 text-green-500" />
                {isTesting ? 'Sending...' : 'Send Test Email'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSmtpSettings;
