import { Router } from 'express';
import { authenticateAdmin, authenticateCitizen, requireAdminRole } from '../middleware/authMiddleware';
import { 
  registerOrganization,
  getOrganizationDetails,
  updateOrganization,
  listOrganizations,
  revokeOrganizationAccess,
  validateOrganizationApiKey,
  getOrganizationServices,
  registerService,
  updateService,
  deactivateService
} from '../controllers/organization.controller';

const router = Router();

// Admin routes for managing organizations
router.use('/admin', authenticateAdmin);
router.post('/admin/register', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN']), registerOrganization);
router.get('/admin/list', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN']), listOrganizations);
router.get('/admin/:id', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN']), getOrganizationDetails);
router.patch('/admin/:id', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN']), updateOrganization);
router.post('/admin/:id/revoke', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN']), revokeOrganizationAccess);

// Organization services management
router.get('/admin/:id/services', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN']), getOrganizationServices);
router.post('/admin/:id/services', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN']), registerService);
router.patch('/admin/:id/services/:serviceId', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN']), updateService);
router.delete('/admin/:id/services/:serviceId', requireAdminRole(['SUPER_ADMIN', 'SYSTEM_ADMIN']), deactivateService);

// Public API for organizations (requires API key validation)
router.use('/api', validateOrganizationApiKey);
router.get('/api/verify/:nid', (req, res) => {
  // Implementation for basic ID verification API
});

// Citizen-authorized organization access
router.use('/citizen', authenticateCitizen);
router.get('/citizen/authorized', (req, res) => {
  // Return organizations the citizen has authorized
});
router.post('/citizen/:id/authorize', (req, res) => {
  // Authorize a specific organization to access citizen data
});
router.delete('/citizen/:id/revoke', (req, res) => {
  // Revoke organization access to citizen data
});

export default router;
