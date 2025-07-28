import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Application {
  id: string;
  citizenName: string;
  nationalId: string;
  submissionDate: string;
  applicationType: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
}

const AllApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Mock data loading - would be replaced with actual API call
    setTimeout(() => {
      const mockApplications: Application[] = [
        {
          id: 'APP-001',
          citizenName: 'John Doe',
          nationalId: 'SL123456789',
          submissionDate: '2024-01-15',
          applicationType: 'ID Renewal',
          status: 'pending'
        },
        {
          id: 'APP-002',
          citizenName: 'Jane Smith',
          nationalId: 'SL987654321',
          submissionDate: '2024-01-18',
          applicationType: 'Address Change',
          status: 'processing'
        },
        {
          id: 'APP-003',
          citizenName: 'Mohammed Kamara',
          nationalId: 'SL456789123',
          submissionDate: '2024-01-10',
          applicationType: 'New ID Registration',
          status: 'approved'
        },
        {
          id: 'APP-004',
          citizenName: 'Aminata Sesay',
          nationalId: 'SL789123456',
          submissionDate: '2024-01-05',
          applicationType: 'Information Update',
          status: 'rejected'
        },
      ];
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.nationalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Applications</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all citizen applications in the system
          </p>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Name, Application ID or National ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status-filter"
              name="status-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications list */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              {loading ? (
                <div className="bg-white p-6 text-center">
                  <p className="text-gray-500">Loading applications...</p>
                </div>
              ) : filteredApplications.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Application ID/Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Citizen Information
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Submission Date
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                      <tr key={application.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{application.id}</div>
                          <div className="text-sm text-gray-500">{application.applicationType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{application.citizenName}</div>
                          <div className="text-sm text-gray-500">{application.nationalId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                              application.status
                            )}`}
                          >
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {application.submissionDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="bg-white p-6 text-center">
                  <p className="text-gray-500">No applications found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllApplications;
