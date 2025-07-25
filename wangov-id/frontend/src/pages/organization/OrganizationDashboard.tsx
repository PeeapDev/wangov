import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/apiClient';
import { toast } from 'react-hot-toast';
import ProfilePicture from '../../components/common/ProfilePicture';

interface DashboardData {
  totalVerifications: string;
  activeMembers: string;
  apiUsage: string;
  organizationName: string;
}

const OrganizationDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const fetchOrganizationData = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      // const response = await apiClient.get('/organization/dashboard');
      
      // Mock data for now
      setTimeout(() => {
        setDashboardData({
          totalVerifications: '3,451',
          activeMembers: '24',
          apiUsage: '92.6%',
          organizationName: 'Central Hospital'
        });
        // Mock profile picture
        setProfilePicture('/api/placeholder/100/100');
        setIsLoading(false);
      }, 600);
    } catch (error) {
      console.error('Failed to fetch organization data:', error);
      toast.error('Failed to load organization data');
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleProfilePictureChange = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      // Mock API call - replace with actual endpoint
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
      
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      toast.error('Failed to update profile picture');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Organization Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {user?.firstName || user?.email} | Role: {user?.role}</p>
            <p className="text-sm text-gray-500 mt-1">Organization: {dashboardData?.organizationName}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={fetchOrganizationData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Organization Stats */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Organization Overview</h3>
              
              <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="px-4 py-5 bg-blue-50 shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium text-blue-500 truncate">Total Verifications</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">3,451</dd>
                  <dd className="mt-1 text-sm text-gray-600">Past 30 days</dd>
                </div>

                <div className="px-4 py-5 bg-blue-50 shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium text-blue-500 truncate">Active Members</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">24</dd>
                  <dd className="mt-1 text-sm text-gray-600">Staff accounts</dd>
                </div>

                <div className="px-4 py-5 bg-blue-50 shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium text-blue-500 truncate">API Usage</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">92.6%</dd>
                  <dd className="mt-1 text-sm text-gray-600">Of monthly quota</dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Recent Verifications */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Verifications</h3>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all
              </a>
            </div>
            <div className="mt-2 flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th 
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Name
                          </th>
                          <th 
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ID Number
                          </th>
                          <th 
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Type
                          </th>
                          <th 
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th 
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          {
                            name: 'Mohamed Koroma',
                            id: 'WG-74852',
                            type: 'Identity Verification',
                            date: '2023-05-10',
                            status: 'Successful'
                          },
                          {
                            name: 'Aminata Sesay',
                            id: 'WG-23985',
                            type: 'Document Verification',
                            date: '2023-05-09',
                            status: 'Successful'
                          },
                          {
                            name: 'Ibrahim Bangura',
                            id: 'WG-39046',
                            type: 'Address Verification',
                            date: '2023-05-09',
                            status: 'Failed'
                          },
                          {
                            name: 'Fatmata Kamara',
                            id: 'WG-62013',
                            type: 'Identity Verification',
                            date: '2023-05-08',
                            status: 'Successful'
                          }
                        ].map((verification, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {verification.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {verification.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {verification.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {verification.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span 
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  verification.status === 'Successful' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {verification.status}
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
          </div>
          
          {/* API Keys */}
          <div className="mt-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">API Keys</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Authentication credentials for your integration
                  </p>
                </div>
                <button 
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Generate New Key
                </button>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Production API Key
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 bg-gray-100 p-2 rounded">
                      <code>wg_api_prod_************</code>
                      <button className="ml-2 text-blue-600 hover:text-blue-500">Show</button>
                      <button className="ml-2 text-blue-600 hover:text-blue-500">Copy</button>
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Sandbox API Key
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 bg-gray-100 p-2 rounded">
                      <code>wg_api_test_************</code>
                      <button className="ml-2 text-blue-600 hover:text-blue-500">Show</button>
                      <button className="ml-2 text-blue-600 hover:text-blue-500">Copy</button>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          
          {/* Developer Resources */}
          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Developer Resources</h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <a href="/organization/business-registration" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Business Registration</h3>
                    <p className="text-sm text-gray-500 mt-1">Register and manage your businesses</p>
                  </div>
                </div>
              </a>
              
              <a href="/organization/developer-sandbox" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">API Keys & Sandbox</h3>
                    <p className="text-sm text-gray-500 mt-1">Manage API keys and test integration</p>
                  </div>
                </div>
              </a>
              
              <a href="/organization/sdk-documentation" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">SDK Documentation</h3>
                    <p className="text-sm text-gray-500 mt-1">Complete integration guides and examples</p>
                  </div>
                </div>
              </a>
              
              <button className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Analytics & Reports</h3>
                    <p className="text-sm text-gray-500 mt-1">View usage statistics and generate reports</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;
