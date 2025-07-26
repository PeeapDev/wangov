import React from 'react';
import { InvoiceProvider } from '../../contexts/InvoiceContext';
import InvoiceModule from '../../components/invoice/InvoiceModule';

const ProviderInvoices: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <InvoiceProvider>
          <InvoiceModule />
        </InvoiceProvider>
      </div>
    </div>
  );
};

export default ProviderInvoices;
