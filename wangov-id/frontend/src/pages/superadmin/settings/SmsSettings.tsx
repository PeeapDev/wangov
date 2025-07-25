import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface SmsProvider {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface SmsSettings {
  enabled: boolean;
  defaultProviderId: string;
  accountSid?: string;
  authToken?: string;
  apiKey?: string;
  apiSecret?: string;
  fromNumber?: string;
  sandboxMode: boolean;
  rateLimitPerMinute: number;
  providers: SmsProvider[];
}

const SmsSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SmsSettings>({
    enabled: false,
    defaultProviderId: '',
    accountSid: '',
    authToken: '',
    apiKey: '',
    apiSecret: '',
    fromNumber: '',
    sandboxMode: false,
    rateLimitPerMinute: 0,
    providers: []
  });
  const [editMode, setEditMode] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [testMessage, setTestMessage] = useState('This is a test message from WanGov ID System.');
  const [isTesting, setIsTesting] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);

  useEffect(() => {
    fetchSmsSettings();
  }, []);

  const fetchSmsSettings = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        setSettings({
          enabled: true,
          defaultProviderId: 'twilio',
          accountSid: '',
          authToken: '',
          apiKey: '',
          apiSecret: '************',
          fromNumber: '+15551234567',
          sandboxMode: true,
          rateLimitPerMinute: 60,
          providers: [
            {
              id: 'twilio',
              name: 'Twilio',
              description: 'Twilio SMS messaging service',
              isActive: true
            },
            {
              id: 'africastalking',
              name: 'Africa\'s Talking',
              description: 'Africa\'s Talking SMS gateway',
              isActive: false
            },
            {
              id: 'vonage',
              name: 'Vonage',
              description: 'Vonage (formerly Nexmo) SMS API',
              isActive: false
            }
          ]
        });
        setIsLoading(false);
      }, 600);
    } catch (error) {
      console.error('Failed to fetch SMS settings:', error);
      toast.error('Failed to load SMS configuration');
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };

  const handleProviderChange = (providerId: string) => {
    setSettings({
      ...settings,
      defaultProviderId: providerId
    });
  };

  const toggleProviderActive = (providerId: string) => {
    setSettings({
      ...settings,
      providers: settings.providers.map(provider =>
        provider.id === providerId
          ? { ...provider, isActive: !provider.isActive }
          : provider
      )
    });
  };

  const handleSaveSettings = () => {
    toast.success('SMS settings saved successfully');
    setEditMode(false);
    // In a real app, this would call an API to save the settings
  };

  const handleCancelEdit = () => {
    // Reset to original settings
    fetchSmsSettings();
    setEditMode(false);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    // In a real app, this would call an API to test the SMS provider connection
    setTimeout(() => {
      toast.success('SMS provider connection successful');
      setIsTesting(false);
    }, 1500);
  };

  const handleSendTestSms = () => {
    if (!testPhoneNumber) {
      toast.error('Please enter a test phone number');
      return;
    }
    
    setIsTesting(true);
    // In a real app, this would call an API to send a test SMS
    setTimeout(() => {
      toast.success(`Test SMS sent to ${testPhoneNumber}`);
      setIsTesting(false);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const activeProvider = settings.providers.find(p => p.id === settings.defaultProviderId);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2 text-green-600" />
          SMS Configuration
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Configure SMS messaging service for notifications and verification codes
        </p>
      </div>

      {/* Status and Edit Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${settings.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm font-medium ${settings.enabled ? 'text-green-700' : 'text-red-700'}`}>
            {settings.enabled ? 'SMS Service Active' : 'SMS Service Inactive'}
          </span>
          {settings.sandboxMode && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
              Sandbox Mode
            </span>
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
              Edit SMS Settings
            </button>
          )}
        </div>
      </div>

      {/* General SMS Settings */}
      <div className="bg-white border rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">General SMS Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Enable SMS */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sms-enabled"
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                checked={settings.enabled}
                onChange={(e) => handleInputChange('enabled', e.target.checked)}
                disabled={!editMode}
              />
              <label htmlFor="sms-enabled" className="ml-2 block text-sm text-gray-900">
                Enable SMS Messaging
              </label>
            </div>
            
            {/* Sandbox Mode */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sandbox-mode"
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                checked={settings.sandboxMode}
                onChange={(e) => handleInputChange('sandboxMode', e.target.checked)}
                disabled={!editMode}
              />
              <label htmlFor="sandbox-mode" className="ml-2 block text-sm text-gray-900">
                Sandbox Mode
              </label>
              <span className="ml-1 text-xs text-gray-500">(no real SMS will be sent)</span>
            </div>
            
            {/* Rate Limit */}
            <div>
              <label htmlFor="rate-limit" className="block text-sm font-medium text-gray-700 mb-1">
                Rate Limit (per minute)
              </label>
              <input
                type="number"
                id="rate-limit"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={settings.rateLimitPerMinute}
                onChange={(e) => handleInputChange('rateLimitPerMinute', parseInt(e.target.value, 10))}
                disabled={!editMode}
              />
            </div>
            
            {/* From Number */}
            <div>
              <label htmlFor="from-number" className="block text-sm font-medium text-gray-700 mb-1">
                Default Sender Number
              </label>
              <input
                type="text"
                id="from-number"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={settings.fromNumber}
                onChange={(e) => handleInputChange('fromNumber', e.target.value)}
                disabled={!editMode}
                placeholder="e.g. +15551234567"
              />
              <p className="mt-1 text-xs text-gray-500">
                Format: +[country code][number] (e.g. +15551234567)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SMS Providers */}
      <div className="bg-white border rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">SMS Providers</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Default Provider
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {settings.providers.map((provider) => (
                <div
                  key={provider.id}
                  className={`border rounded-lg p-4 cursor-pointer ${
                    settings.defaultProviderId === provider.id
                      ? 'border-green-500 ring-2 ring-green-200'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!provider.isActive ? 'opacity-60' : ''}`}
                  onClick={() => editMode && provider.isActive && handleProviderChange(provider.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{provider.name}</div>
                    {editMode && (
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={provider.isActive}
                          onChange={() => toggleProviderActive(provider.id)}
                        />
                        <div className={`w-9 h-5 bg-gray-200 rounded-full peer ${
                          provider.isActive ? 'peer-checked:bg-green-600' : ''
                        } peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all`}></div>
                      </div>
                    )}
                  </div>
                  {provider.description && (
                    <p className="text-xs text-gray-500">{provider.description}</p>
                  )}
                  {settings.defaultProviderId === provider.id && !provider.isActive && editMode && (
                    <div className="mt-2 text-xs text-amber-600">
                      Warning: Default provider is inactive
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Provider specific settings */}
          {activeProvider && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-base font-medium text-gray-900 mb-4">
                {activeProvider.name} Configuration
              </h4>
              
              {activeProvider.id === 'twilio' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Account SID */}
                  <div>
                    <label htmlFor="account-sid" className="block text-sm font-medium text-gray-700 mb-1">
                      Account SID
                    </label>
                    <input
                      type="text"
                      id="account-sid"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      value={settings.accountSid}
                      onChange={(e) => handleInputChange('accountSid', e.target.value)}
                      disabled={!editMode}
                      placeholder="Enter your Twilio Account SID"
                    />
                  </div>
                  
                  {/* Auth Token */}
                  <div>
                    <label htmlFor="auth-token" className="block text-sm font-medium text-gray-700 mb-1">
                      Auth Token
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets ? 'text' : 'password'}
                        id="auth-token"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        value={settings.authToken}
                        onChange={(e) => handleInputChange('authToken', e.target.value)}
                        disabled={!editMode}
                        placeholder="Enter your Twilio Auth Token"
                      />
                      {editMode && (
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          onClick={() => setShowSecrets(!showSecrets)}
                        >
                          <span className="text-gray-500">
                            {showSecrets ? 'Hide' : 'Show'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* API Key */}
                  <div>
                    <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">
                      API Key (optional)
                    </label>
                    <input
                      type={showSecrets ? 'text' : 'password'}
                      id="api-key"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      value={settings.apiKey}
                      onChange={(e) => handleInputChange('apiKey', e.target.value)}
                      disabled={!editMode}
                      placeholder="Enter your Twilio API Key"
                    />
                  </div>
                  
                  {/* API Secret */}
                  <div>
                    <label htmlFor="api-secret" className="block text-sm font-medium text-gray-700 mb-1">
                      API Secret (optional)
                    </label>
                    <input
                      type={showSecrets ? 'text' : 'password'}
                      id="api-secret"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      value={settings.apiSecret}
                      onChange={(e) => handleInputChange('apiSecret', e.target.value)}
                      disabled={!editMode}
                      placeholder="Enter API secret"
                    />
                  </div>
                </div>
              )}
              
              {activeProvider.id === 'africastalking' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      placeholder="Enter username"
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <input
                      type={showSecrets ? 'text' : 'password'}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      placeholder="Enter API key"
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Code
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      placeholder="Enter short code"
                      disabled={!editMode}
                    />
                  </div>
                </div>
              )}
              
              {activeProvider.id === 'vonage' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      placeholder="Enter API key"
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Secret
                    </label>
                    <input
                      type={showSecrets ? 'text' : 'password'}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      placeholder="Enter API secret"
                      disabled={!editMode}
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <InformationCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {activeProvider.id === 'twilio' 
                      ? 'You can find your Twilio credentials in your Twilio Dashboard under Account Info.'
                      : activeProvider.id === 'africastalking'
                      ? 'You can find your Africa\'s Talking credentials in your dashboard under API Key section.'
                      : 'You can find your Vonage credentials in your dashboard under API Settings.'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Test SMS Configuration */}
      <div className="bg-white border rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Test SMS Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Test Provider Connection</h4>
              <p className="text-xs text-gray-600 mb-4">
                Test the connection to the SMS provider with the current settings
              </p>
              <button
                onClick={handleTestConnection}
                disabled={isTesting || !settings.enabled}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                <ShieldCheckIcon className="w-5 h-5 mr-2 text-blue-500" />
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
            
            <div className="p-4 border rounded-lg bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Send Test SMS</h4>
              <div className="mb-3">
                <label htmlFor="test-phone" className="block text-xs text-gray-600 mb-1">
                  Recipient Phone Number
                </label>
                <input
                  type="text"
                  id="test-phone"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                  value={testPhoneNumber}
                  onChange={(e) => setTestPhoneNumber(e.target.value)}
                  placeholder="e.g. +15551234567"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="test-message" className="block text-xs text-gray-600 mb-1">
                  Test Message
                </label>
                <textarea
                  id="test-message"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={2}
                />
              </div>
              <button
                onClick={handleSendTestSms}
                disabled={isTesting || !settings.enabled}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                <PaperAirplaneIcon className="w-5 h-5 mr-2 text-green-500" />
                {isTesting ? 'Sending...' : 'Send Test SMS'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsSettings;
