import React, { useState, useEffect } from 'react';
import { UserIcon, MagnifyingGlassIcon, EyeIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface Citizen {
  id: string;
  name: string;
  email: string;
  nationalId: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  registeredOn: string;
  dateOfBirth?: string;
  address?: string;
  biometricStatus?: 'completed' | 'incomplete' | 'failed';
}

const NCRACitizensManagement: React.FC = () => {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // For citizens, we only care about active status since all are verified
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Mock data loading - would be replaced with actual API call
    setTimeout(() => {
      // Only include verified citizens in this view
      const mockCitizens: Citizen[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          nationalId: 'SL123456789',
          phone: '+232 76 123 456',
          status: 'active',
          verificationStatus: 'verified',
          registeredOn: '2023-12-15',
          dateOfBirth: '1985-05-12',
          address: '123 Freetown Ave, Freetown',
          biometricStatus: 'completed'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          nationalId: 'SL987654321',
          phone: '+232 77 654 321',
          status: 'active',
          verificationStatus: 'verified',
          registeredOn: '2023-12-20',
          dateOfBirth: '1990-08-25',
          address: '45 Bo Street, Bo',
          biometricStatus: 'completed'
        },
        {
          id: '6',
          name: 'Fatmata Bangura',
          email: 'fatmata.b@example.com',
          nationalId: 'SL543216789',
          phone: '+232 88 234 567',
          status: 'active',
          verificationStatus: 'verified',
          registeredOn: '2023-09-10',
          dateOfBirth: '1989-04-15',
          address: '87 Waterloo Street, Freetown',
          biometricStatus: 'completed'
        },
        {
          id: '7',
          name: 'Samuel Conteh',
          email: 'samuel.c@example.com',
          nationalId: 'SL678912345',
          phone: '+232 76 567 890',
          status: 'active',
          verificationStatus: 'verified',
          registeredOn: '2023-10-05',
          dateOfBirth: '1975-09-28',
          address: '34 Koidu Road, Kono',
          biometricStatus: 'completed'
        },
        {
          id: '8',
          name: 'Mariama Turay',
          email: 'mariama.t@example.com',
          nationalId: 'SL890123456',
          phone: '+232 77 890 123',
          status: 'active',
          verificationStatus: 'verified',
          registeredOn: '2024-01-08',
          dateOfBirth: '1992-12-03',
          address: '12 Pujehun Street, Pujehun',
          biometricStatus: 'completed'
        }
      ];
      setCitizens(mockCitizens);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCitizens = citizens.filter(citizen => {
    const matchesSearch = 
      citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.nationalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || citizen.status === statusFilter;
    
    // All citizens in this view are already verified
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationBadgeClass = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBiometricStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'incomplete': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Citizens Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Verified citizens database for SSO authentication and third-party integrations
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add New Citizen
        </button>
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
                placeholder="Name, Email, ID or Phone"
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Citizens list */}
      <div className="flex flex-col">
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
                      Name / Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      National ID
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
                      Biometrics
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Registered
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-500">
                        Loading citizens...
                      </td>
                    </tr>
                  ) : filteredCitizens.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-500">
                        No citizens found matching your filters
                      </td>
                    </tr>
                  ) : (
                    filteredCitizens.map((citizen) => (
                      <tr key={citizen.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <UserIcon className="h-10 w-10 rounded-full text-gray-400 border border-gray-200 p-1" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{citizen.name}</div>
                              <div className="text-sm text-gray-500">{citizen.email}</div>
                              <div className="text-sm text-gray-500">{citizen.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{citizen.nationalId}</div>
                          <div className="text-xs text-gray-500">
                            {citizen.dateOfBirth && `DOB: ${citizen.dateOfBirth}`}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {citizen.address}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(citizen.status)}`}>
                              {citizen.status.charAt(0).toUpperCase() + citizen.status.slice(1)}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationBadgeClass(citizen.verificationStatus)}`}>
                              {citizen.verificationStatus === 'verified' ? (
                                <>
                                  <CheckCircleIcon className="mr-1 h-3 w-3" />
                                  Verified
                                </>
                              ) : citizen.verificationStatus === 'rejected' ? (
                                <>
                                  <XCircleIcon className="mr-1 h-3 w-3" />
                                  Rejected
                                </>
                              ) : (
                                'Pending Verification'
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBiometricStatusBadgeClass(citizen.biometricStatus)}`}>
                            {citizen.biometricStatus || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {citizen.registeredOn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              title="View Details"
                            >
                              <EyeIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                              title="Edit Citizen"
                            >
                              <PencilIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                            {citizen.verificationStatus !== 'verified' && (
                              <button
                                type="button"
                                className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                title="Verify Citizen"
                              >
                                <CheckCircleIcon className="h-4 w-4" aria-hidden="true" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCitizens.length}</span> of{' '}
              <span className="font-medium">{filteredCitizens.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NCRACitizensManagement;
