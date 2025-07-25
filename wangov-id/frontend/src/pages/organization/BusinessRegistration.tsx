import React, { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PlusIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Business {
  id: string;
  name: string;
  registrationNumber: string;
  businessType: string;
  description: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  documents: {
    businessLicense: string;
    taxCertificate: string;
    incorporationCertificate: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

const BusinessRegistration: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        setBusinesses([
          {
            id: '1',
            name: 'TechCorp Solutions',
            registrationNumber: 'RC123456789',
            businessType: 'Technology',
            description: 'Software development and IT consulting services',
            website: 'https://techcorp.sl',
            contactEmail: 'contact@techcorp.sl',
            contactPhone: '+232-76-123456',
            address: {
              street: '15 Siaka Stevens Street',
              city: 'Freetown',
              state: 'Western Area',
              country: 'Sierra Leone',
              postalCode: '00232'
            },
            documents: {
              businessLicense: '/uploads/business-license-1.pdf',
              taxCertificate: '/uploads/tax-cert-1.pdf',
              incorporationCertificate: '/uploads/incorporation-1.pdf'
            },
            status: 'approved',
            approvedBy: 'John Admin',
            approvedAt: '2024-01-15T10:30:00Z',
            createdAt: '2024-01-10T09:00:00Z',
            updatedAt: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            name: 'HealthPlus Clinic',
            registrationNumber: 'RC987654321',
            businessType: 'Healthcare',
            description: 'Private healthcare and medical services',
            website: 'https://healthplus.sl',
            contactEmail: 'info@healthplus.sl',
            contactPhone: '+232-77-987654',
            address: {
              street: '42 Wilkinson Road',
              city: 'Freetown',
              state: 'Western Area',
              country: 'Sierra Leone',
              postalCode: '00232'
            },
            documents: {
              businessLicense: '/uploads/business-license-2.pdf',
              taxCertificate: '/uploads/tax-cert-2.pdf',
              incorporationCertificate: '/uploads/incorporation-2.pdf'
            },
            status: 'pending',
            createdAt: '2024-01-20T14:00:00Z',
            updatedAt: '2024-01-20T14:00:00Z'
          }
        ]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
      toast.error('Failed to load businesses');
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'suspended':
        return <XCircleIcon className="w-5 h-5 text-orange-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'suspended':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleAddBusiness = () => {
    setSelectedBusiness(null);
    setShowAddModal(true);
  };

  const handleEditBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setShowAddModal(true);
  };

  const handleSubmitBusiness = async (businessData: Partial<Business>) => {
    try {
      if (selectedBusiness) {
        // Update existing business
        setBusinesses(prev => prev.map(b => 
          b.id === selectedBusiness.id 
            ? { ...b, ...businessData, updatedAt: new Date().toISOString() }
            : b
        ));
        toast.success('Business updated successfully');
      } else {
        // Add new business
        const newBusiness: Business = {
          id: Date.now().toString(),
          ...businessData as Business,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setBusinesses(prev => [...prev, newBusiness]);
        toast.success('Business registration submitted for approval');
      }
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to submit business:', error);
      toast.error('Failed to submit business registration');
    }
  };

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
              Business Registration
            </h1>
            <p className="text-gray-600 mt-1">Manage your business registrations and approvals</p>
          </div>
          <button
            onClick={handleAddBusiness}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Register New Business
          </button>
        </div>
      </div>

      {/* Business List */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Registered Businesses</h2>
        </div>
        
        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses registered</h3>
            <p className="text-gray-600 mb-4">Get started by registering your first business</p>
            <button
              onClick={handleAddBusiness}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Register Business
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {businesses.map((business) => (
              <div key={business.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
                      {getStatusIcon(business.status)}
                      <span className={getStatusBadge(business.status)}>
                        {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Registration:</strong> {business.registrationNumber}
                      </div>
                      <div>
                        <strong>Type:</strong> {business.businessType}
                      </div>
                      <div>
                        <strong>Contact:</strong> {business.contactEmail}
                      </div>
                      <div>
                        <strong>Phone:</strong> {business.contactPhone}
                      </div>
                      <div>
                        <strong>Website:</strong> 
                        <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 ml-1">
                          {business.website}
                        </a>
                      </div>
                      <div>
                        <strong>Registered:</strong> {new Date(business.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {business.status === 'approved' && business.approvedBy && (
                      <div className="mt-2 text-sm text-green-600">
                        <strong>Approved by:</strong> {business.approvedBy} on {new Date(business.approvedAt!).toLocaleDateString()}
                      </div>
                    )}

                    {business.status === 'rejected' && business.rejectionReason && (
                      <div className="mt-2 text-sm text-red-600">
                        <strong>Rejection reason:</strong> {business.rejectionReason}
                      </div>
                    )}

                    <div className="mt-3">
                      <p className="text-gray-700">{business.description}</p>
                    </div>

                    <div className="mt-3">
                      <strong className="text-sm text-gray-600">Address:</strong>
                      <p className="text-sm text-gray-600">
                        {business.address.street}, {business.address.city}, {business.address.state}, {business.address.country} {business.address.postalCode}
                      </p>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => handleEditBusiness(business)}
                      className="text-green-600 hover:text-green-800 flex items-center"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 flex items-center">
                      <DocumentTextIcon className="w-4 h-4 mr-1" />
                      Documents
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Business Modal */}
      {showAddModal && (
        <BusinessRegistrationModal
          business={selectedBusiness}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleSubmitBusiness}
        />
      )}
    </div>
  );
};

// Business Registration Modal Component
interface BusinessRegistrationModalProps {
  business: Business | null;
  onClose: () => void;
  onSubmit: (business: Partial<Business>) => void;
}

const BusinessRegistrationModal: React.FC<BusinessRegistrationModalProps> = ({
  business,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Partial<Business>>({
    name: business?.name || '',
    registrationNumber: business?.registrationNumber || '',
    businessType: business?.businessType || '',
    description: business?.description || '',
    website: business?.website || '',
    contactEmail: business?.contactEmail || '',
    contactPhone: business?.contactPhone || '',
    address: {
      street: business?.address?.street || '',
      city: business?.address?.city || '',
      state: business?.address?.state || '',
      country: business?.address?.country || 'Sierra Leone',
      postalCode: business?.address?.postalCode || ''
    },
    documents: {
      businessLicense: business?.documents?.businessLicense || '',
      taxCertificate: business?.documents?.taxCertificate || '',
      incorporationCertificate: business?.documents?.incorporationCertificate || ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Business] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {business ? 'Edit Business' : 'Register New Business'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type *
                </label>
                <select
                  required
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Type</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Finance">Finance</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Services">Services</option>
                  <option value="Other">Other</option>
                </select>
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
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
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
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Business Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address?.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address?.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address?.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address?.country}
                  onChange={(e) => handleInputChange('address.country', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.address?.postalCode}
                  onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Required Documents</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business License *
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">Upload PDF, JPG, or PNG (max 5MB)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Certificate *
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">Upload PDF, JPG, or PNG (max 5MB)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate of Incorporation *
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">Upload PDF, JPG, or PNG (max 5MB)</p>
              </div>
            </div>
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {business ? 'Update Business' : 'Submit for Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessRegistration;
