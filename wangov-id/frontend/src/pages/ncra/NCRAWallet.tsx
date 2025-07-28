import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import WalletDashboard from '../shared/WalletDashboard';
import {
  IdentificationIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const NCRAWallet: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('wallet');

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Authentication Required</h3>
          <p className="text-sm text-gray-500">Please log in to access the NCRA wallet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">NCRA Financial Management</h1>
        <p className="text-gray-600 mt-2">
          Manage citizen registration fees, administrative costs, and inter-agency transfers.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'wallet', label: 'Wallet Overview', icon: CurrencyDollarIcon },
            { id: 'fees', label: 'Registration Fees', icon: IdentificationIcon },
            { id: 'citizens', label: 'Citizen Payments', icon: UserGroupIcon },
            { id: 'reports', label: 'Financial Reports', icon: ChartBarIcon }
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

      {/* Wallet Overview Section */}
      {activeSection === 'wallet' && (
        <div>
          <WalletDashboard
            userType="ncra"
            userId={user.id}
            userName="National Civil Registration Authority"
          />

          {/* NCRA-specific metrics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <IdentificationIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Registrations Today</p>
                  <p className="text-2xl font-semibold text-gray-900">47</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Fees Collected Today</p>
                  <p className="text-2xl font-semibold text-gray-900">$1,175</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Citizens</p>
                  <p className="text-2xl font-semibold text-gray-900">12,847</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <DocumentCheckIcon className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Verifications</p>
                  <p className="text-2xl font-semibold text-gray-900">23</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Fees Section */}
      {activeSection === 'fees' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Registration Fee Management</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Current Fee Structure</h4>
                  <div className="space-y-4">
                    {[
                      { service: 'Birth Certificate', fee: '$25.00', processing: '$5.00' },
                      { service: 'Death Certificate', fee: '$25.00', processing: '$5.00' },
                      { service: 'Marriage Certificate', fee: '$35.00', processing: '$7.00' },
                      { service: 'Divorce Certificate', fee: '$35.00', processing: '$7.00' },
                      { service: 'Name Change', fee: '$50.00', processing: '$10.00' },
                      { service: 'Correction/Amendment', fee: '$40.00', processing: '$8.00' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-md">
                        <div>
                          <div className="font-medium text-gray-900">{item.service}</div>
                          <div className="text-sm text-gray-500">Processing: {item.processing}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{item.fee}</div>
                          <button className="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Fee Collection Summary</h4>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-blue-600">Today's Collections</div>
                      <div className="text-2xl font-bold text-blue-900">$1,175.00</div>
                      <div className="text-sm text-blue-600">47 transactions</div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-green-600">This Week</div>
                      <div className="text-2xl font-bold text-green-900">$8,425.00</div>
                      <div className="text-sm text-green-600">337 transactions</div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-purple-600">This Month</div>
                      <div className="text-2xl font-bold text-purple-900">$32,150.00</div>
                      <div className="text-sm text-purple-600">1,286 transactions</div>
                    </div>

                    <div className="border-t pt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Top Services</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Birth Certificates</span>
                          <span className="font-medium">$625.00 (25)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Marriage Certificates</span>
                          <span className="font-medium">$350.00 (10)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Death Certificates</span>
                          <span className="font-medium">$200.00 (8)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Citizen Payments Section */}
      {activeSection === 'citizens' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Citizen Payment Management</h3>
            </div>
            <div className="p-6">
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-green-600">Successful Payments</div>
                  <div className="text-2xl font-bold text-green-900">1,243</div>
                  <div className="text-sm text-green-600">This month</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-yellow-600">Pending Payments</div>
                  <div className="text-2xl font-bold text-yellow-900">17</div>
                  <div className="text-sm text-yellow-600">Awaiting processing</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-red-600">Failed Payments</div>
                  <div className="text-2xl font-bold text-red-900">8</div>
                  <div className="text-sm text-red-600">Require attention</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Citizen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
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
                      { citizen: 'John Doe', nin: '1234567890', service: 'Birth Certificate', amount: '$25.00', date: '2024-01-15', status: 'Completed' },
                      { citizen: 'Jane Smith', nin: '0987654321', service: 'Marriage Certificate', amount: '$35.00', date: '2024-01-15', status: 'Pending' },
                      { citizen: 'Mike Johnson', nin: '1122334455', service: 'Death Certificate', amount: '$25.00', date: '2024-01-14', status: 'Failed' },
                      { citizen: 'Sarah Wilson', nin: '5566778899', service: 'Name Change', amount: '$50.00', date: '2024-01-14', status: 'Completed' }
                    ].map((payment, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.citizen}</div>
                          <div className="text-sm text-gray-500">NIN: {payment.nin}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            payment.status === 'Completed' 
                              ? 'bg-green-100 text-green-800' 
                              : payment.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          {payment.status === 'Failed' && (
                            <button className="text-red-600 hover:text-red-900">Retry</button>
                          )}
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

      {/* Financial Reports Section */}
      {activeSection === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">NCRA Financial Reports</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Daily Revenue Report</h4>
                  <p className="text-sm text-gray-600 mb-4">Daily fee collection and registration statistics</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Service Performance</h4>
                  <p className="text-sm text-gray-600 mb-4">Analysis of service demand and revenue by type</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Monthly Financial Summary</h4>
                  <p className="text-sm text-gray-600 mb-4">Comprehensive monthly revenue and expense report</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Payment Failure Analysis</h4>
                  <p className="text-sm text-gray-600 mb-4">Analysis of failed payments and recovery actions</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Citizen Registration Trends</h4>
                  <p className="text-sm text-gray-600 mb-4">Registration patterns and demographic insights</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Audit & Compliance</h4>
                  <p className="text-sm text-gray-600 mb-4">Financial audit trail and compliance reporting</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>
              </div>

              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Compliance Notice</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Monthly financial reports must be submitted to the Ministry of Finance by the 5th of each month. 
                      Next deadline: February 5th, 2024.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NCRAWallet;
