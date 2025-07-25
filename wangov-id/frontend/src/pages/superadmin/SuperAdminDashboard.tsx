import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/apiClient';
import { toast } from 'react-hot-toast';
import ProfilePicture from '../../components/common/ProfilePicture';

interface SystemStats {
  totalCitizens: string;
  organizations: string;
  verifications: string;
  systemHealth: string;
}

interface Activity {
  id: number;
  action: string;
  time: string;
  status: 'success' | 'info' | 'warning' | 'error';
}

const SuperAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // In a real app, these would be separate API calls
      // const statsResponse = await apiClient.get('/admin/system/stats');
      // const activitiesResponse = await apiClient.get('/admin/audit');
      
      // Mock data for now
      setTimeout(() => {
        setSystemStats({
          totalCitizens: '2,354,109',
          organizations: '842',
          verifications: '12,865',
          systemHealth: '99.98%'
        });
        setRecentActivities([
          { id: 1, action: 'System update completed', time: '10 minutes ago', status: 'success' },
          { id: 2, action: 'Database backup', time: '1 hour ago', status: 'success' },
          { id: 3, action: 'New organization registered', time: '2 hours ago', status: 'info' },
          { id: 4, action: 'Security audit initiated', time: '5 hours ago', status: 'warning' },
          { id: 5, action: 'API rate limit exceeded', time: '1 day ago', status: 'error' },
        ]);
        // Mock profile picture
        setProfilePicture('/api/placeholder/100/100');
        setIsLoading(false);
      }, 1000);
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Mock stats for demonstration
  const stats = [
    { label: 'Total Citizens', value: systemStats?.totalCitizens || '2,354,109', change: '+3.2%', icon: 'users' },
    { label: 'Organizations', value: systemStats?.organizations || '842', change: '+1.5%', icon: 'building' },
    { label: 'ID Verifications', value: systemStats?.verifications || '12,865', change: '+12.8%', icon: 'shield-check' },
    { label: 'System Health', value: systemStats?.systemHealth || '99.98%', change: '+0.1%', icon: 'server' },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with logout */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
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
              <p className="text-gray-600">Here's an overview of your system activities</p>
              <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${
                stat.icon === 'users' ? 'bg-blue-100 text-blue-600' : 
                stat.icon === 'building' ? 'bg-purple-100 text-purple-600' :
                stat.icon === 'shield-check' ? 'bg-green-100 text-green-600' : 
                'bg-yellow-100 text-yellow-600'
              }`}>
                {/* Simple SVG icons */}
                {stat.icon === 'users' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
                {stat.icon === 'building' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
                {stat.icon === 'shield-check' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
                {stat.icon === 'server' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                )}
              </div>
            </div>
            <p className={`text-sm ${
              stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            } flex items-center mt-2`}>
              {stat.change.startsWith('+') ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {stat.change} from last month
            </p>
          </div>
        ))}
      </div>

      {/* Recent activities section */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent System Activities</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="px-6 py-4">
              <div className="flex items-center">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  activity.status === 'success' ? 'bg-green-100 text-green-600' :
                  activity.status === 'info' ? 'bg-blue-100 text-blue-600' :
                  activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {activity.status === 'success' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {activity.status === 'info' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {activity.status === 'warning' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                  {activity.status === 'error' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="px-6 py-3 bg-gray-50 text-right">
          <button className="text-sm text-green-600 hover:text-green-800 font-medium">View all activities</button>
        </div>
      </div>

      {/* Approval Management */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Approval Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/superadmin/business-approval" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="mt-2 text-sm text-gray-700 font-medium">Business Approvals</span>
            <span className="text-xs text-gray-500">Review business registrations</span>
          </a>
          <a href="/superadmin/api-key-approval" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <span className="mt-2 text-sm text-gray-700 font-medium">API Key Approvals</span>
            <span className="text-xs text-gray-500">Approve live API keys</span>
          </a>
          <a href="/superadmin/provider-management" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="mt-2 text-sm text-gray-700 font-medium">Provider Management</span>
            <span className="text-xs text-gray-500">Manage service providers</span>
          </a>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="mt-2 text-sm text-gray-700">Add Organization</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="mt-2 text-sm text-gray-700">Run Reports</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            <span className="mt-2 text-sm text-gray-700">System Settings</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="mt-2 text-sm text-gray-700">Schedule Maintenance</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
