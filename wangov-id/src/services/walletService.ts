import { v4 as uuidv4 } from 'uuid';

// Database connection interface
interface DatabasePool {
  connect(): Promise<any>;
  query(text: string, params?: any[]): Promise<any>;
}

// Database connection (assuming it's configured elsewhere)
declare const pool: DatabasePool;

export interface Wallet {
  id: string;
  walletNumber: string;
  ownerId: string;
  ownerType: 'citizen' | 'organization' | 'ncra' | 'government_agency' | 'super_admin';
  ownerName: string;
  balance: number;
  availableBalance: number;
  currency: string;
  status: 'active' | 'suspended' | 'closed' | 'pending_verification';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletTransaction {
  id: string;
  transactionNumber: string;
  fromWalletId?: string;
  toWalletId?: string;
  amount: number;
  currency: string;
  transactionType: 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out' | 'payment' | 'refund' | 'salary' | 'fee' | 'penalty' | 'bonus';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  description?: string;
  referenceId?: string;
  referenceType?: string;
  feeAmount: number;
  metadata?: any;
  initiatedBy: string;
  approvedBy?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWalletRequest {
  ownerId: string;
  ownerType: Wallet['ownerType'];
  ownerName: string;
  currency?: string;
}

export interface TransferRequest {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  description?: string;
  referenceId?: string;
  referenceType?: string;
  initiatedBy: string;
}

export interface PaymentRequest {
  walletId: string;
  amount: number;
  description: string;
  referenceId: string;
  referenceType: string;
  initiatedBy: string;
  recipientInfo?: {
    name: string;
    type: string;
  };
}

class WalletService {
  /**
   * Create a new wallet for a user/organization
   */
  async createWallet(request: CreateWalletRequest): Promise<Wallet> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const query = `
        INSERT INTO wallets (
          owner_id, owner_type, owner_name, currency, status, is_verified
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      
      const values = [
        request.ownerId,
        request.ownerType,
        request.ownerName,
        request.currency || 'USD',
        'active',
        false // Will be verified through separate process
      ];
      
      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      return this.mapWalletFromDb(result.rows[0]);
    } catch (error: any) {
      await client.query('ROLLBACK');
      throw new Error(`Failed to create wallet: ${error?.message || 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  /**
   * Get wallet by ID
   */
  async getWalletById(walletId: string): Promise<Wallet | null> {
    const query = 'SELECT * FROM wallets WHERE id = $1';
    const result = await pool.query(query, [walletId]);
    
    return result.rows.length > 0 ? this.mapWalletFromDb(result.rows[0]) : null;
  }

  /**
   * Get wallet by owner
   */
  async getWalletByOwner(ownerId: string, ownerType: Wallet['ownerType']): Promise<Wallet | null> {
    const query = 'SELECT * FROM wallets WHERE owner_id = $1 AND owner_type = $2';
    const result = await pool.query(query, [ownerId, ownerType]);
    
    return result.rows.length > 0 ? this.mapWalletFromDb(result.rows[0]) : null;
  }

  /**
   * Get wallet by wallet number
   */
  async getWalletByNumber(walletNumber: string): Promise<Wallet | null> {
    const query = 'SELECT * FROM wallets WHERE wallet_number = $1';
    const result = await pool.query(query, [walletNumber]);
    
    return result.rows.length > 0 ? this.mapWalletFromDb(result.rows[0]) : null;
  }

  /**
   * Get all wallets for an owner type (for admin purposes)
   */
  async getWalletsByType(ownerType: Wallet['ownerType'], limit: number = 50, offset: number = 0): Promise<Wallet[]> {
    const query = `
      SELECT * FROM wallets 
      WHERE owner_type = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [ownerType, limit, offset]);
    
    return result.rows.map(row => this.mapWalletFromDb(row));
  }

  /**
   * Transfer funds between wallets
   */
  async transferFunds(request: TransferRequest): Promise<WalletTransaction> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Validate wallets exist and have sufficient balance
      const fromWallet = await this.getWalletById(request.fromWalletId);
      const toWallet = await this.getWalletById(request.toWalletId);
      
      if (!fromWallet || !toWallet) {
        throw new Error('One or both wallets not found');
      }
      
      if (fromWallet.status !== 'active' || toWallet.status !== 'active') {
        throw new Error('One or both wallets are not active');
      }
      
      if (fromWallet.availableBalance < request.amount) {
        throw new Error('Insufficient balance');
      }
      
      // Create transaction record
      const transactionQuery = `
        INSERT INTO wallet_transactions (
          from_wallet_id, to_wallet_id, amount, transaction_type, 
          status, description, reference_id, reference_type, initiated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      
      const transactionValues = [
        request.fromWalletId,
        request.toWalletId,
        request.amount,
        'transfer_out', // This will create corresponding transfer_in
        'completed', // Direct completion for internal transfers
        request.description || 'Wallet transfer',
        request.referenceId,
        request.referenceType || 'internal_transfer',
        request.initiatedBy
      ];
      
      const transactionResult = await client.query(transactionQuery, transactionValues);
      
      // Update wallet balances (handled by trigger, but we'll do it explicitly for safety)
      await client.query(
        'UPDATE wallets SET balance = balance - $1, available_balance = available_balance - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [request.amount, request.fromWalletId]
      );
      
      await client.query(
        'UPDATE wallets SET balance = balance + $1, available_balance = available_balance + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [request.amount, request.toWalletId]
      );
      
      await client.query('COMMIT');
      
      return this.mapTransactionFromDb(transactionResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Transfer failed: ${error.message}`);
    } finally {
      client.release();
    }
  }

  /**
   * Process payment from wallet
   */
  async processPayment(request: PaymentRequest): Promise<WalletTransaction> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Validate wallet
      const wallet = await this.getWalletById(request.walletId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }
      
      if (wallet.status !== 'active') {
        throw new Error('Wallet is not active');
      }
      
      if (wallet.availableBalance < request.amount) {
        throw new Error('Insufficient balance');
      }
      
      // Create payment transaction
      const transactionQuery = `
        INSERT INTO wallet_transactions (
          from_wallet_id, amount, transaction_type, status, 
          description, reference_id, reference_type, initiated_by, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      
      const metadata = request.recipientInfo ? { recipient: request.recipientInfo } : null;
      
      const transactionValues = [
        request.walletId,
        request.amount,
        'payment',
        'completed',
        request.description,
        request.referenceId,
        request.referenceType,
        request.initiatedBy,
        JSON.stringify(metadata)
      ];
      
      const transactionResult = await client.query(transactionQuery, transactionValues);
      
      // Update wallet balance
      await client.query(
        'UPDATE wallets SET balance = balance - $1, available_balance = available_balance - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [request.amount, request.walletId]
      );
      
      await client.query('COMMIT');
      
      return this.mapTransactionFromDb(transactionResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Payment failed: ${error.message}`);
    } finally {
      client.release();
    }
  }

  /**
   * Add funds to wallet (deposit)
   */
  async addFunds(walletId: string, amount: number, description: string, initiatedBy: string, referenceId?: string): Promise<WalletTransaction> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Validate wallet
      const wallet = await this.getWalletById(walletId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }
      
      // Create deposit transaction
      const transactionQuery = `
        INSERT INTO wallet_transactions (
          to_wallet_id, amount, transaction_type, status, 
          description, reference_id, reference_type, initiated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      
      const transactionValues = [
        walletId,
        amount,
        'deposit',
        'completed',
        description,
        referenceId,
        'deposit',
        initiatedBy
      ];
      
      const transactionResult = await client.query(transactionQuery, transactionValues);
      
      // Update wallet balance
      await client.query(
        'UPDATE wallets SET balance = balance + $1, available_balance = available_balance + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [amount, walletId]
      );
      
      await client.query('COMMIT');
      
      return this.mapTransactionFromDb(transactionResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Deposit failed: ${error.message}`);
    } finally {
      client.release();
    }
  }

  /**
   * Get wallet transaction history
   */
  async getTransactionHistory(
    walletId: string, 
    limit: number = 50, 
    offset: number = 0,
    transactionType?: string,
    status?: string
  ): Promise<WalletTransaction[]> {
    let query = `
      SELECT * FROM wallet_transactions 
      WHERE (from_wallet_id = $1 OR to_wallet_id = $1)
    `;
    const params: any[] = [walletId];
    let paramCount = 1;
    
    if (transactionType) {
      paramCount++;
      query += ` AND transaction_type = $${paramCount}`;
      params.push(transactionType);
    }
    
    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    return result.rows.map(row => this.mapTransactionFromDb(row));
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(transactionId: string): Promise<WalletTransaction | null> {
    const query = 'SELECT * FROM wallet_transactions WHERE id = $1';
    const result = await pool.query(query, [transactionId]);
    
    return result.rows.length > 0 ? this.mapTransactionFromDb(result.rows[0]) : null;
  }

  /**
   * Update wallet status
   */
  async updateWalletStatus(walletId: string, status: Wallet['status'], updatedBy: string): Promise<Wallet> {
    const query = `
      UPDATE wallets 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;
    
    const result = await pool.query(query, [status, walletId]);
    
    if (result.rows.length === 0) {
      throw new Error('Wallet not found');
    }
    
    return this.mapWalletFromDb(result.rows[0]);
  }

  /**
   * Verify wallet
   */
  async verifyWallet(walletId: string, verifiedBy: string): Promise<Wallet> {
    const query = `
      UPDATE wallets 
      SET is_verified = true, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    
    const result = await pool.query(query, [walletId]);
    
    if (result.rows.length === 0) {
      throw new Error('Wallet not found');
    }
    
    return this.mapWalletFromDb(result.rows[0]);
  }

  /**
   * Get wallet statistics
   */
  async getWalletStats(walletId: string): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_transactions,
        COUNT(*) FILTER (WHERE transaction_type = 'deposit') as total_deposits,
        COUNT(*) FILTER (WHERE transaction_type = 'payment') as total_payments,
        COUNT(*) FILTER (WHERE transaction_type IN ('transfer_in', 'transfer_out')) as total_transfers,
        SUM(amount) FILTER (WHERE transaction_type = 'deposit') as total_deposited,
        SUM(amount) FILTER (WHERE transaction_type = 'payment') as total_spent,
        SUM(amount) FILTER (WHERE transaction_type = 'transfer_in') as total_received,
        SUM(amount) FILTER (WHERE transaction_type = 'transfer_out') as total_sent
      FROM wallet_transactions 
      WHERE (from_wallet_id = $1 OR to_wallet_id = $1) AND status = 'completed'
    `;
    
    const result = await pool.query(query, [walletId]);
    return result.rows[0];
  }

  /**
   * Search wallets (for admin purposes)
   */
  async searchWallets(searchTerm: string, ownerType?: string, limit: number = 50): Promise<Wallet[]> {
    let query = `
      SELECT * FROM wallets 
      WHERE (owner_name ILIKE $1 OR wallet_number ILIKE $1)
    `;
    const params: any[] = [`%${searchTerm}%`];
    
    if (ownerType) {
      query += ` AND owner_type = $2`;
      params.push(ownerType);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);
    
    const result = await pool.query(query, params);
    return result.rows.map(row => this.mapWalletFromDb(row));
  }

  /**
   * Helper method to map database row to Wallet interface
   */
  private mapWalletFromDb(row: any): Wallet {
    return {
      id: row.id,
      walletNumber: row.wallet_number,
      ownerId: row.owner_id,
      ownerType: row.owner_type,
      ownerName: row.owner_name,
      balance: parseFloat(row.balance),
      availableBalance: parseFloat(row.available_balance),
      currency: row.currency,
      status: row.status,
      isVerified: row.is_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  /**
   * Helper method to map database row to WalletTransaction interface
   */
  private mapTransactionFromDb(row: any): WalletTransaction {
    return {
      id: row.id,
      transactionNumber: row.transaction_number,
      fromWalletId: row.from_wallet_id,
      toWalletId: row.to_wallet_id,
      amount: parseFloat(row.amount),
      currency: row.currency,
      transactionType: row.transaction_type,
      status: row.status,
      description: row.description,
      referenceId: row.reference_id,
      referenceType: row.reference_type,
      feeAmount: parseFloat(row.fee_amount || 0),
      metadata: row.metadata,
      initiatedBy: row.initiated_by,
      approvedBy: row.approved_by,
      processedAt: row.processed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

export const walletService = new WalletService();
export default walletService;
