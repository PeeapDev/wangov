import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { getProviderDetails, ProviderDetails } from '../../utils/subdomainHandler';
import { toast } from 'react-hot-toast';

interface ProviderStats {
  totalUsers: number;
  servicesDelivered: number;
  pendingRequests: number;
  systemStatus: 'operational' | 'degraded' | 'maintenance';
  recentActivities: {
    id: string;
    action: string;
    user: string;
    time: string;
    status: 'completed' | 'pending' | 'failed';
  }[];
}

const ProviderDashboard: React.FC = () => {
  const [provider, setProvider] = useState<ProviderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProviderStats>({
    totalUsers: 0,
    servicesDelivered: 0,
    pendingRequests: 0,
    systemStatus: 'operational',
    recentActivities: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get provider details from subdomain
        const providerData = await getProviderDetails();
        setProvider(providerData);
        document.title = `${providerData.name} Dashboard | WanGov ID`;

        // Mock API call to get provider statistics
        // In a real app, this would be an API request to get real data
        setTimeout(() => {
          setStats({
            totalUsers: Math.floor(Math.random() * 5000) + 1000,
            servicesDelivered: Math.floor(Math.random() * 2000) + 500,
            pendingRequests: Math.floor(Math.random() * 100) + 10,
            systemStatus: 'operational',
            recentActivities: [
              {
                id: '1',
                action: 'User Record Updated',
                user: 'John Doe',
                time: '10 minutes ago',
                status: 'completed'
              },
              {
                id: '2',
                action: 'New Service Request',
                user: 'Jane Smith',
                time: '30 minutes ago',
                status: 'pending'
              },
              {
                id: '3',
                action: 'Document Verification',
                user: 'Robert Johnson',
                time: '1 hour ago',
                status: 'completed'
              },
              {
                id: '4',
                action: 'API Integration Failed',
                user: 'System',
                time: '2 hours ago',
                status: 'failed'
              },
              {
                id: '5',
                action: 'Bulk Data Import',
                user: 'Admin User',
                time: '3 hours ago',
                status: 'completed'
              }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching provider dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Failed</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  // Custom styles based on provider branding
  const accentColor = provider?.primaryColor || '#2563eb';
  const headerStyle = { borderColor: accentColor };

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="mb-8 border-l-4 pl-4" style={headerStyle}>
        <h1 className="text-2xl font-bold">Welcome to {provider?.name || 'Provider'} Portal</h1>
        <p className="text-gray-600">Manage your government service delivery efficiently.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <UsersIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Users</h3>
              <p className="text-2xl font-semibold">{stats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Services Delivered */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Services Delivered</h3>
              <p className="text-2xl font-semibold">{stats.servicesDelivered.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <ClockIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Pending Requests</h3>
              <p className="text-2xl font-semibold">{stats.pendingRequests.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${
              stats.systemStatus === 'operational' ? 'bg-green-100 text-green-600' :
              stats.systemStatus === 'degraded' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {stats.systemStatus === 'operational' ? (
                <CheckCircleIcon className="h-6 w-6" />
              ) : (
                <ExclamationCircleIcon className="h-6 w-6" />
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">System Status</h3>
              <p className="text-xl font-semibold capitalize">{stats.systemStatus}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium">Recent Activities</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {stats.recentActivities.map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{activity.action}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{activity.user}</span>
                  <span className="mx-2">•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
              <div>
                {getStatusBadge(activity.status)}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 px-6 py-3">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all activities
          </button>
        </div>
      </div>

      {/* Services Section */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium">Your Services</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <DocumentTextIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Record Management</h3>
                <p className="text-sm text-gray-500">Manage citizen records</p>
              </div>
            </div>
            <div className="border rounded-lg p-4 flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <DocumentTextIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Service Requests</h3>
                <p className="text-sm text-gray-500">Process service applications</p>
              </div>
            </div>
            <div className="border rounded-lg p-4 flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <DocumentTextIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Data Analytics</h3>
                <p className="text-sm text-gray-500">View service statistics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
