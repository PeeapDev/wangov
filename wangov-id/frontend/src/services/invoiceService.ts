import { Invoice, InvoiceTemplate, InvoiceSettings, InvoiceFilters, InvoiceStats } from '../types/invoice';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class InvoiceService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Invoice CRUD operations
  async getInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status.join(','));
    if (filters?.clientName) params.append('clientName', filters.clientName);
    
    const response = await fetch(`${API_BASE}/api/invoices?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getInvoice(id: string): Promise<Invoice> {
    const response = await fetch(`${API_BASE}/api/invoices/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    const response = await fetch(`${API_BASE}/api/invoices`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(invoice),
    });
    return response.json();
  }

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice> {
    const response = await fetch(`${API_BASE}/api/invoices/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(invoice),
    });
    return response.json();
  }

  async deleteInvoice(id: string): Promise<void> {
    await fetch(`${API_BASE}/api/invoices/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
  }

  // Invoice actions
  async sendInvoice(id: string): Promise<void> {
    await fetch(`${API_BASE}/api/invoices/${id}/send`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
  }

  async markAsPaid(id: string, paidDate?: string): Promise<Invoice> {
    const response = await fetch(`${API_BASE}/api/invoices/${id}/mark-paid`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ paidDate: paidDate || new Date().toISOString() }),
    });
    return response.json();
  }

  // Templates
  async getTemplates(): Promise<InvoiceTemplate[]> {
    const response = await fetch(`${API_BASE}/api/invoice-templates`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createTemplate(template: Omit<InvoiceTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<InvoiceTemplate> {
    const response = await fetch(`${API_BASE}/api/invoice-templates`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(template),
    });
    return response.json();
  }

  // Settings
  async getSettings(): Promise<InvoiceSettings> {
    const response = await fetch(`${API_BASE}/api/invoice-settings`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async updateSettings(settings: Partial<InvoiceSettings>): Promise<InvoiceSettings> {
    const response = await fetch(`${API_BASE}/api/invoice-settings`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    return response.json();
  }

  // Statistics
  async getStats(): Promise<InvoiceStats> {
    const response = await fetch(`${API_BASE}/api/invoices/stats`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // PDF Generation
  async generatePDF(id: string): Promise<Blob> {
    const response = await fetch(`${API_BASE}/api/invoices/${id}/pdf`, {
      headers: this.getAuthHeaders(),
    });
    return response.blob();
  }
}

export const invoiceService = new InvoiceService();
