import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  GlobeAltIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface Region {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  population?: number;
  subRegions?: number;
  createdAt: string;
}

const RegionSettings: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        setRegions([
          {
            id: '1',
            name: 'Western Area',
            code: 'WA',
            isActive: true,
            population: 1500000,
            subRegions: 12,
            createdAt: '2023-10-15T10:30:00Z',
          },
          {
            id: '2',
            name: 'Northern Province',
            code: 'NP',
            isActive: true,
            population: 2200000,
            subRegions: 16,
            createdAt: '2023-10-15T10:30:00Z',
          },
          {
            id: '3',
            name: 'Eastern Province',
            code: 'EP',
            isActive: true,
            population: 1700000,
            subRegions: 14,
            createdAt: '2023-10-15T10:30:00Z',
          },
          {
            id: '4',
            name: 'Southern Province',
            code: 'SP',
            isActive: true,
            population: 1800000,
            subRegions: 15,
            createdAt: '2023-10-15T10:30:00Z',
          },
          {
            id: '5',
            name: 'North West Province',
            code: 'NW',
            isActive: false,
            population: 900000,
            subRegions: 8,
            createdAt: '2024-01-20T14:15:00Z',
          }
        ]);
        setIsLoading(false);
      }, 600);
    } catch (error) {
      console.error('Failed to fetch regions:', error);
      toast.error('Failed to load regions');
      setIsLoading(false);
    }
  };

  const handleAddRegion = () => {
    setShowAddModal(true);
    toast.success('This would open a modal to add a new region');
    // In a real app, this would open a modal
    setShowAddModal(false);
  };

  const handleEditRegion = (region: Region) => {
    setEditingRegion(region);
    toast.success(`Editing region: ${region.name}`);
    // In a real app, this would open a modal
    setEditingRegion(null);
  };

  const handleDeleteRegion = (id: string) => {
    toast.success(`Deleting region with ID: ${id}`);
    // In a real app, this would confirm deletion and call an API
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    toast.success(`Setting region ${id} to ${currentStatus ? 'inactive' : 'active'}`);
    // In a real app, this would call an API to update the status
  };

  // Filter regions based on search term
  const filteredRegions = regions.filter(region =>
    region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    region.code.toLowerCase().includes(searchTerm.toLowerCase())
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
          <GlobeAltIcon className="w-6 h-6 mr-2 text-green-600" />
          Region Settings
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Configure geographical regions for the system
        </p>
      </div>

      {/* Search and Add Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-green-500 focus:border-green-500"
            placeholder="Search regions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleAddRegion}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Region
        </button>
      </div>

      {/* Regions Table */}
      <div className="bg-white border rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Population
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sub-regions
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No regions found matching your search
                  </td>
                </tr>
              ) : (
                filteredRegions.map((region) => (
                  <tr key={region.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {region.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(region.id, region.isActive)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          region.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {region.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.population?.toLocaleString() || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.subRegions || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditRegion(region)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="Edit Region"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRegion(region.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Region"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-region Mapping Section */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sub-region Mapping</h3>
        <div className="bg-white border rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-4">
            This section would allow detailed management of sub-regions within each region,
            including districts, cities, and local administrative areas.
          </p>
          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="text-center">
              <GlobeAltIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-gray-900">Sub-region Management</h3>
              <p className="text-xs text-gray-500 mt-1">
                Select a region above to manage its sub-regions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionSettings;
