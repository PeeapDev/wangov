import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { getProviderFromSubdomain } from '../../utils/subdomainHandler';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  joinedAt: string;
}

const StaffManagement: React.FC = () => {
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get provider details from subdomain
        const providerData = await getProviderFromSubdomain();
        setProvider(providerData);

        // Mock API call to get staff members
        // In a real app, this would be an API request to get real data
        setTimeout(() => {
          const mockStaff: StaffMember[] = [
            {
              id: '1',
              name: 'John Smith',
              email: 'john.smith@' + providerData.id + '.gov.sl',
              role: 'Admin',
              department: 'IT',
              status: 'active',
              joinedAt: '2023-01-15'
            },
            {
              id: '2',
              name: 'Sarah Johnson',
              email: 'sarah.johnson@' + providerData.id + '.gov.sl',
              role: 'Manager',
              department: 'Operations',
              status: 'active',
              joinedAt: '2023-02-21'
            },
            {
              id: '3',
              name: 'Michael Brown',
              email: 'michael.brown@' + providerData.id + '.gov.sl',
              role: 'Clerk',
              department: 'Records',
              status: 'inactive',
              joinedAt: '2023-03-10'
            },
            {
              id: '4',
              name: 'Emily Davis',
              email: 'emily.davis@' + providerData.id + '.gov.sl',
              role: 'Supervisor',
              department: 'Customer Service',
              status: 'active',
              joinedAt: '2023-04-05'
            },
            {
              id: '5',
              name: 'David Wilson',
              email: 'david.wilson@' + providerData.id + '.gov.sl',
              role: 'Clerk',
              department: 'Records',
              status: 'pending',
              joinedAt: '2023-05-12'
            }
          ];
          setStaffMembers(mockStaff);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching provider staff data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddStaff = () => {
    setCurrentStaff(null);
    setShowModal(true);
  };

  const handleEditStaff = (staff: StaffMember) => {
    setCurrentStaff(staff);
    setShowModal(true);
  };

  const handleDeleteStaff = (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      // In a real app, this would make an API call
      setStaffMembers(staffMembers.filter(staff => staff.id !== id));
      toast.success('Staff member deleted successfully');
    }
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call
    setTimeout(() => {
      if (currentStaff) {
        // Update existing staff
        setStaffMembers(staffMembers.map(staff => 
          staff.id === currentStaff.id ? currentStaff : staff
        ));
        toast.success('Staff member updated successfully');
      } else {
        // Add new staff
        const newStaff: StaffMember = {
          id: Date.now().toString(),
          name: 'New Staff Member',
          email: 'new.staff@' + provider.id + '.gov.sl',
          role: 'Clerk',
          department: 'General',
          status: 'pending',
          joinedAt: new Date().toISOString().split('T')[0]
        };
        setStaffMembers([...staffMembers, newStaff]);
        toast.success('Staff member added successfully');
      }
      setShowModal(false);
    }, 500);
  };

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Custom styles based on provider branding
  const accentColor = provider?.primaryColor || '#2563eb';
  const buttonStyle = { backgroundColor: accentColor };
  const headerStyle = { borderColor: accentColor };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 border-l-4 pl-4" style={headerStyle}>
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <p className="text-gray-600">Manage staff members for {provider?.name || 'your provider'}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search staff..."
              className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-4 py-2"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <button
          className="flex items-center px-4 py-2 text-white rounded-md shadow-sm"
          style={buttonStyle}
          onClick={handleAddStaff}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Staff
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
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
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <tr key={staff.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                          <div className="text-sm text-gray-500">{staff.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(staff.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.joinedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => handleEditStaff(staff)}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteStaff(staff.id)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No staff members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSaveStaff}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {currentStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        defaultValue={currentStaff?.name || ''}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        defaultValue={currentStaff?.email || ''}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                          Role
                        </label>
                        <select
                          id="role"
                          name="role"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          defaultValue={currentStaff?.role || 'Clerk'}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Manager">Manager</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Clerk">Clerk</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                          Department
                        </label>
                        <select
                          id="department"
                          name="department"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          defaultValue={currentStaff?.department || 'General'}
                        >
                          <option value="IT">IT</option>
                          <option value="Operations">Operations</option>
                          <option value="Records">Records</option>
                          <option value="Customer Service">Customer Service</option>
                          <option value="General">General</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        defaultValue={currentStaff?.status || 'pending'}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    style={buttonStyle}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
