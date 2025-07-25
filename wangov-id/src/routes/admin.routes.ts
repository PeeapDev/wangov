import { Router } from 'express';
import { authenticateAdmin, requireAdminRole } from '../middleware/authMiddleware';
import {
  adminLogin,
  listCitizens,
  getCitizenDetails,
  createCitizen,
  updateCitizen,
  suspendCitizen,
  reactivateCitizen,
  getSystemStats,
  getAuditLogs,
  getSystemHealth,
  configureSystem,
  manageAdmins,
  generateReports
} from '../controllers/admin.controller';

const router = Router();

// Public admin routes
router.post('/login', adminLogin);

// All other routes require admin authentication
router.use(authenticateAdmin);

// Citizen management - requires enrollment admin or higher
router.get('/citizens', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN', 'ENROLLMENT_ADMIN']), listCitizens);
router.get('/citizens/:id', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN', 'ENROLLMENT_ADMIN', 'SUPPORT_ADMIN']), getCitizenDetails);
router.post('/citizens', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN', 'ENROLLMENT_ADMIN']), createCitizen);
router.patch('/citizens/:id', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN', 'ENROLLMENT_ADMIN']), updateCitizen);
router.post('/citizens/:id/suspend', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN']), suspendCitizen);
router.post('/citizens/:id/reactivate', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN']), reactivateCitizen);

// System management - requires system admin or super admin
router.get('/system/stats', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN', 'AUDITOR']), getSystemStats);
router.get('/system/health', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN']), getSystemHealth);
router.post('/system/config', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN']), configureSystem);

// Admin user management - super admin only
router.all('/admins*', requireAdminRole(['SUPER_ADMIN']), manageAdmins);

// Audit logs - requires auditor or higher
router.get('/audit', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN', 'AUDITOR']), getAuditLogs);

// Reporting - requires system admin or auditor
router.get('/reports', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN', 'AUDITOR']), generateReports);

export default router;
