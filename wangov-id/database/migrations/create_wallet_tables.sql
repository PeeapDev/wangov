-- WanGov Wallet System Database Schema
-- Created: 2025-07-28
-- Purpose: Comprehensive wallet system for all user types

-- Wallet Types Enum
CREATE TYPE wallet_type AS ENUM (
    'citizen',
    'organization', 
    'ncra',
    'government_agency',
    'super_admin'
);

-- Transaction Types Enum
CREATE TYPE transaction_type AS ENUM (
    'deposit',
    'withdrawal',
    'transfer_in',
    'transfer_out',
    'payment',
    'refund',
    'salary',
    'fee',
    'penalty',
    'bonus'
);

-- Transaction Status Enum
CREATE TYPE transaction_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled',
    'refunded'
);

-- Main Wallets Table
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_number VARCHAR(20) UNIQUE NOT NULL, -- Format: WG-XXXX-XXXX-XXXX
    owner_id UUID NOT NULL, -- References user/organization/agency ID
    owner_type wallet_type NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00 NOT NULL,
    available_balance DECIMAL(15,2) DEFAULT 0.00 NOT NULL, -- Balance minus pending transactions
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    status VARCHAR(20) DEFAULT 'active' NOT NULL, -- active, suspended, closed
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT positive_balance CHECK (balance >= 0),
    CONSTRAINT positive_available_balance CHECK (available_balance >= 0),
    CONSTRAINT valid_status CHECK (status IN ('active', 'suspended', 'closed', 'pending_verification'))
);

-- Wallet Transactions Table
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_number VARCHAR(30) UNIQUE NOT NULL, -- Format: TXN-YYYYMMDD-XXXXXXXX
    from_wallet_id UUID REFERENCES wallets(id),
    to_wallet_id UUID REFERENCES wallets(id),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    transaction_type transaction_type NOT NULL,
    status transaction_status DEFAULT 'pending' NOT NULL,
    description TEXT,
    reference_id UUID, -- Reference to service/invoice/salary record
    reference_type VARCHAR(50), -- 'service_payment', 'salary', 'transfer', etc.
    fee_amount DECIMAL(10,2) DEFAULT 0.00,
    metadata JSONB, -- Additional transaction data
    initiated_by UUID NOT NULL, -- User who initiated the transaction
    approved_by UUID, -- User who approved the transaction (if required)
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT positive_amount CHECK (amount > 0),
    CONSTRAINT positive_fee CHECK (fee_amount >= 0),
    CONSTRAINT valid_transfer CHECK (
        (transaction_type IN ('transfer_in', 'transfer_out') AND from_wallet_id IS NOT NULL AND to_wallet_id IS NOT NULL) OR
        (transaction_type NOT IN ('transfer_in', 'transfer_out'))
    )
);

-- Wallet Transaction Logs (Audit Trail)
CREATE TABLE wallet_transaction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES wallet_transactions(id),
    previous_status transaction_status,
    new_status transaction_status NOT NULL,
    changed_by UUID NOT NULL,
    change_reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wallet Settings Table
CREATE TABLE wallet_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(wallet_id, setting_key)
);

-- Payment Methods Table (for future integration)
CREATE TABLE wallet_payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    method_type VARCHAR(50) NOT NULL, -- 'bank_account', 'credit_card', 'mobile_money'
    provider VARCHAR(100), -- 'visa', 'mastercard', 'mtn_mobile_money', etc.
    account_number_encrypted TEXT, -- Encrypted account/card number
    account_name VARCHAR(255),
    is_default BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wallet Notifications Table
CREATE TABLE wallet_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    transaction_id UUID REFERENCES wallet_transactions(id),
    notification_type VARCHAR(50) NOT NULL, -- 'transaction', 'low_balance', 'security_alert'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_wallets_owner ON wallets(owner_id, owner_type);
CREATE INDEX idx_wallets_status ON wallets(status);
CREATE INDEX idx_wallets_wallet_number ON wallets(wallet_number);

CREATE INDEX idx_transactions_wallet_from ON wallet_transactions(from_wallet_id);
CREATE INDEX idx_transactions_wallet_to ON wallet_transactions(to_wallet_id);
CREATE INDEX idx_transactions_status ON wallet_transactions(status);
CREATE INDEX idx_transactions_type ON wallet_transactions(transaction_type);
CREATE INDEX idx_transactions_date ON wallet_transactions(created_at);
CREATE INDEX idx_transactions_number ON wallet_transactions(transaction_number);

CREATE INDEX idx_transaction_logs_transaction ON wallet_transaction_logs(transaction_id);
CREATE INDEX idx_transaction_logs_date ON wallet_transaction_logs(created_at);

CREATE INDEX idx_wallet_settings_wallet ON wallet_settings(wallet_id);
CREATE INDEX idx_payment_methods_wallet ON wallet_payment_methods(wallet_id);
CREATE INDEX idx_notifications_wallet ON wallet_notifications(wallet_id, is_read);

-- Functions for Wallet Number Generation
CREATE OR REPLACE FUNCTION generate_wallet_number()
RETURNS VARCHAR(20) AS $$
DECLARE
    wallet_num VARCHAR(20);
    exists_check INTEGER;
BEGIN
    LOOP
        -- Generate format: WG-XXXX-XXXX-XXXX
        wallet_num := 'WG-' || 
                     LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0') || '-' ||
                     LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0') || '-' ||
                     LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        
        SELECT COUNT(*) INTO exists_check FROM wallets WHERE wallet_number = wallet_num;
        
        IF exists_check = 0 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN wallet_num;
END;
$$ LANGUAGE plpgsql;

-- Function for Transaction Number Generation
CREATE OR REPLACE FUNCTION generate_transaction_number()
RETURNS VARCHAR(30) AS $$
DECLARE
    txn_num VARCHAR(30);
    exists_check INTEGER;
BEGIN
    LOOP
        -- Generate format: TXN-YYYYMMDD-XXXXXXXX
        txn_num := 'TXN-' || 
                  TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' ||
                  LPAD(FLOOR(RANDOM() * 100000000)::TEXT, 8, '0');
        
        SELECT COUNT(*) INTO exists_check FROM wallet_transactions WHERE transaction_number = txn_num;
        
        IF exists_check = 0 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN txn_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate wallet number
CREATE OR REPLACE FUNCTION set_wallet_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.wallet_number IS NULL OR NEW.wallet_number = '' THEN
        NEW.wallet_number := generate_wallet_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_wallet_number
    BEFORE INSERT ON wallets
    FOR EACH ROW
    EXECUTE FUNCTION set_wallet_number();

-- Trigger to auto-generate transaction number
CREATE OR REPLACE FUNCTION set_transaction_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.transaction_number IS NULL OR NEW.transaction_number = '' THEN
        NEW.transaction_number := generate_transaction_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_transaction_number
    BEFORE INSERT ON wallet_transactions
    FOR EACH ROW
    EXECUTE FUNCTION set_transaction_number();

-- Trigger to update wallet balances
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle completed transactions
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Update sender wallet (decrease balance)
        IF NEW.from_wallet_id IS NOT NULL THEN
            UPDATE wallets 
            SET balance = balance - (NEW.amount + NEW.fee_amount),
                available_balance = available_balance - (NEW.amount + NEW.fee_amount),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.from_wallet_id;
        END IF;
        
        -- Update receiver wallet (increase balance)
        IF NEW.to_wallet_id IS NOT NULL THEN
            UPDATE wallets 
            SET balance = balance + NEW.amount,
                available_balance = available_balance + NEW.amount,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.to_wallet_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_wallet_balance
    AFTER UPDATE ON wallet_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_wallet_balance();

-- Trigger to log transaction status changes
CREATE OR REPLACE FUNCTION log_transaction_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO wallet_transaction_logs (
            transaction_id,
            previous_status,
            new_status,
            changed_by,
            change_reason
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            NEW.initiated_by, -- This should be updated to actual user making the change
            'Status updated'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_transaction_status
    AFTER UPDATE ON wallet_transactions
    FOR EACH ROW
    EXECUTE FUNCTION log_transaction_status_change();

-- Initial System Wallets (Run after table creation)
-- These will be created via the application, not in migration

COMMENT ON TABLE wallets IS 'Main wallet table storing wallet information for all user types';
COMMENT ON TABLE wallet_transactions IS 'All wallet transactions including transfers, payments, and deposits';
COMMENT ON TABLE wallet_transaction_logs IS 'Audit trail for all transaction status changes';
COMMENT ON TABLE wallet_settings IS 'User-configurable wallet settings';
COMMENT ON TABLE wallet_payment_methods IS 'Payment methods linked to wallets';
COMMENT ON TABLE wallet_notifications IS 'Wallet-related notifications for users';
