import React, { useState, useEffect } from 'react';
import { 
  UserPlusIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import PermissionGuard from '../../components/organization/PermissionGuard';

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'staff' | 'manager' | 'admin';
  department: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastActive: string;
  permissions: string[];
}

const StaffManagementContent: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        setStaffMembers([
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@techcorp.sl',
            phone: '+232-76-123456',
            role: 'manager',
            department: 'Development',
            status: 'active',
            joinDate: '2024-01-15',
            lastActive: '2024-01-24T10:30:00Z',
            permissions: ['verify_identity', 'manage_api_keys', 'view_analytics']
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@techcorp.sl',
            phone: '+232-77-987654',
            role: 'staff',
            department: 'Operations',
            status: 'active',
            joinDate: '2024-01-20',
            lastActive: '2024-01-24T09:15:00Z',
            permissions: ['verify_identity', 'view_analytics']
          },
          {
            id: '3',
            firstName: 'Michael',
            lastName: 'Johnson',
            email: 'michael.johnson@techcorp.sl',
            phone: '+232-78-456789',
            role: 'staff',
            department: 'Support',
            status: 'pending',
            joinDate: '2024-01-22',
            lastActive: '2024-01-23T16:45:00Z',
            permissions: ['verify_identity']
          }
        ]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch staff members:', error);
      toast.error('Failed to load staff members');
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'inactive':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getRoleBadge = (role: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (role) {
      case 'admin':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'manager':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'staff':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setShowAddModal(true);
  };

  const handleEditStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowEditModal(true);
  };

  const handleDeleteStaff = (staffId: string) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      setStaffMembers(prev => prev.filter(s => s.id !== staffId));
      toast.success('Staff member removed successfully');
    }
  };

  const filteredStaff = filterStatus === 'all' 
    ? staffMembers 
    : staffMembers.filter(s => s.status === filterStatus);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <UserIcon className="w-8 h-8 mr-3 text-green-600" />
              Staff Management
            </h1>
            <p className="text-gray-600 mt-1">Manage your organization's staff members and their permissions</p>
          </div>
          <button
            onClick={handleAddStaff}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            <UserPlusIcon className="w-5 h-5 mr-2" />
            Add Staff Member
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-2xl font-bold text-gray-900">
                {staffMembers.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {staffMembers.filter(s => s.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Managers</p>
              <p className="text-2xl font-bold text-gray-900">
                {staffMembers.filter(s => s.role === 'manager').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{staffMembers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'all', name: 'All Staff', count: staffMembers.length },
              { id: 'active', name: 'Active', count: staffMembers.filter(s => s.status === 'active').length },
              { id: 'pending', name: 'Pending', count: staffMembers.filter(s => s.status === 'pending').length },
              { id: 'inactive', name: 'Inactive', count: staffMembers.filter(s => s.status === 'inactive').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  filterStatus === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {filteredStaff.length === 0 ? (
          <div className="text-center py-12">
            <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
            <p className="text-gray-600">Get started by adding your first staff member</p>
            <button
              onClick={handleAddStaff}
              className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <UserPlusIcon className="w-5 h-5 mr-2" />
              Add Staff Member
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {staff.firstName} {staff.lastName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <EnvelopeIcon className="w-4 h-4 mr-1" />
                            {staff.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <PhoneIcon className="w-4 h-4 mr-1" />
                            {staff.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className={getRoleBadge(staff.role)}>
                          {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                        </span>
                        <div className="text-sm text-gray-500 mt-1">{staff.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(staff.status)}>
                        {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(staff.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(staff.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditStaff(staff)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staff.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal would go here - simplified for space */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {showAddModal ? 'Add Staff Member' : 'Edit Staff Member'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-600">Staff management form would be implemented here</p>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  toast.success(showAddModal ? 'Staff member added successfully' : 'Staff member updated successfully');
                }}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {showAddModal ? 'Add Staff' : 'Update Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StaffManagement: React.FC = () => {
  return (
    <PermissionGuard permission="staffManagement">
      <StaffManagementContent />
    </PermissionGuard>
  );
};

export default StaffManagement;
