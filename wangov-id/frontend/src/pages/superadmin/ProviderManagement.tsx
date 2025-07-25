import React, { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  HeartIcon,
  BoltIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Provider icon mapping
const providerIcons = {
  tax: CurrencyDollarIcon,
  education: AcademicCapIcon,
  health: HeartIcon,
  electricity: BoltIcon,
  nassit: UserGroupIcon,
  security: ShieldCheckIcon,
  custom: BuildingOfficeIcon
};

interface Provider {
  id: string;
  name: string;
  type: 'tax' | 'education' | 'health' | 'electricity' | 'nassit' | 'security' | 'custom';
  description: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  apiEndpoint: string;
  status: 'active' | 'inactive' | 'maintenance';
  integrationStatus: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  totalRequests: number;
  successRate: number;
  createdAt: string;
  updatedAt: string;
  services?: string[];
  citizensCount?: number;
  apiEnabled?: boolean;
  // New subdomain fields
  subdomain?: string;
  subdomainUrl?: string;
  portalEnabled?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  logo?: string;
}

const ProviderManagement: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        setProviders([
          {
            id: '1',
            name: 'National Revenue Authority (NRA)',
            type: 'tax',
            description: 'Tax collection and revenue management services',
            contactEmail: 'api@nra.gov.sl',
            contactPhone: '+232-22-229851',
            website: 'https://nra.gov.sl',
            apiEndpoint: 'https://api.nra.gov.sl/v1',
            status: 'active',
            integrationStatus: 'connected',
            lastSync: '2024-01-23T10:30:00Z',
            totalRequests: 15420,
            successRate: 98.5,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-23T10:30:00Z',
            subdomain: 'tax',
            subdomainUrl: 'tax.localhost:3003',
            portalEnabled: true,
            primaryColor: '#388e3c',
            secondaryColor: '#1b5e20',
            logo: '/logos/tax.png'
          },
          {
            id: '2',
            name: 'Ministry of Basic and Senior Secondary Education',
            type: 'education',
            description: 'Educational records and certification services',
            contactEmail: 'tech@mbsse.gov.sl',
            contactPhone: '+232-22-241266',
            website: 'https://mbsse.gov.sl',
            apiEndpoint: 'https://api.mbsse.gov.sl/v1',
            status: 'active',
            integrationStatus: 'connected',
            lastSync: '2024-01-23T09:15:00Z',
            totalRequests: 8930,
            successRate: 97.2,
            createdAt: '2024-01-05T00:00:00Z',
            updatedAt: '2024-01-23T09:15:00Z',
            subdomain: 'education',
            subdomainUrl: 'education.localhost:3003',
            portalEnabled: true,
            primaryColor: '#7b1fa2',
            secondaryColor: '#4a148c',
            logo: '/logos/education.png'
          },
          {
            id: '3',
            name: 'Ministry of Health and Sanitation',
            type: 'health',
            description: 'Health records and medical certification services',
            contactEmail: 'digital@mohs.gov.sl',
            contactPhone: '+232-22-232496',
            website: 'https://mohs.gov.sl',
            apiEndpoint: 'https://api.mohs.gov.sl/v1',
            status: 'active',
            integrationStatus: 'connected',
            lastSync: '2024-01-23T11:00:00Z',
            totalRequests: 12650,
            successRate: 99.1,
            createdAt: '2024-01-03T00:00:00Z',
            updatedAt: '2024-01-23T11:00:00Z'
          },
          {
            id: '4',
            name: 'Electricity Distribution and Supply Authority (EDSA)',
            type: 'electricity',
            description: 'Electricity billing and connection services',
            contactEmail: 'api@edsa.sl',
            contactPhone: '+232-22-224012',
            website: 'https://edsa.sl',
            apiEndpoint: 'https://api.edsa.sl/v1',
            status: 'active',
            integrationStatus: 'error',
            lastSync: '2024-01-22T14:30:00Z',
            totalRequests: 5420,
            successRate: 85.3,
            createdAt: '2024-01-10T00:00:00Z',
            updatedAt: '2024-01-22T14:30:00Z'
          },
          {
            id: '5',
            name: 'National Social Security and Insurance Trust (NASSIT)',
            type: 'nassit',
            description: 'Social security and pension services',
            contactEmail: 'tech@nassit.gov.sl',
            contactPhone: '+232-22-229000',
            website: 'https://nassit.gov.sl',
            apiEndpoint: 'https://api.nassit.gov.sl/v1',
            status: 'active',
            integrationStatus: 'connected',
            lastSync: '2024-01-23T08:45:00Z',
            totalRequests: 7890,
            successRate: 96.8,
            createdAt: '2024-01-02T00:00:00Z',
            updatedAt: '2024-01-23T08:45:00Z'
          },
          {
            id: '6',
            name: 'Ministry of Basic and Senior Secondary Education (MBSSE)',
            type: 'education',
            description: 'Educational records, certification, and student services',
            contactEmail: 'digital@mbsse.gov.sl',
            contactPhone: '+232-22-241266',
            website: 'https://mbsse.gov.sl',
            apiEndpoint: 'https://api.mbsse.gov.sl/v1',
            status: 'active',
            integrationStatus: 'connected',
            lastSync: '2024-01-25T10:15:00Z',
            totalRequests: 12450,
            successRate: 98.7,
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-25T10:15:00Z',
            subdomain: 'mbsse',
            subdomainUrl: 'mbsse.localhost:3003',
            portalEnabled: true,
            primaryColor: '#1565c0',
            secondaryColor: '#0d47a1',
            logo: '/logos/mbsse.png'
          },
          {
            id: '7',
            name: 'Sierra Leone Police (SLP)',
            type: 'security',
            description: 'Security clearance and criminal record services',
            contactEmail: 'digital@police.gov.sl',
            contactPhone: '+232-22-226551',
            website: 'https://police.gov.sl',
            apiEndpoint: 'https://api.police.gov.sl/v1',
            status: 'maintenance',
            integrationStatus: 'disconnected',
            lastSync: '2024-01-20T16:00:00Z',
            totalRequests: 3210,
            successRate: 94.2,
            createdAt: '2024-01-08T00:00:00Z',
            updatedAt: '2024-01-20T16:00:00Z'
          }
        ]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
      toast.error('Failed to load providers');
      setIsLoading(false);
    }
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'tax':
        return <CurrencyDollarIcon className="w-6 h-6 text-green-600" />;
      case 'education':
        return <AcademicCapIcon className="w-6 h-6 text-blue-600" />;
      case 'health':
        return <HeartIcon className="w-6 h-6 text-red-600" />;
      case 'electricity':
        return <BoltIcon className="w-6 h-6 text-yellow-600" />;
      case 'nassit':
        return <UserGroupIcon className="w-6 h-6 text-purple-600" />;
      case 'security':
        return <ShieldCheckIcon className="w-6 h-6 text-gray-600" />;
      default:
        return <BuildingOfficeIcon className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'inactive':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'maintenance':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getIntegrationStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'connected':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'disconnected':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleAddProvider = () => {
    setSelectedProvider(null);
    setShowAddModal(true);
  };

  const handleEditProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowAddModal(true);
  };

  const handleDeleteProvider = async (providerId: string) => {
    if (window.confirm('Are you sure you want to delete this provider?')) {
      try {
        setProviders(prev => prev.filter(p => p.id !== providerId));
        toast.success('Provider deleted successfully');
      } catch (error) {
        console.error('Failed to delete provider:', error);
        toast.error('Failed to delete provider');
      }
    }
  };

  const handleSubmitProvider = async (providerData: Partial<Provider>) => {
    try {
      if (selectedProvider) {
        // Update existing provider
        setProviders(prev => prev.map(p => 
          p.id === selectedProvider.id 
            ? { ...p, ...providerData, updatedAt: new Date().toISOString() }
            : p
        ));
        toast.success('Provider updated successfully');
      } else {
        // Add new provider
        const newProvider: Provider = {
          id: Date.now().toString(),
          ...providerData as Provider,
          status: 'inactive',
          integrationStatus: 'disconnected',
          totalRequests: 0,
          successRate: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setProviders(prev => [...prev, newProvider]);
        toast.success('Provider added successfully');
      }
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to submit provider:', error);
      toast.error('Failed to save provider');
    }
  };

  const filteredProviders = filterType === 'all' 
    ? providers 
    : providers.filter(p => p.type === filterType);

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
              <BuildingOfficeIcon className="w-8 h-8 mr-3 text-green-600" />
              Provider Management
            </h1>
            <p className="text-gray-600 mt-1">Manage government service providers and integrations</p>
          </div>
          <button
            onClick={handleAddProvider}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Provider
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Providers</p>
              <p className="text-2xl font-bold text-gray-900">
                {providers.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Providers</p>
              <p className="text-2xl font-bold text-gray-900">{providers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Connected</p>
              <p className="text-2xl font-bold text-gray-900">
                {providers.filter(p => p.integrationStatus === 'connected').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {providers.reduce((sum, p) => sum + p.totalRequests, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'all', name: 'All Providers', count: providers.length },
              { id: 'tax', name: 'Tax', count: providers.filter(p => p.type === 'tax').length },
              { id: 'education', name: 'Education', count: providers.filter(p => p.type === 'education').length },
              { id: 'health', name: 'Health', count: providers.filter(p => p.type === 'health').length },
              { id: 'electricity', name: 'Electricity', count: providers.filter(p => p.type === 'electricity').length },
              { id: 'nassit', name: 'NASSIT', count: providers.filter(p => p.type === 'nassit').length },
              { id: 'security', name: 'Security', count: providers.filter(p => p.type === 'security').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  filterType === tab.id
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

      {/* Providers List */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {filteredProviders.length === 0 ? (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first provider</p>
            <button
              onClick={handleAddProvider}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add Provider
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredProviders.map((provider) => (
              <div key={provider.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getProviderIcon(provider.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                        {getStatusIcon(provider.status)}
                        <span className={getIntegrationStatusBadge(provider.integrationStatus)}>
                          {provider.integrationStatus}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{provider.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <strong>Contact:</strong> {provider.contactEmail}
                        </div>
                        <div>
                          <strong>Phone:</strong> {provider.contactPhone}
                        </div>
                        <div>
                          <strong>API Endpoint:</strong> 
                          <code className="ml-1 text-xs bg-gray-100 px-1 py-0.5 rounded">{provider.apiEndpoint}</code>
                        </div>
                        <div>
                          <strong>Success Rate:</strong> {provider.successRate}%
                        </div>
                        <div>
                          <strong>Total Requests:</strong> {provider.totalRequests.toLocaleString()}
                        </div>
                        <div>
                          <strong>Last Sync:</strong> {provider.lastSync ? new Date(provider.lastSync).toLocaleString() : 'Never'}
                        </div>
                        {provider.website && (
                          <div>
                            <strong>Website:</strong> 
                            <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 ml-1">
                              {provider.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditProvider(provider)}
                      className="text-green-600 hover:text-green-800 p-2"
                      title="Edit Provider"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProvider(provider.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete Provider"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Provider Modal */}
      {showAddModal && (
        <ProviderModal
          provider={selectedProvider}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleSubmitProvider}
        />
      )}
    </div>
  );
};

// Provider Modal Component
interface ProviderModalProps {
  provider: Provider | null;
  onClose: () => void;
  onSubmit: (provider: Partial<Provider>) => void;
}

const ProviderModal: React.FC<ProviderModalProps> = ({
  provider,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Partial<Provider>>({
    name: provider?.name || '',
    type: provider?.type || 'custom',
    description: provider?.description || '',
    contactEmail: provider?.contactEmail || '',
    contactPhone: provider?.contactPhone || '',
    website: provider?.website || '',
    apiEndpoint: provider?.apiEndpoint || '',
    // New subdomain fields
    subdomain: provider?.subdomain || '',
    portalEnabled: provider?.portalEnabled ?? true,
    primaryColor: provider?.primaryColor || '#059669',
    secondaryColor: provider?.secondaryColor || '#047857',
    logo: provider?.logo || ''
  });
  
  const [isCreatingSubdomain, setIsCreatingSubdomain] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate subdomain if portal is enabled
    if (formData.portalEnabled && !formData.subdomain) {
      toast.error('Subdomain is required when portal is enabled');
      return;
    }
    
    // Generate subdomain URL
    if (formData.subdomain) {
      formData.subdomainUrl = `${formData.subdomain}.localhost:3003`;
    }
    
    setIsCreatingSubdomain(true);
    
    try {
      // In a real implementation, this would create the subdomain and configure DNS
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      onSubmit({
        ...formData,
        ...(provider?.id && { id: provider.id }),
        status: 'active',
        integrationStatus: 'connected',
        totalRequests: 0,
        successRate: 100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      if (!provider && formData.portalEnabled) {
        toast.success(`Provider portal created! Access at: ${formData.subdomainUrl}`);
      } else {
        toast.success(provider ? 'Provider updated successfully!' : 'Provider created successfully!');
      }
    } catch (error) {
      toast.error('Failed to create provider. Please try again.');
    } finally {
      setIsCreatingSubdomain(false);
    }
  };

  const handleInputChange = (field: keyof Provider, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate subdomain from name if it's empty
    if (field === 'name' && typeof value === 'string' && !formData.subdomain) {
      const generatedSubdomain = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 20);
      setFormData(prev => ({ ...prev, subdomain: generatedSubdomain }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {provider ? 'Edit Provider' : 'Add New Provider'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., National Revenue Authority"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="tax">Tax</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="electricity">Electricity</option>
                  <option value="nassit">NASSIT</option>
                  <option value="security">Security</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Brief description of the provider's services"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="api@provider.gov.sl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="+232-XX-XXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://provider.gov.sl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Endpoint *
                </label>
                <input
                  type="url"
                  required
                  value={formData.apiEndpoint}
                  onChange={(e) => handleInputChange('apiEndpoint', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://api.provider.gov.sl/v1"
                />
              </div>
            </div>
          </div>

          {/* Subdomain Configuration */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Provider Portal Configuration</h3>
            
            {/* Portal Enable/Disable */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.portalEnabled}
                  onChange={(e) => handleInputChange('portalEnabled', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Enable Provider Portal (Creates a dedicated subdomain for this provider)
                </span>
              </label>
              <p className="mt-1 text-sm text-gray-500">
                When enabled, this provider will get their own branded portal accessible via subdomain
              </p>
            </div>

            {formData.portalEnabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subdomain *
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        required
                        value={formData.subdomain}
                        onChange={(e) => handleInputChange('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2"
                        placeholder="provider-name"
                        pattern="[a-z0-9-]+"
                      />
                      <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 text-gray-500 text-sm">
                        .localhost:3003
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Only lowercase letters, numbers, and hyphens allowed
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={formData.logo}
                      onChange={(e) => handleInputChange('logo', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="#059669"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.secondaryColor}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="#047857"
                      />
                    </div>
                  </div>
                </div>

                {formData.subdomain && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Portal Preview</h4>
                    <p className="text-sm text-blue-700">
                      Portal URL: <code className="bg-blue-100 px-1 rounded">{formData.subdomain}.localhost:3003</code>
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Staff will be able to sign in using their WanGov ID credentials
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingSubdomain}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isCreatingSubdomain ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  {provider ? 'Updating...' : 'Creating Portal...'}
                </>
              ) : (
                provider ? 'Update Provider' : 'Add Provider'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderManagement;
