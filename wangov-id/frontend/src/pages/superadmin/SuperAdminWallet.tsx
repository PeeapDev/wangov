import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import WalletDashboard from '../shared/WalletDashboard';
import {
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const SuperAdminWallet: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Authentication Required</h3>
          <p className="text-sm text-gray-500">Please log in to access the Super Admin wallet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">System Financial Management</h1>
        <p className="text-gray-600 mt-2">
          Master oversight of all wallets, transactions, and financial operations across the WanGov platform.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'System Overview', icon: ChartBarIcon },
            { id: 'wallets', label: 'Wallet Management', icon: CurrencyDollarIcon },
            { id: 'organizations', label: 'Organization Funds', icon: BuildingOfficeIcon },
            { id: 'monitoring', label: 'Transaction Monitoring', icon: EyeIcon },
            { id: 'settings', label: 'System Settings', icon: CogIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                activeSection === tab.id
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

      {/* System Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total System Balance</p>
                  <p className="text-2xl font-semibold text-gray-900">$2,847,350</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Organizations</p>
                  <p className="text-2xl font-semibold text-gray-900">47</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Citizens</p>
                  <p className="text-2xl font-semibold text-gray-900">125,847</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Daily Transactions</p>
                  <p className="text-2xl font-semibold text-gray-900">1,247</p>
                </div>
              </div>
            </div>
          </div>

          {/* Master Wallet */}
          <WalletDashboard
            userType="super_admin"
            userId={user.id}
            userName="System Administrator"
          />

          {/* System Alerts */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">System Alerts & Notifications</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">High Transaction Volume</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Unusual transaction volume detected in Ministry of Health wallet. Review recommended.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <ShieldCheckIcon className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Security Update</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>All wallet security protocols updated successfully. System is secure.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <ChartBarIcon className="h-5 w-5 text-green-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Monthly Report Ready</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>January financial report has been generated and is ready for review.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Management Section */}
      {activeSection === 'wallets' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">All System Wallets</h3>
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Create Wallet
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wallet Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wallet Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { owner: 'Ministry of Health', type: 'Government Agency', number: 'WG-1001-2024-0001', balance: '$485,750', status: 'Active' },
                    { owner: 'Ministry of Education', type: 'Government Agency', number: 'WG-1002-2024-0001', balance: '$672,300', status: 'Active' },
                    { owner: 'NCRA', type: 'NCRA', number: 'WG-1003-2024-0001', balance: '$125,480', status: 'Active' },
                    { owner: 'TechCorp Ltd', type: 'Organization', number: 'WG-2001-2024-0001', balance: '$45,200', status: 'Active' },
                    { owner: 'John Doe', type: 'Citizen', number: 'WG-3001-2024-0001', balance: '$1,250', status: 'Active' },
                    { owner: 'Jane Smith', type: 'Citizen', number: 'WG-3002-2024-0001', balance: '$850', status: 'Suspended' }
                  ].map((wallet, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {wallet.owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {wallet.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {wallet.number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {wallet.balance}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          wallet.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {wallet.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        <button className="text-yellow-600 hover:text-yellow-900 mr-3">Edit</button>
                        {wallet.status === 'Suspended' && (
                          <button className="text-green-600 hover:text-green-900">Activate</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Organization Funds Section */}
      {activeSection === 'organizations' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Organization Fund Management</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-600">Total Government Funds</div>
                  <div className="text-2xl font-bold text-blue-900">$2,145,750</div>
                  <div className="text-sm text-blue-600">Across all agencies</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-green-600">Organization Funds</div>
                  <div className="text-2xl font-bold text-green-900">$567,200</div>
                  <div className="text-sm text-green-600">Private organizations</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-purple-600">Citizen Wallets</div>
                  <div className="text-2xl font-bold text-purple-900">$134,400</div>
                  <div className="text-sm text-purple-600">Individual citizens</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Fund Allocation Tools</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Budget Transfer</h5>
                    <form className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">From Agency</label>
                        <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                          <option>Select source agency...</option>
                          <option>Ministry of Finance</option>
                          <option>Central Reserve</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">To Agency</label>
                        <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                          <option>Select destination agency...</option>
                          <option>Ministry of Health</option>
                          <option>Ministry of Education</option>
                          <option>Local Government</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Execute Transfer
                      </button>
                    </form>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Emergency Fund Release</h5>
                    <div className="space-y-3">
                      <div className="bg-yellow-50 p-3 rounded-md">
                        <div className="text-sm font-medium text-yellow-800">Emergency Reserve</div>
                        <div className="text-lg font-bold text-yellow-900">$500,000</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Release To</label>
                        <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                          <option>Select agency...</option>
                          <option>Ministry of Health</option>
                          <option>Disaster Management</option>
                          <option>Emergency Services</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          max="500000"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                      >
                        Release Emergency Funds
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Monitoring Section */}
      {activeSection === 'monitoring' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Real-time Transaction Monitoring</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-green-600">Successful Today</div>
                  <div className="text-2xl font-bold text-green-900">1,247</div>
                  <div className="text-sm text-green-600">$847,350</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-yellow-600">Pending</div>
                  <div className="text-2xl font-bold text-yellow-900">23</div>
                  <div className="text-sm text-yellow-600">$12,450</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-red-600">Failed</div>
                  <div className="text-2xl font-bold text-red-900">8</div>
                  <div className="text-sm text-red-600">$3,200</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-600">Average Amount</div>
                  <div className="text-2xl font-bold text-blue-900">$679</div>
                  <div className="text-sm text-blue-600">Per transaction</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { id: 'TXN-20240115-00001247', from: 'John Doe', to: 'NCRA', amount: '$25.00', type: 'Payment', status: 'Completed', time: '2 min ago' },
                      { id: 'TXN-20240115-00001246', from: 'Ministry of Finance', to: 'Ministry of Health', amount: '$50,000.00', type: 'Transfer', status: 'Completed', time: '5 min ago' },
                      { id: 'TXN-20240115-00001245', from: 'Jane Smith', to: 'NCRA', amount: '$35.00', type: 'Payment', status: 'Pending', time: '8 min ago' },
                      { id: 'TXN-20240115-00001244', from: 'TechCorp Ltd', to: 'Local Government', amount: '$2,500.00', type: 'Transfer', status: 'Failed', time: '12 min ago' }
                    ].map((transaction, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {transaction.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.from}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.to}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            transaction.status === 'Completed' 
                              ? 'bg-green-100 text-green-800' 
                              : transaction.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Settings Section */}
      {activeSection === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Wallet System Configuration</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Transaction Limits</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Daily Transfer Limit (Citizens)</label>
                      <input
                        type="number"
                        defaultValue="5000"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Daily Transfer Limit (Organizations)</label>
                      <input
                        type="number"
                        defaultValue="100000"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Inter-Agency Transfer Limit</label>
                      <input
                        type="number"
                        defaultValue="1000000"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Security Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Require approval for large transfers</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Enable transaction notifications</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Auto-suspend suspicious accounts</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Large Transfer Threshold</label>
                      <input
                        type="number"
                        defaultValue="50000"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Reset to Defaults
                  </button>
                  <button className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminWallet;
