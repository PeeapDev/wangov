import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Invoice, InvoiceTemplate, InvoiceSettings, InvoiceFilters, InvoiceStats } from '../types/invoice';
import { invoiceService } from '../services/invoiceService';
import { toast } from 'react-hot-toast';

interface InvoiceContextType {
  // State
  invoices: Invoice[];
  templates: InvoiceTemplate[];
  settings: InvoiceSettings | null;
  stats: InvoiceStats | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadInvoices: (filters?: InvoiceFilters) => Promise<void>;
  loadTemplates: () => Promise<void>;
  loadSettings: () => Promise<void>;
  loadStats: () => Promise<void>;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Invoice>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<Invoice>;
  deleteInvoice: (id: string) => Promise<void>;
  sendInvoice: (id: string) => Promise<void>;
  markAsPaid: (id: string, paidDate?: string) => Promise<void>;
  createTemplate: (template: Omit<InvoiceTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<InvoiceTemplate>;
  updateSettings: (settings: Partial<InvoiceSettings>) => Promise<void>;
  generatePDF: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

interface InvoiceProviderProps {
  children: ReactNode;
}

export const InvoiceProvider: React.FC<InvoiceProviderProps> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [settings, setSettings] = useState<InvoiceSettings | null>(null);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: any, message: string) => {
    console.error(message, error);
    setError(message);
    toast.error(message);
  };

  const loadInvoices = async (filters?: InvoiceFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await invoiceService.getInvoices(filters);
      setInvoices(data);
    } catch (error) {
      handleError(error, 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const data = await invoiceService.getTemplates();
      setTemplates(data);
    } catch (error) {
      handleError(error, 'Failed to load templates');
    }
  };

  const loadSettings = async () => {
    try {
      const data = await invoiceService.getSettings();
      setSettings(data);
    } catch (error) {
      handleError(error, 'Failed to load settings');
    }
  };

  const loadStats = async () => {
    try {
      const data = await invoiceService.getStats();
      setStats(data);
    } catch (error) {
      handleError(error, 'Failed to load statistics');
    }
  };

  const createInvoice = async (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const newInvoice = await invoiceService.createInvoice(invoice);
      setInvoices(prev => [newInvoice, ...prev]);
      toast.success('Invoice created successfully');
      return newInvoice;
    } catch (error) {
      handleError(error, 'Failed to create invoice');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateInvoice = async (id: string, invoice: Partial<Invoice>) => {
    try {
      setLoading(true);
      const updatedInvoice = await invoiceService.updateInvoice(id, invoice);
      setInvoices(prev => prev.map(inv => inv.id === id ? updatedInvoice : inv));
      toast.success('Invoice updated successfully');
      return updatedInvoice;
    } catch (error) {
      handleError(error, 'Failed to update invoice');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      setLoading(true);
      await invoiceService.deleteInvoice(id);
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      toast.success('Invoice deleted successfully');
    } catch (error) {
      handleError(error, 'Failed to delete invoice');
    } finally {
      setLoading(false);
    }
  };

  const sendInvoice = async (id: string) => {
    try {
      await invoiceService.sendInvoice(id);
      setInvoices(prev => prev.map(inv => 
        inv.id === id ? { ...inv, status: 'sent' } : inv
      ));
      toast.success('Invoice sent successfully');
    } catch (error) {
      handleError(error, 'Failed to send invoice');
    }
  };

  const markAsPaid = async (id: string, paidDate?: string) => {
    try {
      const updatedInvoice = await invoiceService.markAsPaid(id, paidDate);
      setInvoices(prev => prev.map(inv => inv.id === id ? updatedInvoice : inv));
      toast.success('Invoice marked as paid');
    } catch (error) {
      handleError(error, 'Failed to mark invoice as paid');
    }
  };

  const createTemplate = async (template: Omit<InvoiceTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTemplate = await invoiceService.createTemplate(template);
      setTemplates(prev => [newTemplate, ...prev]);
      toast.success('Template created successfully');
      return newTemplate;
    } catch (error) {
      handleError(error, 'Failed to create template');
      throw error;
    }
  };

  const updateSettings = async (newSettings: Partial<InvoiceSettings>) => {
    try {
      const updatedSettings = await invoiceService.updateSettings(newSettings);
      setSettings(updatedSettings);
      toast.success('Settings updated successfully');
    } catch (error) {
      handleError(error, 'Failed to update settings');
    }
  };

  const generatePDF = async (id: string) => {
    try {
      const blob = await invoiceService.generatePDF(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      handleError(error, 'Failed to generate PDF');
    }
  };

  const refreshData = async () => {
    await Promise.all([
      loadInvoices(),
      loadTemplates(),
      loadSettings(),
      loadStats(),
    ]);
  };

  // Load initial data
  useEffect(() => {
    refreshData();
  }, []);

  const value: InvoiceContextType = {
    invoices,
    templates,
    settings,
    stats,
    loading,
    error,
    loadInvoices,
    loadTemplates,
    loadSettings,
    loadStats,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    sendInvoice,
    markAsPaid,
    createTemplate,
    updateSettings,
    generatePDF,
    refreshData,
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};
