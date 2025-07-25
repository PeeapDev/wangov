import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { getProviderFromSubdomain } from '../../utils/subdomainHandler';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'maintenance';
  usageCount: number;
  lastUpdated: string;
}

const ServicesManagement: React.FC = () => {
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get provider details from subdomain
        const providerData = await getProviderFromSubdomain();
        setProvider(providerData);

        // Mock API call to get services
        // In a real app, this would be an API request to get real data
        setTimeout(() => {
          let mockServices: Service[] = [];
          
          // Create mock services based on provider type
          if (providerData.type === 'electricity') {
            mockServices = [
              {
                id: '1',
                name: 'New Connection Application',
                description: 'Apply for a new electricity connection for residential or commercial properties',
                category: 'Application',
                status: 'active',
                usageCount: 1245,
                lastUpdated: '2023-05-15'
              },
              {
                id: '2',
                name: 'Bill Payment',
                description: 'Pay your electricity bill online',
                category: 'Payment',
                status: 'active',
                usageCount: 8765,
                lastUpdated: '2023-06-21'
              },
              {
                id: '3',
                name: 'Meter Reading Submission',
                description: 'Submit your meter reading for accurate billing',
                category: 'Data Submission',
                status: 'active',
                usageCount: 4532,
                lastUpdated: '2023-06-10'
              },
              {
                id: '4',
                name: 'Power Outage Reporting',
                description: 'Report power outages in your area',
                category: 'Reporting',
                status: 'active',
                usageCount: 987,
                lastUpdated: '2023-07-01'
              },
              {
                id: '5',
                name: 'Commercial Rate Application',
                description: 'Apply for commercial electricity rates for businesses',
                category: 'Application',
                status: 'maintenance',
                usageCount: 345,
                lastUpdated: '2023-04-12'
              }
            ];
          } else if (providerData.type === 'health') {
            mockServices = [
              {
                id: '1',
                name: 'Vaccination Appointment',
                description: 'Schedule a vaccination appointment at a health facility',
                category: 'Appointment',
                status: 'active',
                usageCount: 5678,
                lastUpdated: '2023-06-15'
              },
              {
                id: '2',
                name: 'Health Facility Finder',
                description: 'Find the nearest health facility to your location',
                category: 'Information',
                status: 'active',
                usageCount: 7890,
                lastUpdated: '2023-07-02'
              },
              {
                id: '3',
                name: 'Medical Records Request',
                description: 'Request access to your medical records',
                category: 'Data Request',
                status: 'active',
                usageCount: 2345,
                lastUpdated: '2023-06-20'
              },
              {
                id: '4',
                name: 'Health Insurance Verification',
                description: 'Verify your health insurance status and coverage',
                category: 'Verification',
                status: 'inactive',
                usageCount: 1234,
                lastUpdated: '2023-05-10'
              },
              {
                id: '5',
                name: 'Healthcare Provider Registration',
                description: 'Register as a healthcare provider in the system',
                category: 'Registration',
                status: 'active',
                usageCount: 456,
                lastUpdated: '2023-04-25'
              }
            ];
          } else {
            // Generic services for any other provider type
            mockServices = [
              {
                id: '1',
                name: 'User Registration',
                description: 'Register for online services',
                category: 'Registration',
                status: 'active',
                usageCount: 3456,
                lastUpdated: '2023-05-20'
              },
              {
                id: '2',
                name: 'Service Application',
                description: 'Apply for government services',
                category: 'Application',
                status: 'active',
                usageCount: 2345,
                lastUpdated: '2023-06-15'
              },
              {
                id: '3',
                name: 'Document Verification',
                description: 'Verify the authenticity of official documents',
                category: 'Verification',
                status: 'maintenance',
                usageCount: 1234,
                lastUpdated: '2023-07-01'
              },
              {
                id: '4',
                name: 'Complaint Submission',
                description: 'Submit complaints about services',
                category: 'Feedback',
                status: 'active',
                usageCount: 678,
                lastUpdated: '2023-06-30'
              },
              {
                id: '5',
                name: 'Payment Gateway',
                description: 'Make payments for services',
                category: 'Payment',
                status: 'active',
                usageCount: 4567,
                lastUpdated: '2023-07-05'
              }
            ];
          }
          
          setServices(mockServices);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching provider services data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddService = () => {
    setCurrentService(null);
    setShowModal(true);
  };

  const handleEditService = (service: Service) => {
    setCurrentService(service);
    setShowModal(true);
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service? This may affect users who are currently using this service.')) {
      // In a real app, this would make an API call
      setServices(services.filter(service => service.id !== id));
      toast.success('Service deleted successfully');
    }
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call
    setTimeout(() => {
      if (currentService) {
        // Update existing service
        setServices(services.map(service => 
          service.id === currentService.id ? currentService : service
        ));
        toast.success('Service updated successfully');
      } else {
        // Add new service
        const newService: Service = {
          id: Date.now().toString(),
          name: 'New Service',
          description: 'Description of the new service',
          category: 'Other',
          status: 'inactive',
          usageCount: 0,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        setServices([...services, newService]);
        toast.success('Service added successfully');
      }
      setShowModal(false);
    }, 500);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setServices(services.map(service => 
      service.id === id ? { ...service, status: newStatus as any } : service
    ));
    toast.success(`Service ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>;
      case 'maintenance':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Maintenance</span>;
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
        <h1 className="text-2xl font-bold">Services Management</h1>
        <p className="text-gray-600">Manage available services for {provider?.name || 'your provider'}</p>
      </div>

      {/* Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <DocumentTextIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Services</p>
              <p className="text-2xl font-semibold">{services.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Usage</p>
              <p className="text-2xl font-semibold">{services.reduce((sum, service) => sum + service.usageCount, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <ArrowsRightLeftIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Services</p>
              <p className="text-2xl font-semibold">{services.filter(service => service.status === 'active').length}</p>
            </div>
          </div>
        </div>
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
              placeholder="Search services..."
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
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <button
          className="flex items-center px-4 py-2 text-white rounded-md shadow-sm"
          style={buttonStyle}
          onClick={handleAddService}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Service
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{service.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(service.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.usageCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleToggleStatus(service.id, service.status)}
                      >
                        {service.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => handleEditService(service)}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No services found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSaveService}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {currentService ? 'Edit Service' : 'Add New Service'}
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Service Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        defaultValue={currentService?.name || ''}
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        defaultValue={currentService?.description || ''}
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          defaultValue={currentService?.category || 'Other'}
                        >
                          <option value="Application">Application</option>
                          <option value="Payment">Payment</option>
                          <option value="Registration">Registration</option>
                          <option value="Verification">Verification</option>
                          <option value="Information">Information</option>
                          <option value="Reporting">Reporting</option>
                          <option value="Feedback">Feedback</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          defaultValue={currentService?.status || 'inactive'}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </div>
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

export default ServicesManagement;
