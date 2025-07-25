import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const SuperAdminStaffDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock stats for demonstration
  const stats = [
    { label: 'Pending Tasks', value: '24', change: '+3', icon: 'task' },
    { label: 'Organizations', value: '842', change: '+5', icon: 'building' },
    { label: 'Support Tickets', value: '16', change: '-2', icon: 'ticket' },
    { label: 'Recent Logins', value: '128', change: '+12', icon: 'users' },
  ];

  // Mock tasks
  const tasks = [
    { id: 1, title: 'Verify new organization registrations', priority: 'high', dueDate: '2023-05-15' },
    { id: 2, title: 'Review system access requests', priority: 'medium', dueDate: '2023-05-18' },
    { id: 3, title: 'Respond to organization support tickets', priority: 'high', dueDate: '2023-05-14' },
    { id: 4, title: 'Update user documentation', priority: 'low', dueDate: '2023-05-25' },
    { id: 5, title: 'Run monthly user activity report', priority: 'medium', dueDate: '2023-05-31' },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Welcome section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.firstName}!</h1>
        <p className="text-gray-600 mt-1">WanGov-ID System Admin Staff Dashboard</p>
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
                stat.icon === 'task' ? 'bg-indigo-100 text-indigo-600' : 
                stat.icon === 'building' ? 'bg-purple-100 text-purple-600' :
                stat.icon === 'ticket' ? 'bg-red-100 text-red-600' : 
                'bg-blue-100 text-blue-600'
              }`}>
                {/* Simple SVG icons */}
                {stat.icon === 'task' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                )}
                {stat.icon === 'building' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
                {stat.icon === 'ticket' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                )}
                {stat.icon === 'users' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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
              {stat.change} from yesterday
            </p>
          </div>
        ))}
      </div>

      {/* Tasks section */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">My Tasks</h3>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            New Task
          </button>
        </div>
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <li key={task.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id={`task-${task.id}`}
                    name={`task-${task.id}`}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`task-${task.id}`} className="ml-3 block">
                    <span className="text-sm font-medium text-gray-900">{task.title}</span>
                    <span className="text-sm text-gray-500 block">Due: {task.dueDate}</span>
                  </label>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="px-6 py-3 bg-gray-50 text-right">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View all tasks</button>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="mt-2 text-sm text-gray-700">User Management</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="mt-2 text-sm text-gray-700">Generate Reports</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <span className="mt-2 text-sm text-gray-700">Support Tickets</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="mt-2 text-sm text-gray-700">Organizations</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminStaffDashboard;
