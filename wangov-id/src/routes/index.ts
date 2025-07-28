import { Router } from 'express';
import citizenRoutes from './citizen.routes';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import organizationRoutes from './organization.routes';
import ssoRoutes from './sso.routes';
import healthRoutes from './health.routes';
import invoiceRoutes from './invoice.routes';
import searchRoutes from './searchRoutes';
import walletRoutes from './walletRoutes';

const router = Router();

// Map all route groups
router.use('/health', healthRoutes);
router.use('/citizens', citizenRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/organizations', organizationRoutes);
router.use('/sso', ssoRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/search', searchRoutes);
router.use('/wallet', walletRoutes);

export default router;
