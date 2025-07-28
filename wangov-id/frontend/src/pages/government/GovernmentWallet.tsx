import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import WalletDashboard from '../shared/WalletDashboard';
import {
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const GovernmentWallet: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('wallet');

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Authentication Required</h3>
          <p className="text-sm text-gray-500">Please log in to access the Government Agency wallet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Agency Financial Management</h1>
        <p className="text-gray-600 mt-2">
          Manage government agency budget, inter-agency transfers, and staff salary payments.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'wallet', label: 'Wallet Overview', icon: CurrencyDollarIcon },
            { id: 'budget', label: 'Budget Management', icon: ChartBarIcon },
            { id: 'transfers', label: 'Inter-Agency Transfers', icon: ArrowRightIcon },
            { id: 'payroll', label: 'Staff Payroll', icon: UserGroupIcon },
            { id: 'reports', label: 'Financial Reports', icon: DocumentTextIcon }
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
            userType="government_agency"
            userId={user.id}
            userName="Ministry of Health"
          />

          {/* Agency-specific metrics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Monthly Budget</p>
                  <p className="text-2xl font-semibold text-gray-900">$485,750</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Budget Used</p>
                  <p className="text-2xl font-semibold text-gray-900">68%</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Staff Count</p>
                  <p className="text-2xl font-semibold text-gray-900">247</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Payments</p>
                  <p className="text-2xl font-semibold text-gray-900">12</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Management Section */}
      {activeSection === 'budget' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Budget Overview & Allocation</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Budget Breakdown</h4>
                  <div className="space-y-4">
                    {[
                      { category: 'Staff Salaries', allocated: '$300,000', used: '$204,000', percentage: 68 },
                      { category: 'Operations', allocated: '$120,000', used: '$85,600', percentage: 71 },
                      { category: 'Equipment', allocated: '$45,000', used: '$12,300', percentage: 27 },
                      { category: 'Training', allocated: '$15,000', used: '$8,500', percentage: 57 },
                      { category: 'Emergency Fund', allocated: '$5,750', used: '$0', percentage: 0 }
                    ].map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">{item.category}</span>
                          <span className="text-sm text-gray-500">{item.percentage}% used</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.percentage > 80 ? 'bg-red-500' : 
                              item.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Used: {item.used}</span>
                          <span>Allocated: {item.allocated}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Budget Requests</h4>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2">Submit Budget Request</h5>
                      <form className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Category</label>
                          <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option>Select category...</option>
                            <option>Additional Staff</option>
                            <option>Equipment Purchase</option>
                            <option>Emergency Funding</option>
                            <option>Training Programs</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Amount Requested</label>
                          <input
                            type="number"
                            step="0.01"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Justification</label>
                          <textarea
                            rows={3}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Explain the need for additional funding..."
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Submit Request
                        </button>
                      </form>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Recent Requests</h5>
                      <div className="space-y-2">
                        {[
                          { request: 'Emergency Medical Equipment', amount: '$25,000', status: 'Approved', date: '2024-01-10' },
                          { request: 'Staff Training Program', amount: '$8,500', status: 'Pending', date: '2024-01-12' },
                          { request: 'IT Infrastructure Upgrade', amount: '$15,000', status: 'Under Review', date: '2024-01-14' }
                        ].map((req, index) => (
                          <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
                            <div>
                              <div className="font-medium text-gray-900">{req.request}</div>
                              <div className="text-sm text-gray-500">{req.amount} • {req.date}</div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Inter-Agency Fund Transfers</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Initiate Transfer</h4>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">To Agency</label>
                      <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option>Select destination agency...</option>
                        <option>Ministry of Education</option>
                        <option>Ministry of Finance</option>
                        <option>Local Government</option>
                        <option>Ministry of Agriculture</option>
                        <option>Ministry of Transport</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Transfer Amount</label>
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
                        <option>Select purpose...</option>
                        <option>Joint Project Funding</option>
                        <option>Emergency Support</option>
                        <option>Resource Sharing</option>
                        <option>Budget Reallocation</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Provide details about the transfer..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Initiate Transfer
                    </button>
                  </form>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Recent Transfers</h4>
                  <div className="space-y-4">
                    {[
                      { 
                        to: 'Ministry of Education', 
                        amount: '$50,000', 
                        purpose: 'Joint Health Education Program', 
                        status: 'Completed', 
                        date: '2024-01-12',
                        direction: 'outgoing'
                      },
                      { 
                        to: 'Ministry of Finance', 
                        amount: '$25,000', 
                        purpose: 'Budget Surplus Return', 
                        status: 'Pending', 
                        date: '2024-01-14',
                        direction: 'outgoing'
                      },
                      { 
                        to: 'Our Agency', 
                        amount: '$75,000', 
                        purpose: 'Emergency Medical Supplies', 
                        status: 'Completed', 
                        date: '2024-01-10',
                        direction: 'incoming'
                      }
                    ].map((transfer, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium text-gray-900">
                              {transfer.direction === 'outgoing' ? `To: ${transfer.to}` : `From: ${transfer.to.replace('Our Agency', 'Ministry of Finance')}`}
                            </div>
                            <div className="text-sm text-gray-600">{transfer.purpose}</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${transfer.direction === 'outgoing' ? 'text-red-600' : 'text-green-600'}`}>
                              {transfer.direction === 'outgoing' ? '-' : '+'}{transfer.amount}
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              transfer.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {transfer.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{transfer.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staff Payroll Section */}
      {activeSection === 'payroll' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Staff Payroll Management</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-600">Total Staff</div>
                  <div className="text-2xl font-bold text-blue-900">247</div>
                  <div className="text-sm text-blue-600">Active employees</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-green-600">Monthly Payroll</div>
                  <div className="text-2xl font-bold text-green-900">$204,000</div>
                  <div className="text-sm text-green-600">Total salaries</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-yellow-600">Pending Payments</div>
                  <div className="text-2xl font-bold text-yellow-900">12</div>
                  <div className="text-sm text-yellow-600">Awaiting processing</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Payroll Actions</h4>
                  <div className="space-y-4">
                    <button className="w-full py-3 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center">
                      <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                      Process Monthly Payroll
                    </button>
                    <button className="w-full py-3 px-4 border border-green-300 text-green-600 rounded-md hover:bg-green-50 flex items-center justify-center">
                      <UserGroupIcon className="w-5 h-5 mr-2" />
                      Generate Payroll Report
                    </button>
                    <button className="w-full py-3 px-4 border border-purple-300 text-purple-600 rounded-md hover:bg-purple-50 flex items-center justify-center">
                      <DocumentTextIcon className="w-5 h-5 mr-2" />
                      Export Salary Statements
                    </button>
                  </div>

                  <div className="mt-6">
                    <h5 className="font-medium text-gray-900 mb-2">Payroll Schedule</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="text-sm font-medium">Next Payroll Date</span>
                        <span className="text-sm text-gray-600">January 31, 2024</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="text-sm font-medium">Last Processed</span>
                        <span className="text-sm text-gray-600">December 31, 2023</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Recent Salary Payments</h4>
                  <div className="space-y-3">
                    {[
                      { employee: 'Dr. Sarah Johnson', position: 'Chief Medical Officer', amount: '$4,500', status: 'Paid', date: '2024-01-01' },
                      { employee: 'John Smith', position: 'Nurse Supervisor', amount: '$2,800', status: 'Paid', date: '2024-01-01' },
                      { employee: 'Mary Wilson', position: 'Administrative Assistant', amount: '$2,200', status: 'Pending', date: '2024-01-01' },
                      { employee: 'Dr. Michael Brown', position: 'Physician', amount: '$3,800', status: 'Paid', date: '2024-01-01' }
                    ].map((payment, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">{payment.employee}</div>
                            <div className="text-sm text-gray-600">{payment.position}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">{payment.amount}</div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status}
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

      {/* Financial Reports Section */}
      {activeSection === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Agency Financial Reports</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Monthly Budget Report</h4>
                  <p className="text-sm text-gray-600 mb-4">Comprehensive budget utilization and variance analysis</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Payroll Summary</h4>
                  <p className="text-sm text-gray-600 mb-4">Staff salary payments and payroll statistics</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Transfer Activity</h4>
                  <p className="text-sm text-gray-600 mb-4">Inter-agency transfers and fund movements</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Expense Analysis</h4>
                  <p className="text-sm text-gray-600 mb-4">Detailed breakdown of operational expenses</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Quarterly Financial Statement</h4>
                  <p className="text-sm text-gray-600 mb-4">Comprehensive quarterly financial overview</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Audit Trail</h4>
                  <p className="text-sm text-gray-600 mb-4">Complete transaction history and audit logs</p>
                  <button className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                    Generate Report
                  </button>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <CheckCircleIcon className="h-5 w-5 text-blue-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Compliance Status</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>All financial reports are up to date and compliant with government financial regulations. 
                      Next quarterly report due: March 31, 2024.</p>
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

export default GovernmentWallet;
