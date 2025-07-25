import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// For a real application, we would use a proper chart library like Chart.js, recharts, etc.
// This is a simplified implementation for demonstration purposes
const LineChart = () => (
  <div className="relative h-64 w-full">
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="text-gray-400 text-center">
        Chart visualization would be rendered here<br />
        (Using Chart.js, recharts, or similar library)
      </p>
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 opacity-20 rounded-lg"></div>
  </div>
);

const BarChart = () => (
  <div className="relative h-64 w-full">
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="text-gray-400 text-center">
        Bar chart visualization would be rendered here<br />
        (Using Chart.js, recharts, or similar library)
      </p>
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-yellow-50 to-orange-50 opacity-20 rounded-lg"></div>
  </div>
);

const DoughnutChart = () => (
  <div className="relative h-64 w-full">
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="text-gray-400 text-center">
        Doughnut chart visualization would be rendered here<br />
        (Using Chart.js, recharts, or similar library)
      </p>
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-indigo-50 opacity-20 rounded-lg"></div>
  </div>
);

interface Activity {
  id: string;
  type: string;
  entity: string;
  action: string;
  user: string;
  timestamp: string;
}

interface MetricData {
  label: string;
  value: number;
  previousValue: number;
  percentChange: number;
  icon: React.ReactNode;
}

interface SystemHealth {
  id: string;
  component: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  latency: number;
  uptime: number;
  lastIssue: string | null;
}

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);

    try {
      // Mock data - replace with actual API calls
      setTimeout(() => {
        // Main metrics
        setMetrics([
          {
            label: 'Total Users',
            value: 25847,
            previousValue: 24235,
            percentChange: 6.65,
            icon: <UserGroupIcon className="h-6 w-6 text-blue-600" />
          },
          {
            label: 'Organizations',
            value: 312,
            previousValue: 298,
            percentChange: 4.70,
            icon: <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
          },
          {
            label: 'Verifications',
            value: 18435,
            previousValue: 15680,
            percentChange: 17.57,
            icon: <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
          },
          {
            label: 'API Requests',
            value: 842156,
            previousValue: 795432,
            percentChange: 5.87,
            icon: <BoltIcon className="h-6 w-6 text-orange-600" />
          }
        ]);
        
        // Recent activities
        setActivities([
          {
            id: '1',
            type: 'user',
            entity: 'Citizen Registration',
            action: 'New citizen registered',
            user: 'Self-Service',
            timestamp: '2024-02-10T15:45:30Z',
          },
          {
            id: '2',
            type: 'organization',
            entity: 'Business Approval',
            action: 'Business registration approved',
            user: 'John Admin',
            timestamp: '2024-02-10T14:30:15Z',
          },
          {
            id: '3',
            type: 'api',
            entity: 'API Key',
            action: 'New API key generated',
            user: 'Sarah Williams',
            timestamp: '2024-02-10T13:20:45Z',
          },
          {
            id: '4',
            type: 'verification',
            entity: 'ID Verification',
            action: 'Identity verified successfully',
            user: 'Verification Service',
            timestamp: '2024-02-10T12:15:10Z',
          },
          {
            id: '5',
            type: 'system',
            entity: 'System Update',
            action: 'System updated to v2.3.5',
            user: 'System',
            timestamp: '2024-02-10T10:05:30Z',
          }
        ]);

        // System health
        setSystemHealth([
          {
            id: '1',
            component: 'Identity API',
            status: 'healthy',
            latency: 120,
            uptime: 99.98,
            lastIssue: null
          },
          {
            id: '2',
            component: 'Authentication Service',
            status: 'healthy',
            latency: 95,
            uptime: 99.99,
            lastIssue: '2024-01-15T08:30:00Z'
          },
          {
            id: '3',
            component: 'Document Storage',
            status: 'warning',
            latency: 350,
            uptime: 99.85,
            lastIssue: '2024-02-08T16:45:00Z'
          },
          {
            id: '4',
            component: 'Verification Service',
            status: 'healthy',
            latency: 180,
            uptime: 99.95,
            lastIssue: '2024-01-22T11:20:00Z'
          },
          {
            id: '5',
            component: 'Payment Gateway',
            status: 'critical',
            latency: 720,
            uptime: 98.75,
            lastIssue: '2024-02-10T09:15:00Z'
          }
        ]);

        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      toast.error('Failed to load analytics data');
      setIsLoading(false);
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'healthy':
        return <span className="h-3 w-3 bg-green-500 rounded-full inline-block mr-2"></span>;
      case 'warning':
        return <span className="h-3 w-3 bg-yellow-500 rounded-full inline-block mr-2"></span>;
      case 'critical':
        return <span className="h-3 w-3 bg-red-500 rounded-full inline-block mr-2"></span>;
      case 'offline':
        return <span className="h-3 w-3 bg-gray-500 rounded-full inline-block mr-2"></span>;
      default:
        return <span className="h-3 w-3 bg-gray-300 rounded-full inline-block mr-2"></span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <ChartBarIcon className="w-8 h-8 mr-3 text-green-600" />
          System Analytics
        </h1>
        <p className="text-gray-600 mt-1">Key performance metrics and system analytics</p>
      </div>

      {/* Date Range Selector */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Time Period:</span>
            </div>
            <div className="flex space-x-2">
              {['24h', '7d', '30d', '90d', 'YTD', 'ALL'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    dateRange === range
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow border p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                {metric.icon}
              </div>
              <div className={`flex items-center ${
                metric.percentChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="text-sm font-medium">
                  {metric.percentChange >= 0 ? '+' : ''}{metric.percentChange.toFixed(1)}%
                </span>
                {metric.percentChange >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 ml-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 ml-1" />
                )}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{metric.value.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Charts - Grid layout for different chart types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Registrations</h3>
          <LineChart />
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Usage</h3>
          <LineChart />
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Distribution</h3>
          <DoughnutChart />
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizations by Type</h3>
          <BarChart />
        </div>
      </div>

      {/* System Health & Recent Activity - Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Health */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {systemHealth.map((component) => (
              <div key={component.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getStatusDot(component.status)}
                    <span className="font-medium text-gray-900">{component.component}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    component.status === 'healthy' ? 'bg-green-100 text-green-800' :
                    component.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    component.status === 'critical' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="text-gray-500">Latency:</span> {component.latency}ms
                  </div>
                  <div>
                    <span className="text-gray-500">Uptime:</span> {component.uptime}%
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Last Issue:</span> {component.lastIssue 
                      ? new Date(component.lastIssue).toLocaleString() 
                      : 'No recent issues'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start mb-2">
                  <div className="flex-shrink-0 mr-3">
                    {activity.type === 'user' && <UserGroupIcon className="h-5 w-5 text-blue-500" />}
                    {activity.type === 'organization' && <BuildingOfficeIcon className="h-5 w-5 text-green-500" />}
                    {activity.type === 'api' && <BoltIcon className="h-5 w-5 text-orange-500" />}
                    {activity.type === 'verification' && <ShieldCheckIcon className="h-5 w-5 text-purple-500" />}
                    {activity.type === 'system' && <DocumentTextIcon className="h-5 w-5 text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.entity}</p>
                  </div>
                  <div className="ml-3 flex-shrink-0 text-right">
                    <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleTimeString()}</p>
                    <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">By:</span> {activity.user}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button className="text-sm text-green-600 hover:text-green-800 font-medium">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
