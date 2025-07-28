import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import WalletDashboard from '../shared/WalletDashboard';

const CitizenWallet: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Authentication Required</h3>
          <p className="text-sm text-gray-500">Please log in to access your wallet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Citizen Wallet</h1>
        <p className="text-gray-600 mt-2">
          Manage your government service payments and view transaction history.
        </p>
      </div>

      <WalletDashboard
        userType="citizen"
        userId={user.id}
        userName={`${user.firstName} ${user.lastName}`}
      />

      {/* Citizen-specific features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Payments</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50">
              <div className="font-medium text-gray-900">Birth Certificate</div>
              <div className="text-sm text-gray-500">$25.00</div>
            </button>
            <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50">
              <div className="font-medium text-gray-900">Passport Application</div>
              <div className="text-sm text-gray-500">$110.00</div>
            </button>
            <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50">
              <div className="font-medium text-gray-900">Driver's License</div>
              <div className="text-sm text-gray-500">$45.00</div>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="font-medium">$85.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Month</span>
              <span className="font-medium">$25.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Year</span>
              <span className="font-medium">$340.00</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add Funds</h3>
          <p className="text-sm text-gray-600 mb-4">
            Add money to your wallet using various payment methods.
          </p>
          <div className="space-y-2">
            <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Bank Transfer
            </button>
            <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Credit/Debit Card
            </button>
            <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Mobile Money
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenWallet;
