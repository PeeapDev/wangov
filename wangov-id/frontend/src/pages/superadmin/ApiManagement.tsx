import React, { useState, useEffect } from 'react';
import { 
  CodeBracketIcon,
  KeyIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  service: string;
  isPublic: boolean;
  requiresAuth: boolean;
  rateLimit: number;
  responseTime: number;
  status: 'active' | 'deprecated' | 'maintenance';
  lastUpdated: string;
}

interface ApiService {
  id: string;
  name: string;
  version: string;
  description: string;
  status: 'online' | 'offline' | 'degraded';
  endpoints: number;
  baseUrl: string;
  documentation: string;
  lastDeployed: string;
}

const ApiManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'services'>('endpoints');
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [services, setServices] = useState<ApiService[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showEndpointModal, setShowEndpointModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async () => {
    try {
      // Mock data - replace with actual API calls
      setTimeout(() => {
        setEndpoints([
          {
            id: '1',
            path: '/api/v1/citizens',
            method: 'GET',
            description: 'Retrieve all citizens',
            service: 'Citizen API',
            isPublic: false,
            requiresAuth: true,
            rateLimit: 100,
            responseTime: 320,
            status: 'active',
            lastUpdated: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            path: '/api/v1/citizens/{id}',
            method: 'GET',
            description: 'Retrieve a citizen by ID',
            service: 'Citizen API',
            isPublic: false,
            requiresAuth: true,
            rateLimit: 200,
            responseTime: 150,
            status: 'active',
            lastUpdated: '2024-01-15T10:30:00Z'
          },
          {
            id: '3',
            path: '/api/v1/organizations',
            method: 'GET',
            description: 'Retrieve all organizations',
            service: 'Organization API',
            isPublic: false,
            requiresAuth: true,
            rateLimit: 100,
            responseTime: 450,
            status: 'active',
            lastUpdated: '2024-01-20T14:30:00Z'
          },
          {
            id: '4',
            path: '/api/v1/auth/login',
            method: 'POST',
            description: 'Authenticate user',
            service: 'Authentication API',
            isPublic: true,
            requiresAuth: false,
            rateLimit: 500,
            responseTime: 200,
            status: 'active',
            lastUpdated: '2023-12-05T09:15:00Z'
          },
          {
            id: '5',
            path: '/api/v1/verification/status/{id}',
            method: 'GET',
            description: 'Check verification status',
            service: 'Verification API',
            isPublic: false,
            requiresAuth: true,
            rateLimit: 300,
            responseTime: 180,
            status: 'active',
            lastUpdated: '2024-01-25T16:45:00Z'
          },
          {
            id: '6',
            path: '/api/v1/documents/upload',
            method: 'POST',
            description: 'Upload document',
            service: 'Document API',
            isPublic: false,
            requiresAuth: true,
            rateLimit: 50,
            responseTime: 1200,
            status: 'deprecated',
            lastUpdated: '2023-10-10T11:20:00Z'
          }
        ]);

        setServices([
          {
            id: '1',
            name: 'Citizen API',
            version: 'v1.2.0',
            description: 'Core API for citizen data and management',
            status: 'online',
            endpoints: 12,
            baseUrl: 'https://api.wangov.sl/citizens',
            documentation: 'https://docs.wangov.sl/citizens',
            lastDeployed: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            name: 'Organization API',
            version: 'v1.1.5',
            description: 'Organization management and services',
            status: 'online',
            endpoints: 8,
            baseUrl: 'https://api.wangov.sl/organizations',
            documentation: 'https://docs.wangov.sl/organizations',
            lastDeployed: '2024-01-20T14:30:00Z'
          },
          {
            id: '3',
            name: 'Authentication API',
            version: 'v2.0.1',
            description: 'User authentication and authorization',
            status: 'online',
            endpoints: 6,
            baseUrl: 'https://api.wangov.sl/auth',
            documentation: 'https://docs.wangov.sl/auth',
            lastDeployed: '2023-12-05T09:15:00Z'
          },
          {
            id: '4',
            name: 'Verification API',
            version: 'v1.0.8',
            description: 'ID verification and validation services',
            status: 'degraded',
            endpoints: 4,
            baseUrl: 'https://api.wangov.sl/verification',
            documentation: 'https://docs.wangov.sl/verification',
            lastDeployed: '2024-01-25T16:45:00Z'
          },
          {
            id: '5',
            name: 'Document API',
            version: 'v0.9.2',
            description: 'Document storage and processing',
            status: 'offline',
            endpoints: 5,
            baseUrl: 'https://api.wangov.sl/documents',
            documentation: 'https://docs.wangov.sl/documents',
            lastDeployed: '2023-10-10T11:20:00Z'
          }
        ]);
        
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch API data:', error);
      toast.error('Failed to load API data');
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'active':
      case 'online':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'deprecated':
      case 'offline':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'maintenance':
      case 'degraded':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getMethodBadge = (method: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (method) {
      case 'GET':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'POST':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'PUT':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'DELETE':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'PATCH':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredEndpoints = endpoints.filter(endpoint => 
    endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          <CodeBracketIcon className="w-8 h-8 mr-3 text-green-600" />
          API Management
        </h1>
        <p className="text-gray-600 mt-1">Manage and monitor API endpoints, services, and configurations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CodeBracketIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">API Endpoints</p>
              <p className="text-2xl font-bold text-gray-900">{endpoints.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Services</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Deprecated</p>
              <p className="text-2xl font-bold text-gray-900">
                {endpoints.filter(e => e.status === 'deprecated').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <KeyIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Auth Required</p>
              <p className="text-2xl font-bold text-gray-900">
                {endpoints.filter(e => e.requiresAuth).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('endpoints')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'endpoints'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              API Endpoints
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              API Services
            </button>
          </nav>
        </div>
      </div>

      {/* Search and Actions Bar */}
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
              placeholder={activeTab === 'endpoints' ? "Search endpoints..." : "Search services..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div>
            <button
              onClick={() => activeTab === 'endpoints' ? setShowEndpointModal(true) : setShowServiceModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New {activeTab === 'endpoints' ? 'Endpoint' : 'Service'}
            </button>
          </div>
        </div>
      </div>

      {/* Endpoints Table */}
      {activeTab === 'endpoints' && (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Path / Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Security
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate Limit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEndpoints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      <CodeBracketIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p>No API endpoints found matching your search.</p>
                    </td>
                  </tr>
                ) : (
                  filteredEndpoints.map((endpoint) => (
                    <tr key={endpoint.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900 mb-1">{endpoint.path}</div>
                          <div className="flex items-center">
                            <span className={getMethodBadge(endpoint.method)}>
                              {endpoint.method}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {endpoint.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{endpoint.service}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <ShieldCheckIcon className={`h-4 w-4 mr-1 ${endpoint.requiresAuth ? 'text-green-600' : 'text-gray-400'}`} />
                            {endpoint.requiresAuth ? 'Auth Required' : 'No Auth'}
                          </div>
                          <div className="flex items-center text-sm text-gray-900">
                            <KeyIcon className={`h-4 w-4 mr-1 ${endpoint.isPublic ? 'text-gray-400' : 'text-blue-600'}`} />
                            {endpoint.isPublic ? 'Public' : 'Private'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {endpoint.rateLimit} req/min
                        </div>
                        <div className="text-xs text-gray-500">
                          ~{endpoint.responseTime}ms
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(endpoint.status)}>
                          {endpoint.status.charAt(0).toUpperCase() + endpoint.status.slice(1)}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Updated: {new Date(endpoint.lastUpdated).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View Documentation"
                          >
                            <DocumentTextIcon className="h-5 w-5" />
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
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
      )}

      {/* Services Table */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base URL
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endpoints
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      <CodeBracketIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p>No API services found matching your search.</p>
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {service.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{service.version}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 truncate max-w-xs">{service.baseUrl}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.endpoints}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(service.status)}>
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Deployed: {new Date(service.lastDeployed).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <a
                            href={service.documentation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View Documentation"
                          >
                            <DocumentTextIcon className="h-5 w-5" />
                          </a>
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="View Analytics"
                          >
                            <ChartBarIcon className="h-5 w-5" />
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
      )}

      {/* Pagination - simplified for token limit */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">
                {activeTab === 'endpoints' ? filteredEndpoints.length : filteredServices.length}
              </span> of{' '}
              <span className="font-medium">
                {activeTab === 'endpoints' ? filteredEndpoints.length : filteredServices.length}
              </span> results
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
    </div>
  );
};

export default ApiManagement;
