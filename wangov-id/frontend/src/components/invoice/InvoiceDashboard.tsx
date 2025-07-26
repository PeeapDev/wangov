import React, { useState } from 'react';
import { useInvoice } from '../../contexts/InvoiceContext';
import { InvoiceStatus } from '../../types/invoice';
import {
  DocumentTextIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const InvoiceDashboard: React.FC = () => {
  const {
    invoices,
    stats,
    loading,
    deleteInvoice,
    sendInvoice,
    markAsPaid,
    generatePDF,
    refreshData,
  } = useInvoice();

  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus;
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'viewed': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SL', {
      style: 'currency',
      currency: 'SLL',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAction = async (action: string, invoiceId: string) => {
    try {
      switch (action) {
        case 'send':
          await sendInvoice(invoiceId);
          break;
        case 'markPaid':
          await markAsPaid(invoiceId);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this invoice?')) {
            await deleteInvoice(invoiceId);
          }
          break;
        case 'pdf':
          await generatePDF(invoiceId);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalInvoices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid Amount</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.paidAmount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.overdueAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Invoice
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as InvoiceStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="viewed">Viewed</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-gray-500">{new Date(invoice.issueDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{invoice.clientName}</div>
                    <div className="text-sm text-gray-500">{invoice.clientEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(invoice.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleAction('pdf', invoice.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Download PDF"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4" />
                      </button>
                      
                      {invoice.status === 'draft' && (
                        <button
                          onClick={() => handleAction('send', invoice.id)}
                          className="text-blue-400 hover:text-blue-600"
                          title="Send Invoice"
                        >
                          <PaperAirplaneIcon className="h-4 w-4" />
                        </button>
                      )}
                      
                      {(invoice.status === 'sent' || invoice.status === 'viewed' || invoice.status === 'overdue') && (
                        <button
                          onClick={() => handleAction('markPaid', invoice.id)}
                          className="text-green-400 hover:text-green-600"
                          title="Mark as Paid"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleAction('delete', invoice.id)}
                        className="text-red-400 hover:text-red-600"
                        title="Delete Invoice"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by creating your first invoice.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDashboard;
