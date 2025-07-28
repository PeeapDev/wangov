import React, { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon,
  KeyIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Business {
  id: string;
  name: string;
  status: 'approved' | 'pending' | 'rejected';
  ssoEnabled: boolean;
  clientId?: string;
  clientSecret?: string;
  createdAt: string;
}

const BusinessSSOManagement: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('businesses');
  const [activeDocTab, setActiveDocTab] = useState('overview');
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setIsLoading(true);
      // Mock data - replace with actual API call
      setTimeout(() => {
        setBusinesses([
          {
            id: '1',
            name: 'TechCorp Solutions',
            status: 'approved',
            ssoEnabled: true,
            clientId: 'wangov_techcorp_12345',
            clientSecret: 'sk_live_abcd1234efgh5678ijkl9012mnop3456',
            createdAt: '2024-01-15'
          },
          {
            id: '2', 
            name: 'HealthPlus Medical',
            status: 'approved',
            ssoEnabled: false,
            createdAt: '2024-01-20'
          },
          {
            id: '3',
            name: 'EduLearn Institute',
            status: 'pending',
            ssoEnabled: false,
            createdAt: '2024-01-25'
          }
        ]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
      toast.error('Failed to load businesses');
      setIsLoading(false);
    }
  };

  const enableSSO = async (businessId: string) => {
    try {
      // Generate mock credentials
      const clientId = `wangov_${businessId}_${Math.random().toString(36).substr(2, 9)}`;
      const clientSecret = `sk_live_${Math.random().toString(36).substr(2, 32)}`;
      
      setBusinesses(prev => prev.map(business => 
        business.id === businessId 
          ? { ...business, ssoEnabled: true, clientId, clientSecret }
          : business
      ));
      
      toast.success('SSO enabled successfully! Client credentials generated.');
    } catch (error) {
      console.error('Failed to enable SSO:', error);
      toast.error('Failed to enable SSO');
    }
  };

  const disableSSO = async (businessId: string) => {
    try {
      setBusinesses(prev => prev.map(business => 
        business.id === businessId 
          ? { ...business, ssoEnabled: false, clientId: undefined, clientSecret: undefined }
          : business
      ));
      
      toast.success('SSO disabled successfully');
    } catch (error) {
      console.error('Failed to disable SSO:', error);
      toast.error('Failed to disable SSO');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const toggleSecretVisibility = (businessId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [businessId]: !prev[businessId]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">SSO Management</h1>
            <p className="text-gray-600 mt-1">Manage Single Sign-On for your registered businesses</p>
          </div>
          <button
            onClick={fetchBusinesses}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Refresh
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('businesses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'businesses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BuildingOfficeIcon className="w-5 h-5 inline mr-2" />
              Registered Businesses
            </button>
            <button
              onClick={() => setActiveTab('configurations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'configurations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <KeyIcon className="w-5 h-5 inline mr-2" />
              SSO Configurations
            </button>
            <button
              onClick={() => setActiveTab('documentation')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documentation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ClipboardDocumentIcon className="w-5 h-5 inline mr-2" />
              Documentation
            </button>
          </nav>
        </div>

        {/* Businesses Tab */}
        {activeTab === 'businesses' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <BuildingOfficeIcon className="h-5 w-5 text-blue-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Business-Specific SSO</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Enable SSO for approved businesses. Each business gets unique OAuth credentials for secure integration.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {businesses.map((business) => (
                <div key={business.id} className="bg-white shadow rounded-lg border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{business.name}</h3>
                        <div className="flex items-center mt-1 space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            business.status === 'approved' 
                              ? 'bg-green-100 text-green-800'
                              : business.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {business.status === 'approved' && <CheckCircleIcon className="w-3 h-3 mr-1" />}
                            {business.status === 'pending' && <ClockIcon className="w-3 h-3 mr-1" />}
                            {business.status === 'rejected' && <XCircleIcon className="w-3 h-3 mr-1" />}
                            {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            business.ssoEnabled 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {business.ssoEnabled ? 'SSO Enabled' : 'SSO Disabled'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {business.status === 'approved' && (
                          <>
                            {!business.ssoEnabled ? (
                              <button
                                onClick={() => enableSSO(business.id)}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                              >
                                <PlusIcon className="w-4 h-4 inline mr-1" />
                                Enable SSO
                              </button>
                            ) : (
                              <button
                                onClick={() => disableSSO(business.id)}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                              >
                                Disable SSO
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {business.ssoEnabled && business.clientId && business.clientSecret && (
                    <div className="px-6 py-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">OAuth Credentials</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Client ID</label>
                          <div className="mt-1 flex">
                            <input
                              type="text"
                              value={business.clientId}
                              readOnly
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                            />
                            <button
                              onClick={() => copyToClipboard(business.clientId!, 'Client ID')}
                              className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                            >
                              <ClipboardDocumentIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Client Secret</label>
                          <div className="mt-1 flex">
                            <input
                              type={showSecrets[business.id] ? 'text' : 'password'}
                              value={business.clientSecret}
                              readOnly
                              className="flex-1 px-3 py-2 border border-gray-300 bg-gray-50 text-sm"
                            />
                            <button
                              onClick={() => toggleSecretVisibility(business.id)}
                              className="px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 hover:bg-gray-100"
                            >
                              {showSecrets[business.id] ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(business.clientSecret!, 'Client Secret')}
                              className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                            >
                              <ClipboardDocumentIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Integration Instructions</h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Authorization URL:</strong> http://localhost:3010/authorize</p>
                          <p><strong>Token URL:</strong> http://localhost:3010/token</p>
                          <p><strong>User Info URL:</strong> http://localhost:3010/userinfo</p>
                          <p><strong>Redirect URI:</strong> Configure in your application settings</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configurations Tab */}
        {activeTab === 'configurations' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Active SSO Configurations</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {businesses.filter(b => b.ssoEnabled).map((business) => (
                    <div key={business.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                      <div>
                        <h4 className="font-medium text-gray-900">{business.name}</h4>
                        <p className="text-sm text-gray-500">Client ID: {business.clientId}</p>
                        <p className="text-sm text-gray-500">Created: {business.createdAt}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                  {businesses.filter(b => b.ssoEnabled).length === 0 && (
                    <p className="text-gray-500 text-center py-8">No active SSO configurations</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'documentation' && (
          <div className="space-y-6">
            {/* API Testing Section - Outside of nested tabs */}
            <div className="bg-white shadow rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">🚀 Test OAuth Endpoints</h3>
                <p className="text-sm text-gray-600 mt-1">Interactive testing interface for WanGov ID OAuth flow</p>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Test Credentials */}
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h4 className="font-medium text-blue-900 mb-3">🔑 Test Credentials</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Client ID:</span>
                        <code className="bg-blue-100 px-2 py-1 rounded text-xs">wangov_techcorp_12345</code>
                        <button 
                          onClick={() => copyToClipboard('wangov_techcorp_12345', 'Client ID')}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Client Secret:</span>
                        <code className="bg-blue-100 px-2 py-1 rounded text-xs">sk_live_abcd1234efgh5678ijkl9012mnop3456</code>
                        <button 
                          onClick={() => copyToClipboard('sk_live_abcd1234efgh5678ijkl9012mnop3456', 'Client Secret')}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Test */}
                  <div className="bg-green-50 p-4 rounded-md">
                    <h4 className="font-medium text-green-900 mb-3">⚡ Quick Test</h4>
                    <div className="space-y-3">
                      <button 
                        onClick={() => window.open('http://localhost:3010/authorize?client_id=wangov_techcorp_12345&redirect_uri=http://localhost:3003/test-callback&response_type=code&scope=openid+profile+email', '_blank')}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                      >
                        🔗 Test Authorization Flow
                      </button>
                      <p className="text-xs text-green-700">Opens OAuth login in new tab</p>
                    </div>
                  </div>
                </div>

                {/* OAuth Endpoints */}
                <div className="mt-6 bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-3">🌐 OAuth Endpoints</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Authorization:</span>
                      <div className="font-mono text-xs bg-white p-2 rounded mt-1">http://localhost:3010/authorize</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Token:</span>
                      <div className="font-mono text-xs bg-white p-2 rounded mt-1">http://localhost:3010/token</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">User Info:</span>
                      <div className="font-mono text-xs bg-white p-2 rounded mt-1">http://localhost:3010/userinfo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documentation with Nested Tabs */}
            <div className="bg-white shadow rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">📚 Integration Documentation</h3>
              </div>
              <div className="px-6 py-4">
                {/* Nested Tab Navigation */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8">
                    {[
                      { id: 'overview', label: '📋 Overview', icon: '📋' },
                      { id: 'nodejs', label: '🟢 Node.js', icon: '🟢' },
                      { id: 'python', label: '🐍 Python', icon: '🐍' },
                      { id: 'go', label: '🔵 Go', icon: '🔵' },
                      { id: 'rust', label: '🦀 Rust', icon: '🦀' },
                      { id: 'curl', label: '💻 cURL', icon: '💻' },
                      { id: 'wordpress', label: '📱 WordPress', icon: '📱' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveDocTab(tab.id)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                          activeDocTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="space-y-6">
                  {/* Overview Tab */}
                  {activeDocTab === 'overview' && (
                    <div>
                      <h4 className="text-md font-semibold mb-3">OAuth 2.0 Flow Overview</h4>
                      <p className="text-gray-600 mb-4">WanGov ID uses OAuth 2.0 Authorization Code flow for secure authentication.</p>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                        <h5 className="font-medium text-yellow-800 mb-2">🔄 Authentication Flow</h5>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700">
                          <li>Redirect user to authorization URL with your client_id</li>
                          <li>User logs in and grants permission</li>
                          <li>WanGov redirects back with authorization code</li>
                          <li>Exchange code for access token</li>
                          <li>Use token to fetch user information</li>
                        </ol>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <h5 className="font-medium mb-2">📋 Required Parameters</h5>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Parameter</th>
                                <th className="text-left py-2">Required</th>
                                <th className="text-left py-2">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="py-2 font-mono">client_id</td>
                                <td className="py-2">Yes</td>
                                <td className="py-2">Your application's client ID</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2 font-mono">redirect_uri</td>
                                <td className="py-2">Yes</td>
                                <td className="py-2">Callback URL for your application</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2 font-mono">response_type</td>
                                <td className="py-2">Yes</td>
                                <td className="py-2">Must be 'code'</td>
                              </tr>
                              <tr>
                                <td className="py-2 font-mono">scope</td>
                                <td className="py-2">No</td>
                                <td className="py-2">Default: 'openid profile email'</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WordPress Tab */}
                  {activeDocTab === 'wordpress' && (
                    <div>
                      <h4 className="text-md font-semibold mb-3">📱 WordPress Plugin Integration</h4>
                      <div className="border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-bold">WP</span>
                          </div>
                          <div>
                            <h5 className="font-medium">WanGov ID WordPress Plugin</h5>
                            <p className="text-sm text-gray-500">Ready-to-use plugin with admin settings</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Complete WordPress integration with login/logout, user sync, and admin configuration.</p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                          <p className="text-sm text-yellow-800"><strong>Installation:</strong> The plugin is already available in your project at <code>/wangov-wordpress/wangov-id/</code></p>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-md mb-4">
                        <h5 className="font-medium text-blue-800 mb-2">🔧 Configuration Steps</h5>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                          <li>Upload the plugin to your WordPress site</li>
                          <li>Activate the plugin in WordPress admin</li>
                          <li>Go to Settings → WanGov ID</li>
                          <li>Enter your Client ID and Client Secret</li>
                          <li>Save settings and test login</li>
                        </ol>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <h5 className="font-medium mb-2">📝 Plugin Features</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          <li>OAuth 2.0 login integration</li>
                          <li>User registration and profile sync</li>
                          <li>Admin settings page</li>
                          <li>Login/logout shortcodes</li>
                          <li>AJAX-powered user interface</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Node.js Tab */}
                  {activeDocTab === 'nodejs' && (
                    <div>
                      <h4 className="text-md font-semibold mb-3">🟢 Node.js Integration</h4>
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-md">
                          <h5 className="font-medium text-green-800 mb-2">📦 Dependencies</h5>
                          <pre className="bg-white p-3 rounded text-sm font-mono">
npm install express axios express-session
                          </pre>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Complete Express.js Implementation</h5>
                          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`const express = require('express');
const axios = require('axios');
const session = require('express-session');

const app = express();
const CLIENT_ID = 'wangov_techcorp_12345';
const CLIENT_SECRET = 'sk_live_abcd1234efgh5678ijkl9012mnop3456';
const REDIRECT_URI = 'http://localhost:3000/callback';

app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: true }));

// Initiate OAuth flow
app.get('/login', (req, res) => {
  const authUrl = 'http://localhost:3010/authorize' +
    '?client_id=' + CLIENT_ID +
    '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
    '&response_type=code&scope=openid+profile+email';
  res.redirect(authUrl);
});

// Handle OAuth callback
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    // Exchange code for token
    const tokenResponse = await axios.post('http://localhost:3010/token', {
      grant_type: 'authorization_code',
      code: code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI
    });
    
    const { access_token } = tokenResponse.data;
    
    // Get user info
    const userResponse = await axios.get('http://localhost:3010/userinfo', {
      headers: { Authorization: 'Bearer ' + access_token }
    });
    
    req.session.user = userResponse.data;
    res.json({ success: true, user: userResponse.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Python Tab */}
                  {activeDocTab === 'python' && (
                    <div>
                      <h4 className="text-md font-semibold mb-3">🐍 Python Integration</h4>
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-md">
                          <h5 className="font-medium text-blue-800 mb-2">📦 Dependencies</h5>
                          <pre className="bg-white p-3 rounded text-sm font-mono">
pip install flask requests
                          </pre>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Complete Flask Implementation</h5>
                          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`from flask import Flask, redirect, request, session, jsonify
import requests
import urllib.parse

app = Flask(__name__)
app.secret_key = 'your-secret-key'

CLIENT_ID = 'wangov_techcorp_12345'
CLIENT_SECRET = 'sk_live_abcd1234efgh5678ijkl9012mnop3456'
REDIRECT_URI = 'http://localhost:5000/callback'

@app.route('/login')
def login():
    auth_url = (
        'http://localhost:3010/authorize'
        '?client_id=' + CLIENT_ID +
        '&redirect_uri=' + urllib.parse.quote(REDIRECT_URI) +
        '&response_type=code&scope=openid+profile+email'
    )
    return redirect(auth_url)

@app.route('/callback')
def callback():
    code = request.args.get('code')
    
    if not code:
        return jsonify({'error': 'No authorization code received'}), 400
    
    try:
        # Exchange code for token
        token_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'redirect_uri': REDIRECT_URI
        }
        
        token_response = requests.post(
            'http://localhost:3010/token',
            data=token_data
        )
        token_response.raise_for_status()
        
        access_token = token_response.json()['access_token']
        
        # Get user info
        user_response = requests.get(
            'http://localhost:3010/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        user_response.raise_for_status()
        
        user_data = user_response.json()
        session['user'] = user_data
        
        return jsonify({'success': True, 'user': user_data})
        
    except requests.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Go Tab */}
                  {activeDocTab === 'go' && (
                    <div>
                      <h4 className="text-md font-semibold mb-3">🔵 Go Integration</h4>
                      <div className="space-y-4">
                        <div className="bg-cyan-50 p-4 rounded-md">
                          <h5 className="font-medium text-cyan-800 mb-2">📦 Dependencies</h5>
                          <pre className="bg-white p-3 rounded text-sm font-mono">
go mod init wangov-oauth
go get github.com/gin-gonic/gin
go get github.com/gorilla/sessions
                          </pre>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Complete Gin Implementation</h5>
                          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "net/url"
    "strings"
    "github.com/gin-gonic/gin"
    "github.com/gorilla/sessions"
)

const (
    CLIENT_ID     = "wangov_techcorp_12345"
    CLIENT_SECRET = "sk_live_abcd1234efgh5678ijkl9012mnop3456"
    REDIRECT_URI  = "http://localhost:8080/callback"
)

var store = sessions.NewCookieStore([]byte("secret-key"))

func main() {
    r := gin.Default()
    
    r.GET("/login", handleLogin)
    r.GET("/callback", handleCallback)
    
    r.Run(":8080")
}

func handleLogin(c *gin.Context) {
    authURL := fmt.Sprintf(
        "http://localhost:3010/authorize?client_id=%s&redirect_uri=%s&response_type=code&scope=openid+profile+email",
        CLIENT_ID, url.QueryEscape(REDIRECT_URI),
    )
    c.Redirect(http.StatusFound, authURL)
}

func handleCallback(c *gin.Context) {
    code := c.Query("code")
    if code == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "No authorization code"})
        return
    }
    
    // Exchange code for token
    tokenData := url.Values{}
    tokenData.Set("grant_type", "authorization_code")
    tokenData.Set("code", code)
    tokenData.Set("client_id", CLIENT_ID)
    tokenData.Set("client_secret", CLIENT_SECRET)
    tokenData.Set("redirect_uri", REDIRECT_URI)
    
    resp, err := http.Post(
        "http://localhost:3010/token",
        "application/x-www-form-urlencoded",
        strings.NewReader(tokenData.Encode()),
    )
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer resp.Body.Close()
    
    body, _ := ioutil.ReadAll(resp.Body)
    var tokenResp map[string]interface{}
    json.Unmarshal(body, &tokenResp)
    
    accessToken := tokenResp["access_token"].(string)
    
    // Get user info
    req, _ := http.NewRequest("GET", "http://localhost:3010/userinfo", nil)
    req.Header.Set("Authorization", "Bearer "+accessToken)
    
    client := &http.Client{}
    userResp, err := client.Do(req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer userResp.Body.Close()
    
    userBody, _ := ioutil.ReadAll(userResp.Body)
    var userData map[string]interface{}
    json.Unmarshal(userBody, &userData)
    
    c.JSON(http.StatusOK, gin.H{"success": true, "user": userData})
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rust Tab */}
                  {activeDocTab === 'rust' && (
                    <div>
                      <h4 className="text-md font-semibold mb-3">🦀 Rust Integration</h4>
                      <div className="space-y-4">
                        <div className="bg-orange-50 p-4 rounded-md">
                          <h5 className="font-medium text-orange-800 mb-2">📦 Dependencies (Cargo.toml)</h5>
                          <pre className="bg-white p-3 rounded text-sm font-mono">
{`[dependencies]
actix-web = "4.0"
reqwest = { version = "0.11", features = ["json"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tokio = { version = "1.0", features = ["full"] }
url = "2.0"`}
                          </pre>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Complete Actix-web Implementation</h5>
                          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`use actix_web::{web, App, HttpServer, HttpResponse, Result};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

const CLIENT_ID: &str = "wangov_techcorp_12345";
const CLIENT_SECRET: &str = "sk_live_abcd1234efgh5678ijkl9012mnop3456";
const REDIRECT_URI: &str = "http://localhost:8080/callback";

#[derive(Deserialize)]
struct CallbackQuery {
    code: Option<String>,
}

#[derive(Deserialize, Serialize)]
struct TokenResponse {
    access_token: String,
    token_type: String,
}

#[derive(Serialize)]
struct ApiResponse {
    success: bool,
    user: Option<serde_json::Value>,
    error: Option<String>,
}

async fn login() -> Result<HttpResponse> {
    let auth_url = format!(
        "http://localhost:3010/authorize?client_id={}&redirect_uri={}&response_type=code&scope=openid+profile+email",
        CLIENT_ID,
        urlencoding::encode(REDIRECT_URI)
    );
    
    Ok(HttpResponse::Found()
        .append_header(("Location", auth_url))
        .finish())
}

async fn callback(query: web::Query<CallbackQuery>) -> Result<HttpResponse> {
    let code = match &query.code {
        Some(c) => c,
        None => {
            return Ok(HttpResponse::BadRequest().json(ApiResponse {
                success: false,
                user: None,
                error: Some("No authorization code received".to_string()),
            }));
        }
    };
    
    // Exchange code for token
    let client = reqwest::Client::new();
    let mut token_params = HashMap::new();
    token_params.insert("grant_type", "authorization_code");
    token_params.insert("code", code);
    token_params.insert("client_id", CLIENT_ID);
    token_params.insert("client_secret", CLIENT_SECRET);
    token_params.insert("redirect_uri", REDIRECT_URI);
    
    let token_response = match client
        .post("http://localhost:3010/token")
        .form(&token_params)
        .send()
        .await
    {
        Ok(resp) => resp,
        Err(e) => {
            return Ok(HttpResponse::InternalServerError().json(ApiResponse {
                success: false,
                user: None,
                error: Some(e.to_string()),
            }));
        }
    };
    
    let token_data: TokenResponse = match token_response.json().await {
        Ok(data) => data,
        Err(e) => {
            return Ok(HttpResponse::InternalServerError().json(ApiResponse {
                success: false,
                user: None,
                error: Some(e.to_string()),
            }));
        }
    };
    
    // Get user info
    let user_response = match client
        .get("http://localhost:3010/userinfo")
        .header("Authorization", format!("Bearer {}", token_data.access_token))
        .send()
        .await
    {
        Ok(resp) => resp,
        Err(e) => {
            return Ok(HttpResponse::InternalServerError().json(ApiResponse {
                success: false,
                user: None,
                error: Some(e.to_string()),
            }));
        }
    };
    
    let user_data: serde_json::Value = match user_response.json().await {
        Ok(data) => data,
        Err(e) => {
            return Ok(HttpResponse::InternalServerError().json(ApiResponse {
                success: false,
                user: None,
                error: Some(e.to_string()),
            }));
        }
    };
    
    Ok(HttpResponse::Ok().json(ApiResponse {
        success: true,
        user: Some(user_data),
        error: None,
    }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/login", web::get().to(login))
            .route("/callback", web::get().to(callback))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* cURL Tab */}
                  {activeDocTab === 'curl' && (
                    <div>
                      <h4 className="text-md font-semibold mb-3">💻 cURL Examples</h4>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h5 className="font-medium mb-2">🔗 1. Authorization URL</h5>
                          <p className="text-sm text-gray-600 mb-2">Redirect user to this URL:</p>
                          <pre className="bg-white p-3 rounded text-sm overflow-x-auto font-mono">
http://localhost:3010/authorize?client_id=wangov_techcorp_12345&redirect_uri=YOUR_CALLBACK_URL&response_type=code&scope=openid+profile+email
                          </pre>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-md">
                          <h5 className="font-medium text-blue-800 mb-2">🔄 2. Exchange Code for Token</h5>
                          <p className="text-sm text-blue-600 mb-2">After user authorizes, exchange the code:</p>
                          <pre className="bg-white p-3 rounded text-sm overflow-x-auto">
{`curl -X POST http://localhost:3010/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AUTHORIZATION_CODE_FROM_CALLBACK" \
  -d "client_id=wangov_techcorp_12345" \
  -d "client_secret=sk_live_abcd1234efgh5678ijkl9012mnop3456" \
  -d "redirect_uri=YOUR_CALLBACK_URL"`}
                          </pre>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-md">
                          <h5 className="font-medium text-green-800 mb-2">📊 3. Get User Information</h5>
                          <p className="text-sm text-green-600 mb-2">Use the access token to get user data:</p>
                          <pre className="bg-white p-3 rounded text-sm overflow-x-auto">
{`curl -X GET http://localhost:3010/userinfo \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`}
                          </pre>
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded-md">
                          <h5 className="font-medium text-yellow-800 mb-2">📝 Expected Response</h5>
                          <p className="text-sm text-yellow-600 mb-2">User info response format:</p>
                          <pre className="bg-white p-3 rounded text-sm overflow-x-auto">
{`{
  "sub": "user123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "nin": "1234567890",
  "iat": 1640995200,
  "exp": 1640998800
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Testing Instructions */}
                  <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-md font-semibold mb-3 text-green-800">🧪 Testing Your Integration</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">Step-by-Step Testing</h5>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-green-600">
                          <li>Set up your application with the provided credentials</li>
                          <li>Start your local server (Node.js on :3000, Python on :5000, Go on :8080)</li>
                          <li>Navigate to your login endpoint</li>
                          <li>You should be redirected to WanGov ID login</li>
                          <li>Use demo credentials: <code className="bg-green-100 px-2 py-1 rounded">demo@techcorp.com / password123</code></li>
                          <li>After login, check that user data is returned correctly</li>
                        </ol>
                      </div>
                      
                      <div className="bg-green-100 p-3 rounded">
                        <p className="text-sm text-green-700">
                          <strong>💡 Pro Tip:</strong> Use the "Test Authorization Flow" button above to quickly test the OAuth flow!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessSSOManagement;
