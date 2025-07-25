import { Router } from 'express';
import { authenticateCitizen } from '../middleware/authMiddleware';
import { 
  register,
  login,
  verifyEmail,
  verifyPhone,
  resetPassword,
  requestPasswordReset,
  logout,
  refreshToken,
  changePassword
} from '../controllers/auth.controller';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/verify-phone', verifyPhone);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);

// Protected routes
router.use(authenticateCitizen);
router.post('/logout', logout);
router.post('/change-password', changePassword);

export default router;
