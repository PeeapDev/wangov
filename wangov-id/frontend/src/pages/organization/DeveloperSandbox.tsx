import React, { useState, useEffect } from 'react';
import { 
  CodeBracketIcon,
  DocumentTextIcon,
  KeyIcon,
  GlobeAltIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  environment: 'sandbox' | 'live';
  permissions: string[];
  businessId: string;
  businessName: string;
  createdAt: string;
  lastUsed?: string;
  status: 'active' | 'inactive' | 'pending_approval';
  approvedBy?: string;
  approvedAt?: string;
}

interface Business {
  id: string;
  name: string;
  status: 'approved' | 'pending' | 'rejected';
}

const DeveloperSandbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState('documentation');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [selectedEnvironment, setSelectedEnvironment] = useState<'sandbox' | 'live'>('sandbox');

  useEffect(() => {
    fetchApiKeys();
    fetchBusinesses();
  }, []);

  const fetchApiKeys = async () => {
    // Mock data - replace with actual API call
    const mockKeys: ApiKey[] = [
      {
        id: '1',
        name: 'TechCorp Development Key',
        key: 'wgid_sandbox_1234567890abcdef',
        environment: 'sandbox',
        permissions: ['read:citizens', 'write:applications', 'verify:identity'],
        businessId: 'biz_1',
        businessName: 'TechCorp Solutions',
        createdAt: '2024-01-15',
        lastUsed: '2024-01-20',
        status: 'active'
      },
      {
        id: '2',
        name: 'TechCorp Production Key',
        key: 'wgid_live_abcdef1234567890',
        environment: 'live',
        permissions: ['read:citizens', 'verify:identity'],
        businessId: 'biz_1',
        businessName: 'TechCorp Solutions',
        createdAt: '2024-01-18',
        status: 'active',
        approvedBy: 'John Admin',
        approvedAt: '2024-01-19'
      },
      {
        id: '3',
        name: 'HealthPlus Testing Key',
        key: 'wgid_live_xyz789012345',
        environment: 'live',
        permissions: ['read:citizens', 'verify:identity'],
        businessId: 'biz_2',
        businessName: 'HealthPlus Clinic',
        createdAt: '2024-01-22',
        status: 'pending_approval'
      }
    ];
    setApiKeys(mockKeys);
  };

  const fetchBusinesses = async () => {
    // Mock data - replace with actual API call
    const mockBusinesses: Business[] = [
      { id: 'biz_1', name: 'TechCorp Solutions', status: 'approved' },
      { id: 'biz_2', name: 'HealthPlus Clinic', status: 'approved' },
      { id: 'biz_3', name: 'EduTech Platform', status: 'pending' }
    ];
    setBusinesses(mockBusinesses);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const generateNewKey = async (name: string, permissions: string[], businessId: string, environment: 'sandbox' | 'live') => {
    try {
      const business = businesses.find(b => b.id === businessId);
      if (!business) {
        toast.error('Business not found');
        return;
      }

      if (environment === 'live' && business.status !== 'approved') {
        toast.error('Business must be approved before generating live API keys');
        return;
      }

      const keyPrefix = environment === 'sandbox' ? 'wgid_sandbox_' : 'wgid_live_';
      const newKey: ApiKey = {
        id: Date.now().toString(),
        name,
        key: `${keyPrefix}${Math.random().toString(36).substr(2, 16)}`,
        environment,
        permissions,
        businessId,
        businessName: business.name,
        createdAt: new Date().toISOString().split('T')[0],
        status: environment === 'live' ? 'pending_approval' : 'active'
      };
      
      setApiKeys(prev => [...prev, newKey]);
      
      if (environment === 'live') {
        toast.success('Live API key submitted for SuperAdmin approval');
      } else {
        toast.success('Sandbox API key generated successfully');
      }
      
      setShowCreateKeyModal(false);
    } catch (error) {
      toast.error('Failed to generate API key');
    }
  };

  const deleteKey = async (keyId: string) => {
    if (window.confirm('Are you sure you want to delete this API key?')) {
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      toast.success('API key deleted');
    }
  };

  const tabs = [
    { id: 'documentation', name: 'Documentation', icon: DocumentTextIcon },
    { id: 'api-keys', name: 'API Keys', icon: KeyIcon },
    { id: 'api-explorer', name: 'API Explorer', icon: GlobeAltIcon },
    { id: 'code-samples', name: 'Code Samples', icon: CodeBracketIcon },
    { id: 'sdks', name: 'SDKs & Libraries', icon: CodeBracketIcon }
  ];

  const filteredApiKeys = apiKeys.filter(key => key.environment === selectedEnvironment);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <CodeBracketIcon className="w-8 h-8 mr-3 text-green-600" />
          Developer Sandbox
        </h1>
        <p className="text-gray-600 mt-1">Test and develop integrations with WanGov-ID APIs</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Documentation Tab */}
      {activeTab === 'documentation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                Welcome to the WanGov-ID Developer Sandbox. This environment allows you to test and develop 
                integrations with our identity verification and authentication APIs.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Quick Start Guide</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Generate your sandbox API key from the "API Keys" tab</li>
                <li>Review the API documentation below</li>
                <li>Test API endpoints using the API Explorer</li>
                <li>Implement your integration using the provided code samples</li>
                <li>Contact support when ready to move to production</li>
              </ol>

              <h3 className="text-lg font-semibold mt-6 mb-3">Base URL</h3>
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                https://sandbox-api.wangov.gov.sl/v1
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-3">Authentication</h3>
              <p className="text-gray-600 mb-3">
                All API requests must include your API key in the Authorization header:
              </p>
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                Authorization: Bearer YOUR_API_KEY
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
            <div className="space-y-4">
              {/* Citizen Verification */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-green-600">POST /verify/citizen</h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Available</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">Verify a citizen's identity using their NID</p>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <strong>Request Body:</strong>
                  <pre className="mt-1 text-xs">{`{
  "nid": "SL943700154019",
  "firstName": "John",
  "lastName": "Doe"
}`}</pre>
                </div>
              </div>

              {/* OAuth Token */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-blue-600">POST /oauth/token</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Available</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">Exchange authorization code for access token</p>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <strong>Request Body:</strong>
                  <pre className="mt-1 text-xs">{`{
  "grant_type": "authorization_code",
  "code": "AUTH_CODE",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET"
}`}</pre>
                </div>
              </div>

              {/* User Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-purple-600">GET /user/info</h3>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Available</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">Get authenticated user information</p>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <strong>Headers:</strong>
                  <pre className="mt-1 text-xs">Authorization: Bearer ACCESS_TOKEN</pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold mb-4">SSO Integration Guide</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">OAuth 2.0 Flow</h3>
                <p className="text-gray-600 text-sm mb-3">
                  WanGov-ID supports OAuth 2.0 authorization code flow for secure authentication.
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Redirect user to authorization endpoint</li>
                  <li>User grants permission</li>
                  <li>Receive authorization code</li>
                  <li>Exchange code for access token</li>
                  <li>Use token to access protected resources</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Authorization URL</h3>
                <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm break-all">
                  https://sandbox-auth.wangov.gov.sl/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&scope=read:profile&redirect_uri=YOUR_REDIRECT_URI
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Scopes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border border-gray-200 rounded p-3">
                    <strong className="text-sm">read:profile</strong>
                    <p className="text-xs text-gray-600 mt-1">Read user profile information</p>
                  </div>
                  <div className="border border-gray-200 rounded p-3">
                    <strong className="text-sm">read:documents</strong>
                    <p className="text-xs text-gray-600 mt-1">Read user documents</p>
                  </div>
                  <div className="border border-gray-200 rounded p-3">
                    <strong className="text-sm">verify:identity</strong>
                    <p className="text-xs text-gray-600 mt-1">Verify user identity</p>
                  </div>
                  <div className="border border-gray-200 rounded p-3">
                    <strong className="text-sm">write:applications</strong>
                    <p className="text-xs text-gray-600 mt-1">Submit applications on behalf of user</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === 'api-keys' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">API Keys</h2>
              <p className="text-gray-600">Manage your API keys for different businesses and environments</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Environment Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Environment:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setSelectedEnvironment('sandbox')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedEnvironment === 'sandbox'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Sandbox
                  </button>
                  <button
                    onClick={() => setSelectedEnvironment('live')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedEnvironment === 'live'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Live
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowCreateKeyModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Generate Key
              </button>
            </div>
          </div>

          {/* Environment Info */}
          <div className={`p-4 rounded-lg border ${
            selectedEnvironment === 'sandbox' 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                selectedEnvironment === 'sandbox' ? 'bg-blue-500' : 'bg-orange-500'
              }`}></div>
              <h3 className="font-semibold text-gray-900">
                {selectedEnvironment === 'sandbox' ? 'Sandbox Environment' : 'Live Environment'}
              </h3>
            </div>
            <p className={`mt-1 text-sm ${
              selectedEnvironment === 'sandbox' ? 'text-blue-700' : 'text-orange-700'
            }`}>
              {selectedEnvironment === 'sandbox' 
                ? 'Use sandbox keys for testing and development. No real data is processed.'
                : 'Live keys process real data and require SuperAdmin approval. Use only in production.'
              }
            </p>
          </div>

          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Key
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permissions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Used
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approval
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApiKeys.map((key) => (
                    <tr key={key.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{key.name}</div>
                        <div className="text-sm text-gray-500">{key.businessName}</div>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            key.status === 'active' ? 'bg-green-100 text-green-800' :
                            key.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {key.status === 'pending_approval' ? 'Pending Approval' : key.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {visibleKeys.has(key.id) ? key.key : '••••••••••••••••'}
                          </code>
                          <button
                            onClick={() => toggleKeyVisibility(key.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {visibleKeys.has(key.id) ? (
                              <EyeSlashIcon className="w-4 h-4" />
                            ) : (
                              <EyeIcon className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(key.key)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <ClipboardDocumentIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {key.permissions.map((permission, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(key.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {key.approvedBy ? (
                          <div>
                            <div>Approved by: {key.approvedBy}</div>
                            <div>{new Date(key.approvedAt!).toLocaleDateString()}</div>
                          </div>
                        ) : key.status === 'pending_approval' ? (
                          <span className="text-yellow-600">Awaiting approval</span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => deleteKey(key.id)}
                          className="text-red-400 hover:text-red-600"
                          disabled={key.status === 'pending_approval'}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* API Explorer Tab */}
      {activeTab === 'api-explorer' && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-xl font-semibold mb-4">API Explorer</h2>
          <p className="text-gray-600 mb-6">Test API endpoints directly from your browser</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Request</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint</label>
                  <input
                    type="text"
                    placeholder="/verify/citizen"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Headers</label>
                  <textarea
                    rows={3}
                    placeholder="Authorization: Bearer YOUR_API_KEY"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request Body</label>
                  <textarea
                    rows={6}
                    placeholder='{"nid": "SL943700154019", "firstName": "John", "lastName": "Doe"}'
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
                  />
                </div>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                  Send Request
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Response</h3>
              <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-auto">
                <pre className="text-sm text-gray-600">
                  Click "Send Request" to see the response here...
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code Samples Tab */}
      {activeTab === 'code-samples' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold mb-4">Code Samples</h2>
            <p className="text-gray-600 mb-6">Ready-to-use code examples for common integration scenarios</p>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">JavaScript/Node.js</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">{`// Verify citizen identity
const verifyCitizen = async (nid, firstName, lastName) => {
  const response = await fetch('https://sandbox-api.wangov.gov.sl/v1/verify/citizen', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nid,
      firstName,
      lastName
    })
  });
  
  const result = await response.json();
  return result;
};

// OAuth token exchange
const exchangeCodeForToken = async (code) => {
  const response = await fetch('https://sandbox-api.wangov.gov.sl/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: code,
      client_id: 'YOUR_CLIENT_ID',
      client_secret: 'YOUR_CLIENT_SECRET'
    })
  });
  
  const token = await response.json();
  return token;
};`}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Python</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">{`import requests

def verify_citizen(nid, first_name, last_name):
    """Verify citizen identity"""
    url = "https://sandbox-api.wangov.gov.sl/v1/verify/citizen"
    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    data = {
        "nid": nid,
        "firstName": first_name,
        "lastName": last_name
    }
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()

def exchange_code_for_token(code):
    """Exchange authorization code for access token"""
    url = "https://sandbox-api.wangov.gov.sl/v1/oauth/token"
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "client_id": "YOUR_CLIENT_ID",
        "client_secret": "YOUR_CLIENT_SECRET"
    }
    
    response = requests.post(url, json=data)
    return response.json()`}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">PHP</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">{`<?php

function verifyCitizen($nid, $firstName, $lastName) {
    $url = 'https://sandbox-api.wangov.gov.sl/v1/verify/citizen';
    $headers = [
        'Authorization: Bearer YOUR_API_KEY',
        'Content-Type: application/json'
    ];
    $data = json_encode([
        'nid' => $nid,
        'firstName' => $firstName,
        'lastName' => $lastName
    ]);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

function exchangeCodeForToken($code) {
    $url = 'https://sandbox-api.wangov.gov.sl/v1/oauth/token';
    $data = json_encode([
        'grant_type' => 'authorization_code',
        'code' => $code,
        'client_id' => 'YOUR_CLIENT_ID',
        'client_secret' => 'YOUR_CLIENT_SECRET'
    ]);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

?>`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SDKs & Libraries Tab */}
      {activeTab === 'sdks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold mb-4">Official SDKs & Libraries</h2>
            <p className="text-gray-600 mb-6">Use our official SDKs to integrate WanGov-ID into your applications quickly and securely.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* JavaScript/Node.js SDK */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-sm">JS</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">JavaScript/Node.js</h3>
                    <p className="text-sm text-gray-500">v2.1.0</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Official JavaScript SDK for browser and Node.js applications</p>
                <div className="space-y-2">
                  <button className="w-full bg-gray-900 text-white px-3 py-2 rounded text-sm hover:bg-gray-800">
                    npm install wangov-id-js
                  </button>
                  <div className="flex space-x-2">
                    <button className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50">
                      GitHub
                    </button>
                    <button className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50">
                      Docs
                    </button>
                  </div>
                </div>
              </div>

              {/* Python SDK */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">PY</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Python</h3>
                    <p className="text-sm text-gray-500">v1.8.2</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Official Python SDK with async support</p>
                <div className="space-y-2">
                  <button className="w-full bg-gray-900 text-white px-3 py-2 rounded text-sm hover:bg-gray-800">
                    pip install wangov-id
                  </button>
                  <div className="flex space-x-2">
                    <button className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50">
                      GitHub
                    </button>
                    <button className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50">
                      Docs
                    </button>
                  </div>
                </div>
              </div>

              {/* Java SDK */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">JA</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Java</h3>
                    <p className="text-sm text-gray-500">v3.0.1</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Official Java SDK for Spring Boot and Android</p>
                <div className="space-y-2">
                  <div className="bg-gray-100 p-2 rounded text-xs font-mono">
                    &lt;dependency&gt;<br/>
                    &nbsp;&nbsp;&lt;groupId&gt;sl.gov.wangov&lt;/groupId&gt;<br/>
                    &nbsp;&nbsp;&lt;artifactId&gt;wangov-id-java&lt;/artifactId&gt;<br/>
                    &nbsp;&nbsp;&lt;version&gt;3.0.1&lt;/version&gt;<br/>
                    &lt;/dependency&gt;
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50">
                      GitHub
                    </button>
                    <button className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50">
                      Docs
                    </button>
                  </div>
                </div>
              </div>

              {/* Go SDK */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-600 font-bold text-sm">GO</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Go</h3>
                    <p className="text-sm text-gray-500">v1.4.0</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Official Go SDK with context support</p>
                <div className="space-y-2">
                  <button className="w-full bg-gray-900 text-white px-3 py-2 rounded text-sm hover:bg-gray-800">
                    go get github.com/wangov-sl/wangov-id-go
                  </button>
                  <div className="flex space-x-2">
                    <button className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50">
                      GitHub
                    </button>
                    <button className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50">
                      Docs
                    </button>
                  </div>
                </div>
              </div>

              {/* Rust SDK */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">RS</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Rust</h3>
                    <p className="text-sm text-gray-500">v0.9.3</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Official Rust SDK with async/await support</p>
                <div className="space-y-2">
                  <div className="bg-gray-100 p-2 rounded text-xs font-mono">
                    [dependencies]<br/>
                    wangov-id = "0.9.3"
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50">
                      GitHub
                    </button>
                    <button className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50">
                      Docs
                    </button>
                  </div>
                </div>
              </div>

              {/* PHP SDK */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">PHP</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">PHP</h3>
                    <p className="text-sm text-gray-500">v2.3.1</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Official PHP SDK for Laravel and WordPress</p>
                <div className="space-y-2">
                  <button className="w-full bg-gray-900 text-white px-3 py-2 rounded text-sm hover:bg-gray-800">
                    composer require wangov/wangov-id-php
                  </button>
                  <div className="flex space-x-2">
                    <button className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50">
                      GitHub
                    </button>
                    <button className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50">
                      Docs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start Examples */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Start Examples</h2>
            
            <div className="space-y-6">
              {/* JavaScript Example */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="w-6 h-6 bg-yellow-100 rounded mr-2 flex items-center justify-center">
                    <span className="text-yellow-600 text-xs font-bold">JS</span>
                  </span>
                  JavaScript/Node.js
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">{`import { WanGovID } from 'wangov-id-js';

const client = new WanGovID({
  apiKey: 'your_api_key_here',
  environment: 'sandbox' // or 'live'
});

// Verify citizen identity
const result = await client.citizens.verify({
  nid: 'SL943700154019',
  firstName: 'John',
  lastName: 'Doe'
});

console.log(result.verified); // true/false`}</pre>
                </div>
              </div>

              {/* Python Example */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="w-6 h-6 bg-blue-100 rounded mr-2 flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">PY</span>
                  </span>
                  Python
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">{`from wangov_id import WanGovIDClient

client = WanGovIDClient(
    api_key="your_api_key_here",
    environment="sandbox"  # or "live"
)

# Verify citizen identity
result = client.citizens.verify(
    nid="SL943700154019",
    first_name="John",
    last_name="Doe"
)

print(result.verified)  # True/False`}</pre>
                </div>
              </div>

              {/* Java Example */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="w-6 h-6 bg-red-100 rounded mr-2 flex items-center justify-center">
                    <span className="text-red-600 text-xs font-bold">JA</span>
                  </span>
                  Java
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">{`import sl.gov.wangov.WanGovIDClient;
import sl.gov.wangov.models.CitizenVerification;

WanGovIDClient client = new WanGovIDClient.Builder()
    .apiKey("your_api_key_here")
    .environment(Environment.SANDBOX) // or Environment.LIVE
    .build();

// Verify citizen identity
CitizenVerification request = new CitizenVerification()
    .setNid("SL943700154019")
    .setFirstName("John")
    .setLastName("Doe");

VerificationResult result = client.citizens().verify(request);
System.out.println(result.isVerified()); // true/false`}</pre>
                </div>
              </div>

              {/* Go Example */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="w-6 h-6 bg-cyan-100 rounded mr-2 flex items-center justify-center">
                    <span className="text-cyan-600 text-xs font-bold">GO</span>
                  </span>
                  Go
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">{`package main

import (
    "context"
    "fmt"
    "github.com/wangov-sl/wangov-id-go"
)

func main() {
    client := wangovid.NewClient("your_api_key_here", wangovid.Sandbox)
    
    result, err := client.Citizens.Verify(context.Background(), &wangovid.CitizenVerifyRequest{
        NID:       "SL943700154019",
        FirstName: "John",
        LastName:  "Doe",
    })
    
    if err != nil {
        panic(err)
    }
    
    fmt.Println(result.Verified) // true/false
}`}</pre>
                </div>
              </div>

              {/* Rust Example */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="w-6 h-6 bg-orange-100 rounded mr-2 flex items-center justify-center">
                    <span className="text-orange-600 text-xs font-bold">RS</span>
                  </span>
                  Rust
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">{`use wangov_id::{WanGovIDClient, Environment, CitizenVerifyRequest};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = WanGovIDClient::new(
        "your_api_key_here".to_string(),
        Environment::Sandbox, // or Environment::Live
    );
    
    let request = CitizenVerifyRequest {
        nid: "SL943700154019".to_string(),
        first_name: "John".to_string(),
        last_name: "Doe".to_string(),
    };
    
    let result = client.citizens().verify(request).await?;
    println!("Verified: {}", result.verified); // true/false
    
    Ok(())
}`}</pre>
                </div>
              </div>

              {/* PHP Example */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <span className="w-6 h-6 bg-purple-100 rounded mr-2 flex items-center justify-center">
                    <span className="text-purple-600 text-xs font-bold">PHP</span>
                  </span>
                  PHP
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">{`<?php

use WanGov\WanGovID\Client;
use WanGov\WanGovID\Environment;

$client = new Client([
    'api_key' => 'your_api_key_here',
    'environment' => Environment::SANDBOX, // or Environment::LIVE
]);

// Verify citizen identity
$result = $client->citizens()->verify([
    'nid' => 'SL943700154019',
    'first_name' => 'John',
    'last_name' => 'Doe',
]);

echo $result['verified'] ? 'Verified' : 'Not verified';

?>`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create API Key Modal */}
      {showCreateKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Generate New API Key</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const name = formData.get('name') as string;
              const permissions = formData.getAll('permissions') as string[];
              const businessId = formData.get('businessId') as string;
              const environment = formData.get('environment') as 'sandbox' | 'live';
              generateNewKey(name, permissions, businessId, environment);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g., Production API Key"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business *
                  </label>
                  <select
                    name="businessId"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select Business</option>
                    {businesses.filter(b => b.status === 'approved').map((business) => (
                      <option key={business.id} value={business.id}>
                        {business.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Only approved businesses can generate API keys
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Environment *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="environment"
                        value="sandbox"
                        defaultChecked
                        className="text-green-600 focus:ring-green-500"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">Sandbox</div>
                        <div className="text-sm text-gray-500">For testing and development</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="environment"
                        value="live"
                        className="text-green-600 focus:ring-green-500"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">Live</div>
                        <div className="text-sm text-gray-500">For production use</div>
                      </div>
                    </label>
                  </div>
                  <p className="text-xs text-orange-600 mt-1">
                    ⚠️ Live API keys require SuperAdmin approval before activation
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions *
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'read:profile', name: 'Read User Profile', desc: 'Access basic user information' },
                      { id: 'read:documents', name: 'Read Documents', desc: 'Access user documents and certificates' },
                      { id: 'verify:identity', name: 'Verify Identity', desc: 'Verify citizen identity and KYC' },
                      { id: 'write:applications', name: 'Submit Applications', desc: 'Submit applications on behalf of users' }
                    ].map((permission) => (
                      <label key={permission.id} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          name="permissions"
                          value={permission.id}
                          className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{permission.name}</div>
                          <div className="text-sm text-gray-500">{permission.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateKeyModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperSandbox;
