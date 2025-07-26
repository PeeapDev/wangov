const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage (replace with database in production)
let invoices = [];
let invoiceSettings = {
  id: 'default',
  companyName: 'WanGov Digital Services',
  companyAddress: 'Freetown, Sierra Leone',
  companyEmail: 'invoices@wangov.sl',
  companyPhone: '+232 XX XXX XXXX',
  companyWebsite: 'https://wangov.sl',
  defaultTaxRate: 15,
  defaultPaymentTerms: 30,
  invoicePrefix: 'WG',
  currency: 'SLL',
  logoUrl: '',
  defaultNotes: 'Thank you for choosing WanGov Digital Services!',
  defaultTerms: 'Payment is due within 30 days of invoice date. Late payments may incur additional charges.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
let templates = [];

// Authentication middleware (simplified)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  // In production, verify JWT token here
  // For now, we'll just pass through
  req.user = { id: 'user-1', role: 'admin' };
  next();
};

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/invoices - Get all invoices with optional filtering
router.get('/', (req, res) => {
  try {
    let filteredInvoices = [...invoices];
    
    // Filter by status
    if (req.query.status) {
      const statuses = req.query.status.split(',');
      filteredInvoices = filteredInvoices.filter(invoice => 
        statuses.includes(invoice.status)
      );
    }
    
    // Filter by client name
    if (req.query.clientName) {
      const searchTerm = req.query.clientName.toLowerCase();
      filteredInvoices = filteredInvoices.filter(invoice =>
        invoice.clientName.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort by creation date (newest first)
    filteredInvoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(filteredInvoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// GET /api/invoices/stats - Get invoice statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalInvoices: invoices.length,
      totalAmount: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      paidAmount: invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.totalAmount, 0),
      overdueAmount: invoices
        .filter(inv => inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.totalAmount, 0),
      draftCount: invoices.filter(inv => inv.status === 'draft').length,
      sentCount: invoices.filter(inv => inv.status === 'sent').length,
      paidCount: invoices.filter(inv => inv.status === 'paid').length,
      overdueCount: invoices.filter(inv => inv.status === 'overdue').length,
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching invoice stats:', error);
    res.status(500).json({ error: 'Failed to fetch invoice statistics' });
  }
});

// GET /api/invoices/:id - Get specific invoice
router.get('/:id', (req, res) => {
  try {
    const invoice = invoices.find(inv => inv.id === req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// POST /api/invoices - Create new invoice
router.post('/', (req, res) => {
  try {
    const {
      invoiceNumber,
      clientName,
      clientEmail,
      clientAddress,
      issueDate,
      dueDate,
      items,
      subtotal,
      taxAmount,
      totalAmount,
      notes,
      terms,
      status = 'draft'
    } = req.body;
    
    // Validate required fields
    if (!invoiceNumber || !clientName || !clientEmail || !issueDate || !dueDate || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newInvoice = {
      id: uuidv4(),
      invoiceNumber,
      clientName,
      clientEmail,
      clientAddress: clientAddress || '',
      issueDate,
      dueDate,
      items: items.map(item => ({
        id: item.id || uuidv4(),
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      subtotal,
      taxAmount,
      totalAmount,
      notes: notes || '',
      terms: terms || '',
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user.id,
    };
    
    invoices.push(newInvoice);
    
    res.status(201).json(newInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// PUT /api/invoices/:id - Update invoice
router.put('/:id', (req, res) => {
  try {
    const invoiceIndex = invoices.findIndex(inv => inv.id === req.params.id);
    
    if (invoiceIndex === -1) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    const existingInvoice = invoices[invoiceIndex];
    const updatedInvoice = {
      ...existingInvoice,
      ...req.body,
      id: existingInvoice.id, // Prevent ID change
      createdAt: existingInvoice.createdAt, // Prevent creation date change
      updatedAt: new Date().toISOString(),
    };
    
    invoices[invoiceIndex] = updatedInvoice;
    
    res.json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// DELETE /api/invoices/:id - Delete invoice
router.delete('/:id', (req, res) => {
  try {
    const invoiceIndex = invoices.findIndex(inv => inv.id === req.params.id);
    
    if (invoiceIndex === -1) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    invoices.splice(invoiceIndex, 1);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

// POST /api/invoices/:id/send - Send invoice
router.post('/:id/send', (req, res) => {
  try {
    const invoiceIndex = invoices.findIndex(inv => inv.id === req.params.id);
    
    if (invoiceIndex === -1) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    const invoice = invoices[invoiceIndex];
    
    // Update status to sent
    invoice.status = 'sent';
    invoice.sentDate = new Date().toISOString();
    invoice.updatedAt = new Date().toISOString();
    
    // In production, send email here
    console.log(`Sending invoice ${invoice.invoiceNumber} to ${invoice.clientEmail}`);
    
    res.json({ message: 'Invoice sent successfully', invoice });
  } catch (error) {
    console.error('Error sending invoice:', error);
    res.status(500).json({ error: 'Failed to send invoice' });
  }
});

// POST /api/invoices/:id/mark-paid - Mark invoice as paid
router.post('/:id/mark-paid', (req, res) => {
  try {
    const invoiceIndex = invoices.findIndex(inv => inv.id === req.params.id);
    
    if (invoiceIndex === -1) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    const invoice = invoices[invoiceIndex];
    const { paidDate } = req.body;
    
    invoice.status = 'paid';
    invoice.paidDate = paidDate || new Date().toISOString();
    invoice.updatedAt = new Date().toISOString();
    
    res.json(invoice);
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    res.status(500).json({ error: 'Failed to mark invoice as paid' });
  }
});

// GET /api/invoices/:id/pdf - Generate PDF (placeholder)
router.get('/:id/pdf', (req, res) => {
  try {
    const invoice = invoices.find(inv => inv.id === req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    // In production, generate actual PDF here using libraries like puppeteer or pdfkit
    // For now, return a simple text response
    const pdfContent = `
      INVOICE: ${invoice.invoiceNumber}
      
      Bill To:
      ${invoice.clientName}
      ${invoice.clientEmail}
      ${invoice.clientAddress}
      
      Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}
      Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
      
      Items:
      ${invoice.items.map(item => 
        `${item.description} - Qty: ${item.quantity} x ${item.unitPrice} = ${item.total}`
      ).join('\n')}
      
      Subtotal: ${invoice.subtotal}
      Tax: ${invoice.taxAmount}
      Total: ${invoice.totalAmount}
      
      Notes: ${invoice.notes}
      Terms: ${invoice.terms}
    `;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
    res.send(Buffer.from(pdfContent, 'utf8'));
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Invoice Templates Routes
// GET /api/invoice-templates
router.get('/templates', (req, res) => {
  try {
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// POST /api/invoice-templates
router.post('/templates', (req, res) => {
  try {
    const { name, defaultItems, defaultNotes, defaultTerms } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Template name is required' });
    }
    
    const newTemplate = {
      id: uuidv4(),
      name,
      defaultItems: defaultItems || [],
      defaultNotes: defaultNotes || '',
      defaultTerms: defaultTerms || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user.id,
    };
    
    templates.push(newTemplate);
    
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// Invoice Settings Routes
// GET /api/invoice-settings
router.get('/settings', (req, res) => {
  try {
    res.json(invoiceSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/invoice-settings
router.put('/settings', (req, res) => {
  try {
    invoiceSettings = {
      ...invoiceSettings,
      ...req.body,
      id: invoiceSettings.id, // Prevent ID change
      updatedAt: new Date().toISOString(),
    };
    
    res.json(invoiceSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
