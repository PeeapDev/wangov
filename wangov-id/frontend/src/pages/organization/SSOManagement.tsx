import React from 'react';
import WordPressIntegration from '../../components/organization/WordPressIntegration';

const SSOManagementSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SSO Management</h1>
          <p className="text-gray-600 mt-2">
            Manage OAuth clients and SSO integrations for your organization
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Overview
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Node.js
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Python
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Go
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Rust
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                cURL
              </button>
              <button className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                WordPress
              </button>
            </nav>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                📚 Integration Documentation
              </h2>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                📝 WordPress Plugin Integration
              </h3>
              <WordPressIntegration />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                ✅ Testing Your Integration
              </h3>
              
              <div className="space-y-4 text-sm text-blue-800">
                <div>
                  <h4 className="font-medium mb-1">Step-by-Step Testing</h4>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Set up your application with the provided credentials</li>
                    <li>Start your local server (Node.js on :3000, Python on :5000, Go on :8080)</li>
                    <li>Navigate to your login endpoint</li>
                    <li>You should be redirected to WanGov ID login</li>
                    <li>Use demo credentials: <code className="bg-blue-100 px-1 rounded">demo@techcorp.com</code> / <code className="bg-blue-100 px-1 rounded">password123</code></li>
                    <li>After login, check that user data is returned correctly</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSOManagementSimple;
