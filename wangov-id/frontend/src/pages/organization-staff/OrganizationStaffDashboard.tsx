import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const OrganizationStaffDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock stats for demonstration
  const stats = [
    { label: 'Pending Verifications', value: '18', icon: 'clipboard-check' },
    { label: 'Citizens Records', value: '1,245', icon: 'users' },
    { label: 'Today\'s Appointments', value: '8', icon: 'calendar' },
    { label: 'Records Updated', value: '34', icon: 'document' },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Welcome section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.firstName}!</h1>
        <p className="text-gray-600 mt-1">Organization Staff Portal</p>
        <p className="text-gray-500 text-sm mt-1">{user?.organizationName}</p>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                {/* Icon would go here */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
            <span className="mt-2 text-sm text-gray-700">Verify Citizen</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
            <span className="mt-2 text-sm text-gray-700">Update Records</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
            <span className="mt-2 text-sm text-gray-700">Create Report</span>
          </button>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6 text-gray-500 text-center">
          No recent activity to display
        </div>
      </div>
    </div>
  );
};

export default OrganizationStaffDashboard;
