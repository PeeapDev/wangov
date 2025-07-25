import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UserIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  totalVerifications: number;
  successfulVerifications: number;
  failedVerifications: number;
  apiCalls: number;
  activeUsers: number;
  verificationTrend: number;
  apiCallsTrend: number;
  monthlyData: {
    month: string;
    verifications: number;
    apiCalls: number;
  }[];
  recentActivity: {
    id: string;
    type: 'verification' | 'api_call' | 'user_registration';
    description: string;
    timestamp: string;
    status: 'success' | 'failed' | 'pending';
  }[];
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        setAnalyticsData({
          totalVerifications: 12450,
          successfulVerifications: 11823,
          failedVerifications: 627,
          apiCalls: 45230,
          activeUsers: 2340,
          verificationTrend: 12.5,
          apiCallsTrend: -3.2,
          monthlyData: [
            { month: 'Jan', verifications: 8500, apiCalls: 32000 },
            { month: 'Feb', verifications: 9200, apiCalls: 35000 },
            { month: 'Mar', verifications: 10100, apiCalls: 38000 },
            { month: 'Apr', verifications: 11000, apiCalls: 41000 },
            { month: 'May', verifications: 11800, apiCalls: 43000 },
            { month: 'Jun', verifications: 12450, apiCalls: 45230 }
          ],
          recentActivity: [
            {
              id: '1',
              type: 'verification',
              description: 'Identity verification completed for John Doe',
              timestamp: '2024-01-24T10:30:00Z',
              status: 'success'
            },
            {
              id: '2',
              type: 'api_call',
              description: 'API call to verify endpoint',
              timestamp: '2024-01-24T10:25:00Z',
              status: 'success'
            },
            {
              id: '3',
              type: 'verification',
              description: 'Identity verification failed for Jane Smith',
              timestamp: '2024-01-24T10:20:00Z',
              status: 'failed'
            },
            {
              id: '4',
              type: 'user_registration',
              description: 'New user registered: Michael Johnson',
              timestamp: '2024-01-24T10:15:00Z',
              status: 'success'
            }
          ]
        });
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
    } else if (trend < 0) {
      return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
          <p className="text-gray-600">Analytics data will appear here once you start using the service</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <ChartBarIcon className="w-8 h-8 mr-3 text-green-600" />
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Monitor your organization's identity verification performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Total Verifications</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalVerifications.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                {getTrendIcon(analyticsData.verificationTrend)}
                <span className={`text-sm ml-1 ${getTrendColor(analyticsData.verificationTrend)}`}>
                  {Math.abs(analyticsData.verificationTrend)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.successfulVerifications.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">
                {((analyticsData.successfulVerifications / analyticsData.totalVerifications) * 100).toFixed(1)}% success rate
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.failedVerifications.toLocaleString()}</p>
              <p className="text-sm text-red-600 mt-1">
                {((analyticsData.failedVerifications / analyticsData.totalVerifications) * 100).toFixed(1)}% failure rate
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <KeyIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">API Calls</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.apiCalls.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                {getTrendIcon(analyticsData.apiCallsTrend)}
                <span className={`text-sm ml-1 ${getTrendColor(analyticsData.apiCallsTrend)}`}>
                  {Math.abs(analyticsData.apiCallsTrend)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <UserIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.activeUsers.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">This month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Verification Trends Chart */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Trends</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-green-500 rounded-t"
                  style={{
                    height: `${(data.verifications / Math.max(...analyticsData.monthlyData.map(d => d.verifications))) * 200}px`
                  }}
                ></div>
                <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                <p className="text-xs font-medium text-gray-900">{data.verifications.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* API Calls Chart */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Usage</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{
                    height: `${(data.apiCalls / Math.max(...analyticsData.monthlyData.map(d => d.apiCalls))) * 200}px`
                  }}
                ></div>
                <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                <p className="text-xs font-medium text-gray-900">{data.apiCalls.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-gray-600" />
            Recent Activity
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {analyticsData.recentActivity.map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(activity.status)}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                activity.status === 'success' 
                  ? 'bg-green-100 text-green-800'
                  : activity.status === 'failed'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {activity.type.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
