import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import WalletDashboard from '../shared/WalletDashboard';
import {
  BuildingOfficeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const OrganizationWallet: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('wallet');

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Authentication Required</h3>
          <p className="text-sm text-gray-500">Please log in to access your organization wallet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Organization Wallet</h1>
        <p className="text-gray-600 mt-2">
          Manage your organization's finances, transfers, and staff payments.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'wallet', label: 'Wallet Overview', icon: CurrencyDollarIcon },
            { id: 'transfers', label: 'Inter-Agency Transfers', icon: BuildingOfficeIcon },
            { id: 'staff', label: 'Staff Payments', icon: UsersIcon },
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
            userType="organization"
            userId={user.organizationId || user.id}
            userName={user.organizationName || `${user.firstName} ${user.lastName}`}
          />

          {/* Organization-specific features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Budget Allocation</p>
                  <p className="text-2xl font-semibold text-gray-900">$50,000</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <UsersIcon className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Staff Count</p>
                  <p className="text-2xl font-semibold text-gray-900">24</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Monthly Payroll</p>
                  <p className="text-2xl font-semibold text-gray-900">$12,500</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">This Month</p>
                  <p className="text-2xl font-semibold text-gray-900">$8,750</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inter-Agency Transfers Section */}
      {activeSection === 'transfers' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Inter-Agency Transfers</h3>
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                New Transfer
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Quick Transfer</h4>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">To Organization</label>
                      <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option>Select organization...</option>
                        <option>Ministry of Health</option>
                        <option>Ministry of Education</option>
                        <option>Ministry of Finance</option>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Purpose</label>
                      <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option>Budget Transfer</option>
                        <option>Project Funding</option>
                        <option>Emergency Fund</option>
                        <option>Operational Costs</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Transfer description..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Initiate Transfer
                    </button>
                  </form>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Recent Transfers</h4>
                  <div className="space-y-3">
                    {[
                      { to: 'Ministry of Health', amount: '$5,000', status: 'Completed', date: '2024-01-15' },
                      { to: 'Local Government', amount: '$2,500', status: 'Pending', date: '2024-01-14' },
                      { to: 'Ministry of Education', amount: '$7,500', status: 'Completed', date: '2024-01-12' }
                    ].map((transfer, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">{transfer.to}</div>
                            <div className="text-sm text-gray-500">{transfer.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">{transfer.amount}</div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              transfer.status === 'Completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {transfer.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staff Payments Section */}
      {activeSection === 'staff' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Staff Payments & Salaries</h3>
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5" />
                  Payroll Report
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  Process Payroll
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-600">Next Payroll Date</div>
                  <div className="text-2xl font-bold text-blue-900">Jan 31, 2024</div>
                  <div className="text-sm text-blue-600">5 days remaining</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-green-600">Total Payroll Amount</div>
                  <div className="text-2xl font-bold text-green-900">$12,500</div>
                  <div className="text-sm text-green-600">24 employees</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-yellow-600">Pending Approvals</div>
                  <div className="text-2xl font-bold text-yellow-900">3</div>
                  <div className="text-sm text-yellow-600">Overtime requests</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Base Salary
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Overtime
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { name: 'John Doe', position: 'Senior Developer', base: '$3,500', overtime: '$200', total: '$3,700', status: 'Ready' },
                      { name: 'Jane Smith', position: 'Project Manager', base: '$4,000', overtime: '$0', total: '$4,000', status: 'Ready' },
                      { name: 'Mike Johnson', position: 'Analyst', base: '$2,800', overtime: '$150', total: '$2,950', status: 'Pending' },
                      { name: 'Sarah Wilson', position: 'Designer', base: '$3,200', overtime: '$100', total: '$3,300', status: 'Ready' }
                    ].map((employee, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.base}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.overtime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            employee.status === 'Ready' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {employee.status}
                          </span>
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
              <h3 className="text-lg font-medium text-gray-900">Financial Reports & Analytics</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Monthly Spending Report</h4>
                  <p className="text-sm text-gray-600 mb-4">Detailed breakdown of monthly expenses</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Payroll Summary</h4>
                  <p className="text-sm text-gray-600 mb-4">Staff payment history and analytics</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Transfer History</h4>
                  <p className="text-sm text-gray-600 mb-4">Inter-agency transfer records</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Budget Utilization</h4>
                  <p className="text-sm text-gray-600 mb-4">Budget allocation vs actual spending</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Annual Financial Summary</h4>
                  <p className="text-sm text-gray-600 mb-4">Comprehensive yearly financial overview</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Audit Trail</h4>
                  <p className="text-sm text-gray-600 mb-4">Complete transaction audit log</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
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

export default OrganizationWallet;
