import React, { useState, useEffect } from 'react';
import {
  WalletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  BanknotesIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Wallet {
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
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
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
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface WalletDashboardProps {
  userType: 'citizen' | 'organization' | 'ncra' | 'government_agency' | 'super_admin';
  userId: string;
  userName: string;
}

const WalletDashboard: React.FC<WalletDashboardProps> = ({ userType, userId, userName }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showBalance, setShowBalance] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Transfer form state
  const [transferForm, setTransferForm] = useState({
    toWalletNumber: '',
    amount: '',
    description: ''
  });

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    description: '',
    referenceType: 'service_payment',
    recipientName: ''
  });

  useEffect(() => {
    loadWalletData();
  }, [userId, userType]);

  const loadWalletData = async () => {
    try {
      setIsLoading(true);
      
      // Load wallet
      const walletResponse = await fetch(`/api/wallet/owner/${userId}/${userType}`);
      if (walletResponse.ok) {
        const walletData = await walletResponse.json();
        setWallet(walletData.data);
        
        // Load transactions
        const transactionsResponse = await fetch(`/api/wallet/${walletData.data.id}/transactions?limit=20`);
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          setTransactions(transactionsData.data);
        }
      } else if (walletResponse.status === 404) {
        // Create wallet if it doesn't exist
        await createWallet();
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  const createWallet = async () => {
    try {
      const response = await fetch('/api/wallet/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: userId,
          ownerType: userType,
          ownerName: userName,
          currency: 'USD'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setWallet(data.data);
        toast.success('Wallet created successfully!');
      } else {
        throw new Error('Failed to create wallet');
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast.error('Failed to create wallet');
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await loadWalletData();
    setIsRefreshing(false);
    toast.success('Wallet data refreshed');
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet || !transferForm.toWalletNumber || !transferForm.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/wallet/transfer/by-number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromWalletNumber: wallet.walletNumber,
          toWalletNumber: transferForm.toWalletNumber,
          amount: parseFloat(transferForm.amount),
          description: transferForm.description || 'Wallet transfer',
          referenceType: 'internal_transfer'
        }),
      });

      if (response.ok) {
        toast.success('Transfer completed successfully!');
        setTransferForm({ toWalletNumber: '', amount: '', description: '' });
        await loadWalletData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Transfer failed');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error('Transfer failed');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet || !paymentForm.amount || !paymentForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/wallet/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletId: wallet.id,
          amount: parseFloat(paymentForm.amount),
          description: paymentForm.description,
          referenceId: `PAY-${Date.now()}`,
          referenceType: paymentForm.referenceType,
          recipientInfo: paymentForm.recipientName ? {
            name: paymentForm.recipientName,
            type: 'government_service'
          } : undefined
        }),
      });

      if (response.ok) {
        toast.success('Payment processed successfully!');
        setPaymentForm({ amount: '', description: '', referenceType: 'service_payment', recipientName: '' });
        await loadWalletData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed');
    }
  };

  const copyWalletNumber = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.walletNumber);
      toast.success('Wallet number copied to clipboard');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'failed') return <XCircleIcon className="w-5 h-5 text-red-500" />;
    if (status === 'pending') return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    
    switch (type) {
      case 'deposit':
        return <ArrowDownIcon className="w-5 h-5 text-green-500" />;
      case 'withdrawal':
      case 'payment':
        return <ArrowUpIcon className="w-5 h-5 text-red-500" />;
      case 'transfer_in':
        return <ArrowDownIcon className="w-5 h-5 text-blue-500" />;
      case 'transfer_out':
        return <ArrowUpIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      refunded: 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="text-center py-12">
        <WalletIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No wallet found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a wallet.</p>
        <div className="mt-6">
          <button
            onClick={createWallet}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <WalletIcon className="-ml-1 mr-2 h-5 w-5" />
            Create Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Wallet</h1>
            <div className="flex items-center mt-2">
              <span className="text-blue-100 text-sm mr-2">Wallet Number:</span>
              <span className="font-mono text-sm">{wallet.walletNumber}</span>
              <button
                onClick={copyWalletNumber}
                className="ml-2 p-1 hover:bg-blue-500 rounded"
              >
                <DocumentDuplicateIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center">
              <span className="text-blue-100 text-sm mr-2">Balance:</span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 hover:bg-blue-500 rounded mr-2"
              >
                {showBalance ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              </button>
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className="p-1 hover:bg-blue-500 rounded"
              >
                <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="text-3xl font-bold">
              {showBalance ? formatCurrency(wallet.balance) : '••••••'}
            </div>
            <div className="text-blue-100 text-sm">
              Available: {showBalance ? formatCurrency(wallet.availableBalance) : '••••••'}
            </div>
          </div>
        </div>
        
        {!wallet.isVerified && (
          <div className="mt-4 bg-yellow-500 bg-opacity-20 border border-yellow-400 rounded-md p-3">
            <div className="flex">
              <ClockIcon className="h-5 w-5 text-yellow-300" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-100">Wallet Verification Pending</h3>
                <p className="text-xs text-yellow-200 mt-1">Your wallet is pending verification. Some features may be limited.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: WalletIcon },
            { id: 'transfer', label: 'Transfer', icon: ArrowUpIcon },
            { id: 'payment', label: 'Payment', icon: CreditCardIcon },
            { id: 'transactions', label: 'Transactions', icon: BanknotesIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <ArrowDownIcon className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Received</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(transactions.filter(t => t.transactionType === 'deposit' || t.transactionType === 'transfer_in').reduce((sum, t) => sum + t.amount, 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <ArrowUpIcon className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Spent</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(transactions.filter(t => t.transactionType === 'payment' || t.transactionType === 'transfer_out').reduce((sum, t) => sum + t.amount, 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <BanknotesIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Transactions</p>
                  <p className="text-2xl font-semibold text-gray-900">{transactions.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Tab */}
        {activeTab === 'transfer' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Transfer Funds</h3>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">To Wallet Number</label>
                  <input
                    type="text"
                    value={transferForm.toWalletNumber}
                    onChange={(e) => setTransferForm({ ...transferForm, toWalletNumber: e.target.value })}
                    placeholder="WG-XXXX-XXXX-XXXX"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={wallet.availableBalance}
                    value={transferForm.amount}
                    onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Available: {formatCurrency(wallet.availableBalance)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                  <input
                    type="text"
                    value={transferForm.description}
                    onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
                    placeholder="Transfer description"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Transfer Funds
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Make Payment</h3>
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={wallet.availableBalance}
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Available: {formatCurrency(wallet.availableBalance)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                  <select
                    value={paymentForm.referenceType}
                    onChange={(e) => setPaymentForm({ ...paymentForm, referenceType: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="service_payment">Government Service</option>
                    <option value="fee_payment">Fee Payment</option>
                    <option value="fine_payment">Fine Payment</option>
                    <option value="tax_payment">Tax Payment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={paymentForm.description}
                    onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                    placeholder="Payment description"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Recipient (Optional)</label>
                  <input
                    type="text"
                    value={paymentForm.recipientName}
                    onChange={(e) => setPaymentForm({ ...paymentForm, recipientName: e.target.value })}
                    placeholder="Recipient name"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Make Payment
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <div className="p-6 text-center">
                  <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
                  <p className="mt-1 text-sm text-gray-500">You haven't made any transactions yet.</p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getTransactionIcon(transaction.transactionType, transaction.status)}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.description || transaction.transactionType.replace('_', ' ').toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.transactionNumber} • {new Date(transaction.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          transaction.transactionType === 'deposit' || transaction.transactionType === 'transfer_in' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.transactionType === 'deposit' || transaction.transactionType === 'transfer_in' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className="mt-1">
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletDashboard;
