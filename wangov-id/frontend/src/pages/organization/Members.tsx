import React from 'react';
import { UserGroupIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const Members: React.FC = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <UserGroupIcon className="w-8 h-8 mr-3 text-green-600" />
          Organization Members
        </h1>
        <p className="text-gray-600 mt-1">Manage organization members and their access levels</p>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-lg shadow border">
        <div className="text-center py-12">
          <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Members Management</h3>
          <p className="text-gray-600 mb-6">
            This page will allow you to manage organization members, their roles, and permissions.
          </p>
          <div className="space-y-2 text-sm text-gray-600 max-w-md mx-auto">
            <p>• View all organization members</p>
            <p>• Manage member roles and permissions</p>
            <p>• Send invitations to new members</p>
            <p>• Track member activity and status</p>
          </div>
          <button className="mt-6 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <UserPlusIcon className="w-5 h-5 mr-2" />
            Add Member (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Members;
