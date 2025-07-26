import React, { useState } from 'react';
import { InvoiceProvider } from '../../../contexts/InvoiceContext';
import InvoiceDashboard from '../InvoiceDashboard';
import InvoiceForm from '../InvoiceForm';
import InvoiceSettings from '../InvoiceSettings';
import {
  DocumentTextIcon,
  PlusIcon,
  CogIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

type TabType = 'overview' | 'invoices' | 'create' | 'settings';

/**
 * Example integration of Invoice Module into an existing dashboard
 * This shows how to embed invoice functionality into any WanGov portal
 */
const DashboardIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: HomeIcon },
    { id: 'invoices', name: 'Invoices', icon: DocumentTextIcon },
    { id: 'create', name: 'Create Invoice', icon: PlusIcon },
    { id: 'settings', name: 'Invoice Settings', icon: CogIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900">Recent Activity</h3>
                <p className="text-blue-700">Your latest dashboard activities</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900">Quick Actions</h3>
                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-2 text-green-700 hover:text-green-900 font-medium"
                >
                  Create New Invoice →
                </button>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900">Statistics</h3>
                <p className="text-purple-700">View your invoice statistics</p>
              </div>
            </div>
          </div>
        );
      case 'invoices':
        return <InvoiceDashboard />;
      case 'create':
        return (
          <InvoiceForm
            onSave={() => setActiveTab('invoices')}
            onCancel={() => setActiveTab('invoices')}
          />
        );
      case 'settings':
        return <InvoiceSettings />;
      default:
        return null;
    }
  };

  return (
    <InvoiceProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <img
                  className="h-8 w-8"
                  src="/logo.png"
                  alt="WanGov"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <h1 className="ml-3 text-2xl font-bold text-gray-900">
                  Organization Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Welcome, Admin</span>
                <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                © 2024 WanGov Digital Services. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                  Terms of Service
                </a>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </InvoiceProvider>
  );
};

export default DashboardIntegration;
