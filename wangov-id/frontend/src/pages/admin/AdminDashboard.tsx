import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/apiClient';
import { toast } from 'react-hot-toast';
import ProfilePicture from '../../components/common/ProfilePicture';

interface DashboardData {
  totalCitizens: string;
  organizations: string;
  apiRequests: string;
  systemHealth: string;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      // const response = await apiClient.get('/admin/dashboard');
      
      // Mock data for now
      setTimeout(() => {
        setDashboardData({
          totalCitizens: '2,584,932',
          organizations: '178',
          apiRequests: '3.2M',
          systemHealth: '99.8%'
        });
        // Mock profile picture
        setProfilePicture('/api/placeholder/100/100');
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <ProfilePicture
              src={profilePicture}
              alt={`${user?.firstName || ''} ${user?.lastName || ''}`}
              size="xl"
              editable={true}
              onImageChange={handleProfilePictureChange}
              className="flex-shrink-0"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.firstName}!</h1>
              <p className="text-gray-600">Here's an overview of your admin activities</p>
              <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          {/* System Stats */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">System Overview</h3>
              
              <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
                <div className="px-4 py-5 bg-purple-50 shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium text-purple-500 truncate">Total Citizens</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">2,584,932</dd>
                  <dd className="mt-1 text-sm text-gray-600">
                    <span className="text-green-600">+2.3%</span> this month
                  </dd>
                </div>

                <div className="px-4 py-5 bg-purple-50 shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium text-purple-500 truncate">Organizations</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">178</dd>
                  <dd className="mt-1 text-sm text-gray-600">
                    <span className="text-green-600">+5</span> this month
                  </dd>
                </div>

                <div className="px-4 py-5 bg-purple-50 shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium text-purple-500 truncate">API Requests</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">3.2M</dd>
                  <dd className="mt-1 text-sm text-gray-600">Past 24 hours</dd>
                </div>

                <div className="px-4 py-5 bg-purple-50 shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium text-purple-500 truncate">System Health</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">99.8%</dd>
                  <dd className="mt-1 text-sm text-gray-600">Uptime this month</dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* System Alerts */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">System Alerts</h3>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                3 Active
              </span>
            </div>
            <div className="mt-2 overflow-hidden shadow sm:rounded-md">
              <ul className="divide-y divide-gray-200 bg-white">
                <li>
                  <div className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-purple-600 truncate">
                          Database CPU Usage Above 70%
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Warning
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Database cluster primary node showing high load for past 30 minutes
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            30 minutes ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-purple-600 truncate">
                          SSL Certificate Expiring Soon
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Warning
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            API subdomain certificate expires in 14 days
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            2 hours ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-purple-600 truncate">
                          Failed Login Attempts Above Threshold
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Critical
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Multiple failed login attempts detected from IP range 192.168.1.x
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            5 minutes ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Recent System Activity */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent System Activity</h3>
              <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-500">
                View all logs
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
                            Action
                          </th>
                          <th 
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            User
                          </th>
                          <th 
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Target
                          </th>
                          <th 
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Timestamp
                          </th>
                          <th 
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            IP Address
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          {
                            action: 'Organization Created',
                            user: 'admin@wangov-id.gov.sl',
                            target: 'Ministry of Health',
                            timestamp: '2023-05-10 14:23:15',
                            ip: '41.223.45.67'
                          },
                          {
                            action: 'API Rate Limit Changed',
                            user: 'admin@wangov-id.gov.sl',
                            target: 'Global System Setting',
                            timestamp: '2023-05-10 11:05:22',
                            ip: '41.223.45.67'
                          },
                          {
                            action: 'User Role Changed',
                            user: 'admin@wangov-id.gov.sl',
                            target: 'james.koroma@moh.gov.sl',
                            timestamp: '2023-05-09 16:42:01',
                            ip: '41.223.45.67'
                          },
                          {
                            action: 'System Backup Completed',
                            user: 'system',
                            target: 'Database Cluster',
                            timestamp: '2023-05-09 01:00:00',
                            ip: 'internal'
                          },
                          {
                            action: 'Security Policy Updated',
                            user: 'admin@wangov-id.gov.sl',
                            target: 'Password Policy',
                            timestamp: '2023-05-08 09:17:55',
                            ip: '41.223.45.67'
                          }
                        ].map((log, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {log.action}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {log.user}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {log.target}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {log.timestamp}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {log.ip}
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
          
          {/* Admin Actions */}
          <div className="mt-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Administrative Actions</h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'Add Organization', description: 'Register a new organization in the system' },
                { name: 'System Settings', description: 'Configure global system parameters' },
                { name: 'User Management', description: 'Manage user accounts and roles' },
                { name: 'Security Audit', description: 'Review system security logs and events' }
              ].map((action) => (
                <div key={action.name} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">{action.name}</h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                      <p>{action.description}</p>
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        Proceed
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
