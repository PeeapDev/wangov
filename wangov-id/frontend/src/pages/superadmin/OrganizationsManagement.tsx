import React, { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Organization {
  id: string;
  name: string;
  type: 'government' | 'private' | 'ngo' | 'education';
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  verificationStatus: 'verified' | 'unverified' | 'in-progress';
  membersCount: number;
  businessesCount: number;
  createdAt: string;
  updatedAt: string;
}

const OrganizationsManagement: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        setOrganizations([
          {
            id: '1',
            name: 'Ministry of Education',
            type: 'government',
            email: 'info@education.gov.sl',
            phone: '+232-76-123456',
            address: 'New England, Freetown, Sierra Leone',
            registrationNumber: 'GOV-EDU-001',
            status: 'active',
            verificationStatus: 'verified',
            membersCount: 145,
            businessesCount: 3,
            createdAt: '2023-05-10T09:00:00Z',
            updatedAt: '2023-12-15T14:30:00Z'
          },
          {
            id: '2',
            name: 'Sierra Leone Commercial Bank',
            type: 'private',
            email: 'contact@slcb.sl',
            phone: '+232-77-456789',
            address: 'Siaka Stevens Street, Freetown',
            registrationNumber: 'PRI-FIN-042',
            status: 'active',
            verificationStatus: 'verified',
            membersCount: 78,
            businessesCount: 1,
            createdAt: '2023-06-22T10:15:00Z',
            updatedAt: '2023-11-05T16:45:00Z'
          },
          {
            id: '3',
            name: 'Save the Children SL',
            type: 'ngo',
            email: 'office@savechildren.sl',
            phone: '+232-78-789012',
            address: 'Lumley Beach Road, Freetown',
            registrationNumber: 'NGO-HUM-108',
            status: 'active',
            verificationStatus: 'verified',
            membersCount: 34,
            businessesCount: 0,
            createdAt: '2023-07-15T13:20:00Z',
            updatedAt: '2023-10-28T09:10:00Z'
          },
          {
            id: '4',
            name: 'Fourah Bay College',
            type: 'education',
            email: 'admin@fbc.edu.sl',
            phone: '+232-79-345678',
            address: 'Mount Aureol, Freetown',
            registrationNumber: 'EDU-UNI-015',
            status: 'active',
            verificationStatus: 'verified',
            membersCount: 67,
            businessesCount: 2,
            createdAt: '2023-04-03T11:45:00Z',
            updatedAt: '2023-09-19T15:30:00Z'
          },
          {
            id: '5',
            name: 'TechHub Sierra Leone',
            type: 'private',
            email: 'info@techhub.sl',
            phone: '+232-76-234567',
            address: 'Wilkinson Road, Freetown',
            registrationNumber: 'PRI-TECH-087',
            status: 'pending',
            verificationStatus: 'in-progress',
            membersCount: 12,
            businessesCount: 0,
            createdAt: '2024-01-05T08:30:00Z',
            updatedAt: '2024-01-05T08:30:00Z'
          }
        ]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      toast.error('Failed to load organizations');
      setIsLoading(false);
    }
  };

  const handleViewOrg = (org: Organization) => {
    setSelectedOrg(org);
    setShowViewModal(true);
  };

  const handleEditOrg = (org: Organization) => {
    setSelectedOrg(org);
    setShowEditModal(true);
  };

  const handleDeleteOrg = (id: string) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        // Mock API call
        setOrganizations(prev => prev.filter(org => org.id !== id));
        toast.success('Organization deleted successfully');
      } catch (error) {
        console.error('Failed to delete organization:', error);
        toast.error('Failed to delete organization');
      }
    }
  };

  const handleStatusChange = (id: string, status: Organization['status']) => {
    try {
      setOrganizations(prev => 
        prev.map(org => org.id === id ? { ...org, status, updatedAt: new Date().toISOString() } : org)
      );
      toast.success(`Organization status updated to ${status}`);
    } catch (error) {
      console.error('Failed to update organization status:', error);
      toast.error('Failed to update organization status');
    }
  };

  const getStatusBadge = (status: Organization['status']) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'inactive':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'suspended':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getVerificationBadge = (status: Organization['verificationStatus']) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'verified':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'unverified':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'in-progress':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredOrganizations = organizations
    .filter(org => filterStatus === 'all' || org.status === filterStatus)
    .filter(org => org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  org.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()));

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
          <BuildingOfficeIcon className="w-8 h-8 mr-3 text-green-600" />
          Organizations Management
        </h1>
        <p className="text-gray-600 mt-1">Manage and monitor all organizations in the system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BuildingOfficeIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Organizations</p>
              <p className="text-2xl font-bold text-gray-900">{organizations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-gray-900">
                {organizations.filter(org => org.verificationStatus === 'verified').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {organizations.filter(org => org.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-gray-900">
                {organizations.filter(org => org.status === 'suspended').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow border p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-green-500 focus:border-green-500" 
              placeholder="Search by name or registration number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2">
            {[
              { id: 'all', name: 'All' },
              { id: 'active', name: 'Active' },
              { id: 'inactive', name: 'Inactive' },
              { id: 'suspended', name: 'Suspended' },
              { id: 'pending', name: 'Pending' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  filterStatus === tab.id
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Organizations List */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrganizations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    <BuildingOfficeIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p>No organizations found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredOrganizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                          <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{org.name}</div>
                          <div className="text-sm text-gray-500">{org.registrationNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{org.type.charAt(0).toUpperCase() + org.type.slice(1)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{org.email}</div>
                      <div className="text-sm text-gray-500">{org.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="mb-1">
                        <span className={getStatusBadge(org.status)}>
                          {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <span className={getVerificationBadge(org.verificationStatus)}>
                          {org.verificationStatus.charAt(0).toUpperCase() + org.verificationStatus.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {org.membersCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => handleViewOrg(org)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEditOrg(org)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        {org.status !== 'suspended' && (
                          <button
                            onClick={() => handleStatusChange(org.id, 'suspended')}
                            className="text-orange-600 hover:text-orange-900"
                            title="Suspend organization"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        {org.status === 'suspended' && (
                          <button
                            onClick={() => handleStatusChange(org.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                            title="Reactivate organization"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteOrg(org.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination - Simplified */}
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
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrganizations.length}</span> of{' '}
              <span className="font-medium">{filteredOrganizations.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* View Modal would be here - simplified for token limit */}
      {showViewModal && selectedOrg && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md md:max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Organization Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close</span>
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              {/* Details here */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditOrg(selectedOrg);
                  }}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationsManagement;
