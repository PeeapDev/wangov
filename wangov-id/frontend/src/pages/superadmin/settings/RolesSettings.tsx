import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  LockClosedIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: Permission[];
  isSystemRole: boolean;
  createdAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  isGranted: boolean;
}

interface Module {
  name: string;
  permissions: Permission[];
}

const RolesSettings: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const fetchRolesAndPermissions = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockPermissions: Permission[] = [
          { id: 'p1', name: 'View Citizens', description: 'View citizen profiles', module: 'Citizens', isGranted: false },
          { id: 'p2', name: 'Edit Citizens', description: 'Edit citizen information', module: 'Citizens', isGranted: false },
          { id: 'p3', name: 'Delete Citizens', description: 'Delete citizen profiles', module: 'Citizens', isGranted: false },
          { id: 'p4', name: 'View Organizations', description: 'View organization profiles', module: 'Organizations', isGranted: false },
          { id: 'p5', name: 'Edit Organizations', description: 'Edit organization information', module: 'Organizations', isGranted: false },
          { id: 'p6', name: 'Delete Organizations', description: 'Delete organization profiles', module: 'Organizations', isGranted: false },
          { id: 'p7', name: 'View API Keys', description: 'View API keys', module: 'API Management', isGranted: false },
          { id: 'p8', name: 'Create API Keys', description: 'Create new API keys', module: 'API Management', isGranted: false },
          { id: 'p9', name: 'Revoke API Keys', description: 'Revoke active API keys', module: 'API Management', isGranted: false },
          { id: 'p10', name: 'View System Logs', description: 'View system logs', module: 'System', isGranted: false },
          { id: 'p11', name: 'Manage Admins', description: 'Create and manage system admins', module: 'System', isGranted: false },
          { id: 'p12', name: 'Manage Settings', description: 'Modify system settings', module: 'System', isGranted: false },
          { id: 'p13', name: 'Send Communications', description: 'Send emails and notifications', module: 'Communication', isGranted: false },
          { id: 'p14', name: 'View Reports', description: 'View system reports', module: 'Reports', isGranted: false },
          { id: 'p15', name: 'Export Data', description: 'Export system data', module: 'Reports', isGranted: false },
        ];

        // Create modules from permissions
        const moduleNames = Array.from(new Set(mockPermissions.map(p => p.module)));
        const mockModules = moduleNames.map(name => ({
          name,
          permissions: mockPermissions.filter(p => p.module === name)
        }));
        
        // Create roles with permissions
        const mockRoles: Role[] = [
          {
            id: '1',
            name: 'Super Administrator',
            description: 'Complete system access with all permissions',
            userCount: 3,
            permissions: mockPermissions.map(p => ({ ...p, isGranted: true })),
            isSystemRole: true,
            createdAt: '2023-10-15T10:30:00Z',
          },
          {
            id: '2',
            name: 'System Administrator',
            description: 'Manage system settings and users',
            userCount: 8,
            permissions: mockPermissions.map(p => ({ 
              ...p, 
              isGranted: !['Delete Citizens', 'Delete Organizations', 'Manage Settings'].includes(p.name) 
            })),
            isSystemRole: true,
            createdAt: '2023-10-15T10:30:00Z',
          },
          {
            id: '3',
            name: 'Verification Officer',
            description: 'Process citizen and organization verifications',
            userCount: 15,
            permissions: mockPermissions.map(p => ({ 
              ...p, 
              isGranted: ['View Citizens', 'Edit Citizens', 'View Organizations', 'View Reports'].includes(p.name) 
            })),
            isSystemRole: false,
            createdAt: '2023-11-05T09:45:00Z',
          },
          {
            id: '4',
            name: 'Support Agent',
            description: 'Provide customer support and handle basic inquiries',
            userCount: 22,
            permissions: mockPermissions.map(p => ({ 
              ...p, 
              isGranted: ['View Citizens', 'View Organizations', 'View System Logs', 'Send Communications'].includes(p.name) 
            })),
            isSystemRole: false,
            createdAt: '2023-12-10T14:20:00Z',
          },
          {
            id: '5',
            name: 'Read Only',
            description: 'View-only access to system data',
            userCount: 7,
            permissions: mockPermissions.map(p => ({ 
              ...p, 
              isGranted: p.name.startsWith('View') 
            })),
            isSystemRole: false,
            createdAt: '2024-01-20T11:15:00Z',
          }
        ];
        
        setModules(mockModules);
        setRoles(mockRoles);
        setSelectedRole(mockRoles[0]);
        setIsLoading(false);
      }, 600);
    } catch (error) {
      console.error('Failed to fetch roles and permissions:', error);
      toast.error('Failed to load roles and permissions data');
      setIsLoading(false);
    }
  };

  const handleAddRole = () => {
    setShowAddModal(true);
    toast.success('This would open a modal to add a new role');
    // In a real app, this would open a modal
    setShowAddModal(false);
  };

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setEditMode(false);
  };

  const handleEditRole = () => {
    setEditMode(true);
    toast.success('Entered edit mode - make changes to permissions');
  };

  const handleDeleteRole = (id: string) => {
    const role = roles.find(r => r.id === id);
    if (role?.isSystemRole) {
      toast.error('Cannot delete system roles');
      return;
    }
    toast.success(`Deleting role with ID: ${id}`);
    // In a real app, this would confirm deletion and call an API
  };

  const handleSavePermissions = () => {
    toast.success('Permissions updated successfully');
    setEditMode(false);
    // In a real app, this would call an API to save the permissions
  };

  const handleCancelEdit = () => {
    // Reset permissions to original state
    setEditMode(false);
    fetchRolesAndPermissions();
  };

  const handleTogglePermission = (permissionId: string) => {
    if (!editMode || !selectedRole) return;
    
    const updatedRole = {
      ...selectedRole,
      permissions: selectedRole.permissions.map(p => 
        p.id === permissionId ? { ...p, isGranted: !p.isGranted } : p
      )
    };
    
    setSelectedRole(updatedRole);
    
    // Update in the roles list as well
    setRoles(roles.map(r => 
      r.id === selectedRole.id ? updatedRole : r
    ));
  };

  const handleToggleAllModulePermissions = (moduleName: string, grant: boolean) => {
    if (!editMode || !selectedRole) return;
    
    const updatedRole = {
      ...selectedRole,
      permissions: selectedRole.permissions.map(p => 
        p.module === moduleName ? { ...p, isGranted: grant } : p
      )
    };
    
    setSelectedRole(updatedRole);
    
    // Update in the roles list as well
    setRoles(roles.map(r => 
      r.id === selectedRole.id ? updatedRole : r
    ));
  };

  // Filter roles based on search term
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <UserGroupIcon className="w-6 h-6 mr-2 text-green-600" />
          Roles & Permissions
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage system roles and their associated permissions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Roles Panel */}
        <div className="col-span-1">
          <div className="bg-white border rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-900">System Roles</h3>
              <button
                onClick={handleAddRole}
                className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-2">
              <div className="relative mb-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredRoles.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No roles found matching your search
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredRoles.map((role) => (
                      <li
                        key={role.id}
                        className={`cursor-pointer hover:bg-gray-50 ${
                          selectedRole?.id === role.id ? 'bg-green-50' : ''
                        }`}
                        onClick={() => handleSelectRole(role)}
                      >
                        <div className="px-4 py-3">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-gray-900">{role.name}</div>
                            {role.isSystemRole && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                System
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1 truncate">{role.description}</p>
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                            <span>{role.userCount} users</span>
                            {!role.isSystemRole && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteRole(role.id);
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Panel */}
        <div className="col-span-1 md:col-span-2">
          {selectedRole ? (
            <div className="bg-white border rounded-lg shadow overflow-hidden">
              {/* Role Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-medium text-gray-900">{selectedRole.name}</h3>
                  <div className="flex space-x-2">
                    {editMode ? (
                      <>
                        <button
                          onClick={handleSavePermissions}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckIcon className="w-4 h-4 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                        >
                          <XMarkIcon className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleEditRole}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                        disabled={selectedRole.isSystemRole}
                        title={selectedRole.isSystemRole ? "System roles cannot be modified" : "Edit permissions"}
                      >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        {selectedRole.isSystemRole ? "System Role" : "Edit Permissions"}
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{selectedRole.description}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <span className="mr-4">
                    <strong>Users:</strong> {selectedRole.userCount}
                  </span>
                  <span>
                    <strong>Created:</strong> {new Date(selectedRole.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Permissions List */}
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions</h4>
                  {selectedRole.isSystemRole && !editMode && (
                    <div className="flex items-center mb-4 p-2 bg-blue-50 text-blue-800 text-sm rounded-md">
                      <LockClosedIcon className="w-5 h-5 mr-2" />
                      System roles have predefined permissions that cannot be modified
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {modules.map((module) => {
                    const modulePermissions = selectedRole.permissions.filter(
                      p => p.module === module.name
                    );
                    const allGranted = modulePermissions.every(p => p.isGranted);
                    const someGranted = modulePermissions.some(p => p.isGranted);
                    
                    return (
                      <div key={module.name} className="border rounded-md overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 flex items-center justify-between">
                          <h5 className="font-medium text-gray-900">{module.name}</h5>
                          {editMode && !selectedRole.isSystemRole && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleToggleAllModulePermissions(module.name, true)}
                                className="text-xs text-green-600 hover:text-green-900"
                              >
                                Select All
                              </button>
                              <button
                                onClick={() => handleToggleAllModulePermissions(module.name, false)}
                                className="text-xs text-red-600 hover:text-red-900"
                              >
                                Deselect All
                              </button>
                            </div>
                          )}
                          {!editMode && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              allGranted 
                                ? 'bg-green-100 text-green-800' 
                                : someGranted 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {allGranted ? 'Full Access' : someGranted ? 'Partial Access' : 'No Access'}
                            </span>
                          )}
                        </div>
                        <div className="p-4 divide-y divide-gray-200">
                          {modulePermissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="py-2 flex items-center justify-between"
                            >
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {permission.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {permission.description}
                                </div>
                              </div>
                              <div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={permission.isGranted}
                                    onChange={() => handleTogglePermission(permission.id)}
                                    disabled={!editMode || selectedRole.isSystemRole}
                                  />
                                  <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                                    permission.isGranted ? 'peer-checked:bg-green-600' : ''
                                  }`}></div>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-white border rounded-lg shadow p-8">
              <div className="text-center">
                <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Select a Role</h3>
                <p className="text-gray-500">Choose a role from the list to view and edit its permissions</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolesSettings;
