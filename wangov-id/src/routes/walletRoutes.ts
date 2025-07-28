import { Router } from 'express';
import { walletController } from '../controllers/walletController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all wallet routes
router.use(authMiddleware);

/**
 * Wallet Management Routes
 */

// Create a new wallet
router.post('/create', walletController.createWallet);

// Get wallet by ID
router.get('/:walletId', walletController.getWallet);

// Get wallet by owner
router.get('/owner/:ownerId/:ownerType', walletController.getWalletByOwner);

// Get wallet by wallet number
router.get('/number/:walletNumber', walletController.getWalletByNumber);

// Update wallet status (admin only)
router.patch('/:walletId/status', walletController.updateWalletStatus);

// Verify wallet (admin only)
router.patch('/:walletId/verify', walletController.verifyWallet);

// Get wallet statistics
router.get('/:walletId/stats', walletController.getWalletStats);

/**
 * Transaction Routes
 */

// Transfer funds between wallets
router.post('/transfer', walletController.transferFunds);

// Transfer funds by wallet number
router.post('/transfer/by-number', walletController.transferByWalletNumber);

// Process payment from wallet
router.post('/payment', walletController.processPayment);

// Add funds to wallet
router.post('/add-funds', walletController.addFunds);

// Get transaction by ID
router.get('/transaction/:transactionId', walletController.getTransaction);

// Get wallet transaction history
router.get('/:walletId/transactions', walletController.getTransactionHistory);

/**
 * Admin Routes
 */

// Search wallets (admin only)
router.get('/admin/search', walletController.searchWallets);

// Get wallets by type (admin only)
router.get('/admin/type/:ownerType', walletController.getWalletsByType);

export default router;
