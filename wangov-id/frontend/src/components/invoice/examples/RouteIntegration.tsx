import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { InvoiceProvider } from '../../../contexts/InvoiceContext';
import InvoiceDashboard from '../InvoiceDashboard';
import InvoiceForm from '../InvoiceForm';
import InvoiceSettings from '../InvoiceSettings';

/**
 * Example of integrating Invoice Module with React Router
 * This shows how to set up routes for invoice functionality
 */

// Wrapper component to provide invoice context
const InvoiceWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <InvoiceProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </InvoiceProvider>
  );
};

// Main invoice routes component
const InvoiceRoutes: React.FC = () => {
  return (
    <InvoiceWrapper>
      <Routes>
        {/* Default route redirects to dashboard */}
        <Route path="/" element={<Navigate to="/invoices" replace />} />
        
        {/* Invoice dashboard */}
        <Route path="/invoices" element={<InvoiceDashboard />} />
        
        {/* Create new invoice */}
        <Route path="/invoices/create" element={<InvoiceForm />} />
        
        {/* Edit existing invoice */}
        <Route path="/invoices/:id/edit" element={<EditInvoiceWrapper />} />
        
        {/* Invoice settings */}
        <Route path="/invoices/settings" element={<InvoiceSettings />} />
        
        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/invoices" replace />} />
      </Routes>
    </InvoiceWrapper>
  );
};

// Wrapper for editing invoices (would need to fetch invoice by ID)
const EditInvoiceWrapper: React.FC = () => {
  // In a real implementation, you would:
  // 1. Get the invoice ID from useParams()
  // 2. Fetch the invoice data
  // 3. Pass it to InvoiceForm
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <InvoiceForm />
    </div>
  );
};

// Example of integrating into an existing app router
export const AppRouterIntegration = () => {
  return (
    <Routes>
      {/* Other app routes */}
      <Route path="/" element={<div>Home Page</div>} />
      <Route path="/dashboard" element={<div>Main Dashboard</div>} />
      
      {/* Invoice module routes */}
      <Route path="/invoices/*" element={<InvoiceRoutes />} />
      
      {/* Other routes */}
      <Route path="/settings" element={<div>App Settings</div>} />
    </Routes>
  );
};

// Example navigation component with invoice links
export const NavigationWithInvoices: React.FC = () => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <a
              href="/dashboard"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
            >
              Dashboard
            </a>
            <a
              href="/invoices"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Invoices
            </a>
            <a
              href="/invoices/create"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Create Invoice
            </a>
            <a
              href="/invoices/settings"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Invoice Settings
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default InvoiceRoutes;
