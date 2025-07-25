import React, { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  EyeIcon,
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

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
  organizationId: string;
  organizationName: string;
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
}

const BusinessApproval: React.FC = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

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
            organizationId: 'org_1',
            organizationName: 'TechCorp Organization',
            submittedBy: 'Jane Smith',
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
            organizationId: 'org_2',
            organizationName: 'HealthPlus Organization',
            submittedBy: 'Dr. Michael Johnson',
            createdAt: '2024-01-20T14:00:00Z',
            updatedAt: '2024-01-20T14:00:00Z'
          },
          {
            id: '3',
            name: 'EduTech Platform',
            registrationNumber: 'RC456789123',
            businessType: 'Education',
            description: 'Online learning platform and educational technology',
            website: 'https://edutech.sl',
            contactEmail: 'admin@edutech.sl',
            contactPhone: '+232-78-456789',
            address: {
              street: '28 Charlotte Street',
              city: 'Freetown',
              state: 'Western Area',
              country: 'Sierra Leone',
              postalCode: '00232'
            },
            documents: {
              businessLicense: '/uploads/business-license-3.pdf',
              taxCertificate: '/uploads/tax-cert-3.pdf',
              incorporationCertificate: '/uploads/incorporation-3.pdf'
            },
            status: 'pending',
            organizationId: 'org_3',
            organizationName: 'EduTech Organization',
            submittedBy: 'Sarah Williams',
            createdAt: '2024-01-22T11:30:00Z',
            updatedAt: '2024-01-22T11:30:00Z'
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

  const handleViewDetails = (business: Business) => {
    setSelectedBusiness(business);
    setShowDetailsModal(true);
  };

  const handleApprovalAction = (business: Business, action: 'approve' | 'reject') => {
    setSelectedBusiness(business);
    setApprovalAction(action);
    setRejectionReason('');
    setShowApprovalModal(true);
  };

  const handleSubmitApproval = async () => {
    if (!selectedBusiness || !user) return;

    try {
      const updatedBusiness: Business = {
        ...selectedBusiness,
        status: approvalAction === 'approve' ? 'approved' : 'rejected',
        updatedAt: new Date().toISOString(),
        ...(approvalAction === 'approve' ? {
          approvedBy: user.firstName || user.email,
          approvedAt: new Date().toISOString()
        } : {
          rejectionReason
        })
      };

      setBusinesses(prev => prev.map(b => 
        b.id === selectedBusiness.id ? updatedBusiness : b
      ));

      toast.success(`Business ${approvalAction}d successfully`);
      setShowApprovalModal(false);
    } catch (error) {
      console.error('Failed to update business status:', error);
      toast.error('Failed to update business status');
    }
  };

  const filteredBusinesses = filterStatus === 'all' 
    ? businesses 
    : businesses.filter(b => b.status === filterStatus);

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
          <BuildingOfficeIcon className="w-8 h-8 mr-3 text-green-600" />
          Business Approval Management
        </h1>
        <p className="text-gray-600 mt-1">Review and approve organization business registrations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">
                {businesses.filter(b => b.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {businesses.filter(b => b.status === 'approved').length}
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
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {businesses.filter(b => b.status === 'rejected').length}
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
              <p className="text-sm font-medium text-gray-600">Total Businesses</p>
              <p className="text-2xl font-bold text-gray-900">{businesses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'all', name: 'All Businesses', count: businesses.length },
              { id: 'pending', name: 'Pending', count: businesses.filter(b => b.status === 'pending').length },
              { id: 'approved', name: 'Approved', count: businesses.filter(b => b.status === 'approved').length },
              { id: 'rejected', name: 'Rejected', count: businesses.filter(b => b.status === 'rejected').length }
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

      {/* Business List */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600">No businesses match the current filter</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBusinesses.map((business) => (
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                        <span><strong>Registration:</strong> {business.registrationNumber}</span>
                      </div>
                      <div className="flex items-center">
                        <UserIcon className="w-4 h-4 mr-2" />
                        <span><strong>Type:</strong> {business.businessType}</span>
                      </div>
                      <div className="flex items-center">
                        <EnvelopeIcon className="w-4 h-4 mr-2" />
                        <span><strong>Contact:</strong> {business.contactEmail}</span>
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        <span><strong>Phone:</strong> {business.contactPhone}</span>
                      </div>
                      <div className="flex items-center">
                        <GlobeAltIcon className="w-4 h-4 mr-2" />
                        <span><strong>Website:</strong> 
                          <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 ml-1">
                            {business.website}
                          </a>
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span><strong>Submitted:</strong> {new Date(business.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-gray-700">{business.description}</p>
                    </div>

                    <div className="text-sm text-gray-600">
                      <strong>Organization:</strong> {business.organizationName} | 
                      <strong className="ml-2">Submitted by:</strong> {business.submittedBy}
                    </div>

                    {business.status === 'approved' && business.approvedBy && (
                      <div className="mt-2 text-sm text-green-600">
                        <strong>Approved by:</strong> {business.approvedBy} on {new Date(business.approvedAt!).toLocaleDateString()}
                      </div>
                    )}

                    {business.status === 'rejected' && business.rejectionReason && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <strong className="text-red-800">Rejection reason:</strong>
                        <p className="text-red-700 mt-1">{business.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => handleViewDetails(business)}
                      className="text-blue-600 hover:text-blue-800 flex items-center px-3 py-2 border border-blue-300 rounded-lg hover:bg-blue-50"
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                    
                    {business.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprovalAction(business, 'approve')}
                          className="text-green-600 hover:text-green-800 flex items-center px-3 py-2 border border-green-300 rounded-lg hover:bg-green-50"
                        >
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleApprovalAction(business, 'reject')}
                          className="text-red-600 hover:text-red-800 flex items-center px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50"
                        >
                          <XCircleIcon className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals would go here - simplified for space */}
    </div>
  );
};

export default BusinessApproval;
