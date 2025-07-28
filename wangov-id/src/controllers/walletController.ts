import { Request, Response } from 'express';
import { walletService, CreateWalletRequest, TransferRequest, PaymentRequest } from '../services/walletService';

export class WalletController {
  /**
   * Create a new wallet
   */
  async createWallet(req: Request, res: Response) {
    try {
      const { ownerId, ownerType, ownerName, currency } = req.body;
      
      // Validate required fields
      if (!ownerId || !ownerType || !ownerName) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: ownerId, ownerType, ownerName'
        });
      }
      
      // Check if wallet already exists for this owner
      const existingWallet = await walletService.getWalletByOwner(ownerId, ownerType);
      if (existingWallet) {
        return res.status(409).json({
          success: false,
          message: 'Wallet already exists for this owner'
        });
      }
      
      const createRequest: CreateWalletRequest = {
        ownerId,
        ownerType,
        ownerName,
        currency: currency || 'USD'
      };
      
      const wallet = await walletService.createWallet(createRequest);
      
      res.status(201).json({
        success: true,
        message: 'Wallet created successfully',
        data: wallet
      });
    } catch (error) {
      console.error('Create wallet error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create wallet',
        error: error.message
      });
    }
  }

  /**
   * Get wallet by ID
   */
  async getWallet(req: Request, res: Response) {
    try {
      const { walletId } = req.params;
      
      const wallet = await walletService.getWalletById(walletId);
      
      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: 'Wallet not found'
        });
      }
      
      res.json({
        success: true,
        data: wallet
      });
    } catch (error) {
      console.error('Get wallet error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve wallet',
        error: error.message
      });
    }
  }

  /**
   * Get wallet by owner
   */
  async getWalletByOwner(req: Request, res: Response) {
    try {
      const { ownerId, ownerType } = req.params;
      
      const wallet = await walletService.getWalletByOwner(ownerId, ownerType as any);
      
      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: 'Wallet not found for this owner'
        });
      }
      
      res.json({
        success: true,
        data: wallet
      });
    } catch (error) {
      console.error('Get wallet by owner error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve wallet',
        error: error.message
      });
    }
  }

  /**
   * Get wallet by wallet number
   */
  async getWalletByNumber(req: Request, res: Response) {
    try {
      const { walletNumber } = req.params;
      
      const wallet = await walletService.getWalletByNumber(walletNumber);
      
      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: 'Wallet not found'
        });
      }
      
      res.json({
        success: true,
        data: wallet
      });
    } catch (error) {
      console.error('Get wallet by number error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve wallet',
        error: error.message
      });
    }
  }

  /**
   * Transfer funds between wallets
   */
  async transferFunds(req: Request, res: Response) {
    try {
      const { fromWalletId, toWalletId, amount, description, referenceId, referenceType } = req.body;
      const initiatedBy = req.user?.id; // Assuming user is attached to request
      
      // Validate required fields
      if (!fromWalletId || !toWalletId || !amount || !initiatedBy) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: fromWalletId, toWalletId, amount'
        });
      }
      
      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than 0'
        });
      }
      
      const transferRequest: TransferRequest = {
        fromWalletId,
        toWalletId,
        amount: parseFloat(amount),
        description,
        referenceId,
        referenceType,
        initiatedBy
      };
      
      const transaction = await walletService.transferFunds(transferRequest);
      
      res.json({
        success: true,
        message: 'Transfer completed successfully',
        data: transaction
      });
    } catch (error) {
      console.error('Transfer funds error:', error);
      res.status(500).json({
        success: false,
        message: 'Transfer failed',
        error: error.message
      });
    }
  }

  /**
   * Process payment from wallet
   */
  async processPayment(req: Request, res: Response) {
    try {
      const { walletId, amount, description, referenceId, referenceType, recipientInfo } = req.body;
      const initiatedBy = req.user?.id;
      
      // Validate required fields
      if (!walletId || !amount || !description || !referenceId || !referenceType || !initiatedBy) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: walletId, amount, description, referenceId, referenceType'
        });
      }
      
      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than 0'
        });
      }
      
      const paymentRequest: PaymentRequest = {
        walletId,
        amount: parseFloat(amount),
        description,
        referenceId,
        referenceType,
        initiatedBy,
        recipientInfo
      };
      
      const transaction = await walletService.processPayment(paymentRequest);
      
      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: transaction
      });
    } catch (error) {
      console.error('Process payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Payment failed',
        error: error.message
      });
    }
  }

  /**
   * Add funds to wallet
   */
  async addFunds(req: Request, res: Response) {
    try {
      const { walletId, amount, description, referenceId } = req.body;
      const initiatedBy = req.user?.id;
      
      // Validate required fields
      if (!walletId || !amount || !description || !initiatedBy) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: walletId, amount, description'
        });
      }
      
      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than 0'
        });
      }
      
      const transaction = await walletService.addFunds(
        walletId,
        parseFloat(amount),
        description,
        initiatedBy,
        referenceId
      );
      
      res.json({
        success: true,
        message: 'Funds added successfully',
        data: transaction
      });
    } catch (error) {
      console.error('Add funds error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add funds',
        error: error.message
      });
    }
  }

  /**
   * Get wallet transaction history
   */
  async getTransactionHistory(req: Request, res: Response) {
    try {
      const { walletId } = req.params;
      const { 
        limit = 50, 
        offset = 0, 
        transactionType, 
        status 
      } = req.query;
      
      const transactions = await walletService.getTransactionHistory(
        walletId,
        parseInt(limit as string),
        parseInt(offset as string),
        transactionType as string,
        status as string
      );
      
      res.json({
        success: true,
        data: transactions,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          total: transactions.length
        }
      });
    } catch (error) {
      console.error('Get transaction history error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve transaction history',
        error: error.message
      });
    }
  }

  /**
   * Get transaction by ID
   */
  async getTransaction(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      
      const transaction = await walletService.getTransactionById(transactionId);
      
      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }
      
      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error('Get transaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve transaction',
        error: error.message
      });
    }
  }

  /**
   * Update wallet status
   */
  async updateWalletStatus(req: Request, res: Response) {
    try {
      const { walletId } = req.params;
      const { status } = req.body;
      const updatedBy = req.user?.id;
      
      if (!status || !updatedBy) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: status'
        });
      }
      
      const validStatuses = ['active', 'suspended', 'closed', 'pending_verification'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
        });
      }
      
      const wallet = await walletService.updateWalletStatus(walletId, status, updatedBy);
      
      res.json({
        success: true,
        message: 'Wallet status updated successfully',
        data: wallet
      });
    } catch (error) {
      console.error('Update wallet status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update wallet status',
        error: error.message
      });
    }
  }

  /**
   * Verify wallet
   */
  async verifyWallet(req: Request, res: Response) {
    try {
      const { walletId } = req.params;
      const verifiedBy = req.user?.id;
      
      if (!verifiedBy) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      const wallet = await walletService.verifyWallet(walletId, verifiedBy);
      
      res.json({
        success: true,
        message: 'Wallet verified successfully',
        data: wallet
      });
    } catch (error) {
      console.error('Verify wallet error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify wallet',
        error: error.message
      });
    }
  }

  /**
   * Get wallet statistics
   */
  async getWalletStats(req: Request, res: Response) {
    try {
      const { walletId } = req.params;
      
      const stats = await walletService.getWalletStats(walletId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get wallet stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve wallet statistics',
        error: error.message
      });
    }
  }

  /**
   * Search wallets (admin only)
   */
  async searchWallets(req: Request, res: Response) {
    try {
      const { searchTerm, ownerType, limit = 50 } = req.query;
      
      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }
      
      const wallets = await walletService.searchWallets(
        searchTerm as string,
        ownerType as string,
        parseInt(limit as string)
      );
      
      res.json({
        success: true,
        data: wallets
      });
    } catch (error) {
      console.error('Search wallets error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search wallets',
        error: error.message
      });
    }
  }

  /**
   * Get wallets by type (admin only)
   */
  async getWalletsByType(req: Request, res: Response) {
    try {
      const { ownerType } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      
      const wallets = await walletService.getWalletsByType(
        ownerType as any,
        parseInt(limit as string),
        parseInt(offset as string)
      );
      
      res.json({
        success: true,
        data: wallets,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          total: wallets.length
        }
      });
    } catch (error) {
      console.error('Get wallets by type error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve wallets',
        error: error.message
      });
    }
  }

  /**
   * Transfer funds by wallet number (convenience method)
   */
  async transferByWalletNumber(req: Request, res: Response) {
    try {
      const { fromWalletNumber, toWalletNumber, amount, description, referenceId, referenceType } = req.body;
      const initiatedBy = req.user?.id;
      
      // Validate required fields
      if (!fromWalletNumber || !toWalletNumber || !amount || !initiatedBy) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: fromWalletNumber, toWalletNumber, amount'
        });
      }
      
      // Get wallet IDs from wallet numbers
      const fromWallet = await walletService.getWalletByNumber(fromWalletNumber);
      const toWallet = await walletService.getWalletByNumber(toWalletNumber);
      
      if (!fromWallet || !toWallet) {
        return res.status(404).json({
          success: false,
          message: 'One or both wallet numbers not found'
        });
      }
      
      const transferRequest: TransferRequest = {
        fromWalletId: fromWallet.id,
        toWalletId: toWallet.id,
        amount: parseFloat(amount),
        description,
        referenceId,
        referenceType,
        initiatedBy
      };
      
      const transaction = await walletService.transferFunds(transferRequest);
      
      res.json({
        success: true,
        message: 'Transfer completed successfully',
        data: transaction
      });
    } catch (error) {
      console.error('Transfer by wallet number error:', error);
      res.status(500).json({
        success: false,
        message: 'Transfer failed',
        error: error.message
      });
    }
  }
}

export const walletController = new WalletController();
