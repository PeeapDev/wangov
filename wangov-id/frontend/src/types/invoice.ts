export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount?: number;
  totalAmount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
  organizationId: string;
  organizationName: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type InvoiceStatus = 
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export interface InvoiceTemplate {
  id: string;
  name: string;
  items: Omit<InvoiceItem, 'id'>[];
  taxRate: number;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceSettings {
  organizationId: string;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  defaultTaxRate: number;
  defaultPaymentTerms: number; // days
  logoUrl?: string;
  companyDetails: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
    website?: string;
  };
}

export interface InvoiceFilters {
  status?: InvoiceStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  clientName?: string;
  amountRange?: {
    min: number;
    max: number;
  };
}

export interface InvoiceStats {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  averageAmount: number;
  statusBreakdown: Record<InvoiceStatus, number>;
}
