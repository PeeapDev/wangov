import React, { useState, useEffect } from 'react';
import { useInvoice } from '../../contexts/InvoiceContext';
import { InvoiceSettings as IInvoiceSettings } from '../../types/invoice';
import { CogIcon, BuildingOfficeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const InvoiceSettings: React.FC = () => {
  const { settings, updateSettings, loading } = useInvoice();
  
  const [formData, setFormData] = useState<Partial<IInvoiceSettings>>({
    companyName: '',
    companyAddress: '',
    companyEmail: '',
    companyPhone: '',
    companyWebsite: '',
    defaultTaxRate: 0,
    defaultPaymentTerms: 30,
    invoicePrefix: 'INV',
    currency: 'SLL',
    logoUrl: '',
    defaultNotes: '',
    defaultTerms: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateSettings(formData);
    } catch (error) {
      console.error('Failed to update settings:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currencies = [
    { code: 'SLL', name: 'Sierra Leonean Leone' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <CogIcon className="h-6 w-6 text-gray-400 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Invoice Settings</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Company Information */}
          <div className="space-y-6">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Email *
                </label>
                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Phone
                </label>
                <input
                  type="tel"
                  name="companyPhone"
                  value={formData.companyPhone || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Website
                </label>
                <input
                  type="url"
                  name="companyWebsite"
                  value={formData.companyWebsite || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Address
              </label>
              <textarea
                name="companyAddress"
                value={formData.companyAddress || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Logo URL
              </label>
              <input
                type="url"
                name="logoUrl"
                value={formData.logoUrl || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/logo.png"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter a URL to your company logo. It will appear on invoices.
              </p>
            </div>
          </div>

          {/* Invoice Defaults */}
          <div className="space-y-6">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Invoice Defaults</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Prefix
                </label>
                <input
                  type="text"
                  name="invoicePrefix"
                  value={formData.invoicePrefix || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="INV"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency || 'SLL'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Tax Rate (%)
                </label>
                <input
                  type="number"
                  name="defaultTaxRate"
                  value={formData.defaultTaxRate || 0}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms (Days)
                </label>
                <input
                  type="number"
                  name="defaultPaymentTerms"
                  value={formData.defaultPaymentTerms || 30}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Default Content */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Default Content</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Notes
                </label>
                <textarea
                  name="defaultNotes"
                  value={formData.defaultNotes || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Thank you for your business!"
                />
                <p className="mt-1 text-sm text-gray-500">
                  These notes will appear on all new invoices by default.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Terms & Conditions
                </label>
                <textarea
                  name="defaultTerms"
                  value={formData.defaultTerms || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Payment is due within 30 days of invoice date."
                />
                <p className="mt-1 text-sm text-gray-500">
                  These terms will appear on all new invoices by default.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
          <p className="text-sm text-gray-600">This is how your company information will appear on invoices.</p>
        </div>
        
        <div className="p-6">
          <div className="max-w-md">
            {formData.logoUrl && (
              <img
                src={formData.logoUrl}
                alt="Company Logo"
                className="h-12 mb-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            
            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-gray-900">
                {formData.companyName || 'Your Company Name'}
              </h4>
              
              {formData.companyAddress && (
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {formData.companyAddress}
                </p>
              )}
              
              <div className="text-sm text-gray-600 space-y-1">
                {formData.companyEmail && (
                  <p>Email: {formData.companyEmail}</p>
                )}
                {formData.companyPhone && (
                  <p>Phone: {formData.companyPhone}</p>
                )}
                {formData.companyWebsite && (
                  <p>Website: {formData.companyWebsite}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSettings;
