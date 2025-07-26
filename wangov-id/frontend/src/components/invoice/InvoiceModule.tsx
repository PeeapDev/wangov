import React, { useState } from 'react';
import { InvoiceProvider } from '../../contexts/InvoiceContext';
import InvoiceDashboard from './InvoiceDashboard';
import InvoiceForm from './InvoiceForm';
import InvoiceSettings from './InvoiceSettings';
import { Invoice } from '../../types/invoice';
import {
  DocumentTextIcon,
  PlusIcon,
  CogIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

type ViewMode = 'dashboard' | 'create' | 'edit' | 'settings';

const InvoiceModule: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>();

  const handleCreateInvoice = () => {
    setSelectedInvoice(undefined);
    setCurrentView('create');
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('edit');
  };

  const handleInvoiceSaved = (invoice: Invoice) => {
    setCurrentView('dashboard');
    setSelectedInvoice(undefined);
  };

  const handleCancel = () => {
    setCurrentView('dashboard');
    setSelectedInvoice(undefined);
  };

  const renderHeader = () => {
    switch (currentView) {
      case 'create':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleCancel}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
            </div>
          </div>
        );
      case 'edit':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleCancel}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Invoice {selectedInvoice?.invoiceNumber}
              </h1>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleCancel}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Invoice Settings</h1>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setCurrentView('settings')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <CogIcon className="h-4 w-4 mr-2" />
                Settings
              </button>
              <button
                onClick={handleCreateInvoice}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Invoice
              </button>
            </div>
          </div>
        );
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'create':
        return (
          <InvoiceForm
            onSave={handleInvoiceSaved}
            onCancel={handleCancel}
          />
        );
      case 'edit':
        return (
          <InvoiceForm
            invoice={selectedInvoice}
            onSave={handleInvoiceSaved}
            onCancel={handleCancel}
          />
        );
      case 'settings':
        return <InvoiceSettings />;
      default:
        return <InvoiceDashboard />;
    }
  };

  return (
    <InvoiceProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {renderHeader()}
            {renderContent()}
          </div>
        </div>
      </div>
    </InvoiceProvider>
  );
};

export default InvoiceModule;
