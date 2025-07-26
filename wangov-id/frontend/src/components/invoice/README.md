# Invoice Management Module

A comprehensive invoice management system for WanGov that can be shared across all dashboards (Organization, Provider, Government, NCRA, Superadmin).

## Features

### Core Functionality
- **Create & Edit Invoices**: Full-featured invoice creation with line items, tax calculations, and client information
- **Invoice Templates**: Reusable templates for common invoice types
- **Status Management**: Track invoice status (draft, sent, viewed, paid, overdue, cancelled)
- **PDF Generation**: Export invoices as PDF documents
- **Email Integration**: Send invoices directly to clients (backend implementation required)

### Dashboard Features
- **Statistics Overview**: Total invoices, amounts, paid/overdue tracking
- **Advanced Filtering**: Filter by status, client name, date ranges
- **Search Functionality**: Quick search across invoice numbers and client names
- **Bulk Actions**: Mark multiple invoices as paid, send reminders

### Settings & Customization
- **Company Branding**: Logo, company information, contact details
- **Tax Configuration**: Default tax rates and calculations
- **Currency Support**: Multi-currency support (SLL default)
- **Payment Terms**: Configurable payment terms and due dates
- **Default Content**: Pre-filled notes and terms & conditions

## Components

### Main Components
- `InvoiceModule.tsx` - Main module wrapper with routing
- `InvoiceDashboard.tsx` - Dashboard with statistics and invoice list
- `InvoiceForm.tsx` - Create/edit invoice form
- `InvoiceSettings.tsx` - Company settings and preferences

### Context & Services
- `InvoiceContext.tsx` - React context for state management
- `invoiceService.ts` - API service layer
- `types/invoice.ts` - TypeScript type definitions

## Usage

### Basic Integration

```tsx
import InvoiceModule from './components/invoice/InvoiceModule';
import { InvoiceProvider } from './contexts/InvoiceContext';

function App() {
  return (
    <InvoiceProvider>
      <InvoiceModule />
    </InvoiceProvider>
  );
}
```

### Dashboard Integration

```tsx
import InvoiceDashboard from './components/invoice/InvoiceDashboard';
import { InvoiceProvider } from './contexts/InvoiceContext';

function Dashboard() {
  return (
    <div className="dashboard">
      <InvoiceProvider>
        <InvoiceDashboard />
      </InvoiceProvider>
    </div>
  );
}
```

### Standalone Form

```tsx
import InvoiceForm from './components/invoice/InvoiceForm';
import { InvoiceProvider } from './contexts/InvoiceContext';

function CreateInvoice() {
  const handleSave = (invoice) => {
    console.log('Invoice saved:', invoice);
  };

  return (
    <InvoiceProvider>
      <InvoiceForm onSave={handleSave} />
    </InvoiceProvider>
  );
}
```

## API Endpoints

### Invoices
- `GET /api/invoices` - List all invoices with filtering
- `GET /api/invoices/:id` - Get specific invoice
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/stats` - Get invoice statistics
- `POST /api/invoices/:id/send` - Send invoice to client
- `POST /api/invoices/:id/mark-paid` - Mark invoice as paid
- `GET /api/invoices/:id/pdf` - Generate PDF

### Templates
- `GET /api/invoices/templates` - List invoice templates
- `POST /api/invoices/templates` - Create new template

### Settings
- `GET /api/invoices/settings` - Get invoice settings
- `PUT /api/invoices/settings` - Update invoice settings

## Configuration

### Environment Variables

```env
VITE_API_URL=http://localhost:3001
```

### Default Settings

The module comes with sensible defaults for Sierra Leone:
- Currency: SLL (Sierra Leonean Leone)
- Tax Rate: 15%
- Payment Terms: 30 days
- Company: WanGov Digital Services

## Customization

### Styling
The module uses Tailwind CSS classes and can be customized by:
1. Modifying the existing classes
2. Adding custom CSS overrides
3. Using Tailwind configuration

### Currency Support
Add new currencies in `InvoiceSettings.tsx`:

```tsx
const currencies = [
  { code: 'SLL', name: 'Sierra Leonean Leone' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  // Add more currencies
];
```

### Authentication
The module uses a simple authentication middleware. Replace with your authentication system:

```tsx
const authenticateToken = (req, res, next) => {
  // Your authentication logic here
  req.user = getUserFromToken(req.headers.authorization);
  next();
};
```

## Database Integration

Currently uses in-memory storage. For production, replace with database operations:

1. **MongoDB/Mongoose**
2. **PostgreSQL/Prisma**
3. **MySQL/Sequelize**

Example with Prisma:

```tsx
// Replace in-memory arrays with database calls
const invoices = await prisma.invoice.findMany({
  where: filters,
  orderBy: { createdAt: 'desc' }
});
```

## PDF Generation

The current PDF endpoint returns plain text. For production, integrate:

1. **Puppeteer** - HTML to PDF conversion
2. **PDFKit** - Programmatic PDF creation
3. **jsPDF** - Client-side PDF generation

Example with Puppeteer:

```tsx
const puppeteer = require('puppeteer');

const generatePDF = async (invoice) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const html = generateInvoiceHTML(invoice);
  await page.setContent(html);
  
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true
  });
  
  await browser.close();
  return pdf;
};
```

## Email Integration

For sending invoices via email, integrate with:

1. **Nodemailer** - SMTP email sending
2. **SendGrid** - Email service API
3. **AWS SES** - Amazon email service

Example with Nodemailer:

```tsx
const nodemailer = require('nodemailer');

const sendInvoice = async (invoice) => {
  const transporter = nodemailer.createTransporter({
    // SMTP configuration
  });
  
  await transporter.sendMail({
    from: 'invoices@wangov.sl',
    to: invoice.clientEmail,
    subject: `Invoice ${invoice.invoiceNumber}`,
    html: generateInvoiceHTML(invoice),
    attachments: [{
      filename: `invoice-${invoice.invoiceNumber}.pdf`,
      content: await generatePDF(invoice)
    }]
  });
};
```

## Security Considerations

1. **Input Validation**: Validate all invoice data
2. **Authorization**: Ensure users can only access their invoices
3. **Rate Limiting**: Prevent abuse of PDF generation
4. **File Upload**: Secure logo upload handling
5. **SQL Injection**: Use parameterized queries

## Testing

### Unit Tests
```bash
npm test -- --testPathPattern=invoice
```

### Integration Tests
```bash
npm run test:integration -- invoice
```

### E2E Tests
```bash
npm run test:e2e -- invoice
```

## Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Install dependencies**:
   ```bash
   npm install --production
   ```

3. **Set environment variables**:
   ```bash
   export NODE_ENV=production
   export DATABASE_URL=your_database_url
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

## Support

For issues and feature requests, contact the WanGov development team or create an issue in the project repository.

## License

This module is part of the WanGov Digital Identity Platform and is subject to the project's licensing terms.
