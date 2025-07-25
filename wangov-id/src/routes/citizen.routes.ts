import { Router } from 'express';
import { authenticateCitizen } from '../middleware/authMiddleware';
import {
  getCitizenProfile,
  updateCitizenProfile,
  updateContactInfo,
  enrollBiometrics,
  verifyBiometrics,
  getActivityLog,
  manageConsents,
  getDocuments,
  uploadDocument,
  getServiceAccess
} from '../controllers/citizen.controller';

const router = Router();

// All routes require citizen authentication
router.use(authenticateCitizen);

// Profile management
router.get('/profile', getCitizenProfile);
router.patch('/profile', updateCitizenProfile);
router.patch('/contact', updateContactInfo);

// Biometrics
router.post('/biometrics/enroll', enrollBiometrics);
router.post('/biometrics/verify', verifyBiometrics);

// Activity tracking
router.get('/activity', getActivityLog);

// Document management
router.get('/documents', getDocuments);
router.post('/documents', uploadDocument);

// Consent management
router.get('/consents', manageConsents);
router.post('/consents', manageConsents);
router.put('/consents/:consentId', manageConsents);

// Service access management
router.get('/services', getServiceAccess);

export default router;
