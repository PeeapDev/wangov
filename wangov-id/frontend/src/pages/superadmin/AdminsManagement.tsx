import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon,
  PlusCircleIcon,
  UserIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  KeyIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'superadmin' | 'superadmin-staff';
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  permissions: string[];
  createdAt: string;
}

const AdminsManagement: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        setAdmins([
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@wangov.sl',
            role: 'superadmin',
            department: 'IT',
            status: 'active',
            lastLogin: '2024-02-10T15:45:00Z',
            permissions: ['all'],
            createdAt: '2023-01-15T10:30:00Z'
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@wangov.sl',
            role: 'admin',
            department: 'Support',
            status: 'active',
            lastLogin: '2024-02-09T09:15:00Z',
            permissions: ['users.view', 'users.edit', 'settings.view'],
            createdAt: '2023-03-22T14:20:00Z'
          },
          {
            id: '3',
            firstName: 'Michael',
            lastName: 'Johnson',
            email: 'michael.j@wangov.sl',
            role: 'superadmin-staff',
            department: 'Operations',
            status: 'active',
            lastLogin: '2024-02-08T11:30:00Z',
            permissions: ['users.view', 'settings.view', 'organizations.view', 'organizations.edit'],
            createdAt: '2023-05-10T08:45:00Z'
          },
          {
            id: '4',
            firstName: 'Sarah',
            lastName: 'Williams',
            email: 'sarah.w@wangov.sl',
            role: 'admin',
            department: 'Compliance',
            status: 'inactive',
            lastLogin: '2024-01-15T16:20:00Z',
            permissions: ['users.view', 'reports.view', 'reports.create'],
            createdAt: '2023-07-05T13:10:00Z'
          },
          {
            id: '5',
            firstName: 'David',
            lastName: 'Brown',
            email: 'david.b@wangov.sl',
            role: 'superadmin-staff',
            department: 'IT',
            status: 'suspended',
            lastLogin: '2023-12-20T10:05:00Z',
            permissions: ['users.view', 'users.edit', 'organizations.view'],
            createdAt: '2023-08-18T09:30:00Z'
          }
        ]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      toast.error('Failed to load admin users');
      setIsLoading(false);
    }
  };

  const handleAddAdmin = () => {
    setShowAddModal(true);
  };

  const handleEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowEditModal(true);
  };

  const handleDeleteAdmin = (id: string) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        // Mock deletion
        setAdmins(prev => prev.filter(admin => admin.id !== id));
        toast.success('Admin deleted successfully');
      } catch (error) {
        console.error('Failed to delete admin:', error);
        toast.error('Failed to delete admin');
      }
    }
  };

  const handleStatusChange = (id: string, status: Admin['status']) => {
    try {
      setAdmins(prev => 
        prev.map(admin => admin.id === id ? { ...admin, status } : admin)
      );
      toast.success(`Admin status updated to ${status}`);
    } catch (error) {
      console.error('Failed to update admin status:', error);
      toast.error('Failed to update admin status');
    }
  };

  const getStatusBadge = (status: Admin['status']) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'inactive':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'suspended':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getRoleBadge = (role: Admin['role']) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (role) {
      case 'superadmin':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'admin':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'superadmin-staff':
        return `${baseClasses} bg-indigo-100 text-indigo-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredAdmins = admins
    .filter(admin => filterRole === 'all' || admin.role === filterRole)
    .filter(admin => 
      admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      admin.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
          <ShieldCheckIcon className="w-8 h-8 mr-3 text-green-600" />
          System Administrators Management
        </h1>
        <p className="text-gray-600 mt-1">Manage system admin users and their permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Super Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {admins.filter(a => a.role === 'superadmin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <KeyIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {admins.filter(a => a.status === 'active').length}
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
                {admins.filter(a => a.status === 'suspended').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
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
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter by Role */}
          <div className="flex space-x-2">
            {[
              { id: 'all', name: 'All Roles' },
              { id: 'superadmin', name: 'Super Admins' },
              { id: 'admin', name: 'Admins' },
              { id: 'superadmin-staff', name: 'Staff' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterRole(tab.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  filterRole === tab.id
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Add New Admin Button */}
          <button
            onClick={handleAddAdmin}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add New Admin
          </button>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    <ShieldCheckIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p>No administrators found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{admin.firstName} {admin.lastName}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <EnvelopeIcon className="h-4 w-4 mr-1" />
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getRoleBadge(admin.role)}>
                        {admin.role === 'superadmin' 
                          ? 'Super Admin' 
                          : admin.role === 'admin' 
                            ? 'Admin' 
                            : 'Admin Staff'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(admin.status)}>
                        {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.lastLogin 
                        ? new Date(admin.lastLogin).toLocaleString() 
                        : 'Never logged in'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => handleEditAdmin(admin)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        {admin.status !== 'suspended' && (
                          <button
                            onClick={() => handleStatusChange(admin.id, 'suspended')}
                            className="text-orange-600 hover:text-orange-900"
                            title="Suspend admin"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        {admin.status === 'suspended' && (
                          <button
                            onClick={() => handleStatusChange(admin.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                            title="Activate admin"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAdmin(admin.id)}
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

      {/* Pagination - simplified */}
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
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAdmins.length}</span> of{' '}
              <span className="font-medium">{filteredAdmins.length}</span> results
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

      {/* Modal would go here but simplified for token limit */}
    </div>
  );
};

export default AdminsManagement;
