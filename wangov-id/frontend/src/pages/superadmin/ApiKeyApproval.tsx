import React, { useState, useEffect } from 'react';
import { 
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

interface ApiKeyRequest {
  id: string;
  keyName: string;
  businessId: string;
  businessName: string;
  organizationId: string;
  organizationName: string;
  environment: 'sandbox' | 'live';
  purpose: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  keyPreview?: string;
  permissions: string[];
  ipWhitelist?: string[];
  webhookUrl?: string;
}

const ApiKeyApproval: React.FC = () => {
  const { user } = useAuth();
  const [apiKeyRequests, setApiKeyRequests] = useState<ApiKeyRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ApiKeyRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchApiKeyRequests();
  }, []);

  const fetchApiKeyRequests = async () => {
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        setApiKeyRequests([
          {
            id: '1',
            keyName: 'Production API Key',
            businessId: 'biz_1',
            businessName: 'TechCorp Solutions',
            organizationId: 'org_1',
            organizationName: 'TechCorp Organization',
            environment: 'live',
            purpose: 'Production identity verification for customer onboarding',
            requestedBy: 'Jane Smith',
            requestedAt: '2024-01-22T10:30:00Z',
            status: 'pending',
            permissions: ['identity.verify', 'identity.read', 'webhooks.receive'],
            ipWhitelist: ['192.168.1.100', '10.0.0.50'],
            webhookUrl: 'https://api.techcorp.sl/webhooks/wangov'
          },
          {
            id: '2',
            keyName: 'Healthcare Integration Key',
            businessId: 'biz_2',
            businessName: 'HealthPlus Clinic',
            organizationId: 'org_2',
            organizationName: 'HealthPlus Organization',
            environment: 'live',
            purpose: 'Patient identity verification for medical records access',
            requestedBy: 'Dr. Michael Johnson',
            requestedAt: '2024-01-21T14:15:00Z',
            status: 'approved',
            approvedBy: 'John Admin',
            approvedAt: '2024-01-22T09:00:00Z',
            keyPreview: 'wgid_live_1234...abcd',
            permissions: ['identity.verify', 'identity.read'],
            ipWhitelist: ['203.45.67.89'],
            webhookUrl: 'https://healthplus.sl/api/identity-webhook'
          },
          {
            id: '3',
            keyName: 'Education Platform Key',
            businessId: 'biz_3',
            businessName: 'EduTech Platform',
            organizationId: 'org_3',
            organizationName: 'EduTech Organization',
            environment: 'live',
            purpose: 'Student identity verification for online courses',
            requestedBy: 'Sarah Williams',
            requestedAt: '2024-01-20T16:45:00Z',
            status: 'rejected',
            rejectionReason: 'Business registration not yet approved. Please complete business approval process first.',
            permissions: ['identity.verify', 'identity.read', 'webhooks.receive']
          },
          {
            id: '4',
            keyName: 'Finance Services Key',
            businessId: 'biz_4',
            businessName: 'FinanceFlow Services',
            organizationId: 'org_4',
            organizationName: 'FinanceFlow Organization',
            environment: 'live',
            purpose: 'KYC verification for financial services',
            requestedBy: 'Robert Brown',
            requestedAt: '2024-01-23T11:20:00Z',
            status: 'pending',
            permissions: ['identity.verify', 'identity.read', 'identity.documents', 'webhooks.receive'],
            ipWhitelist: ['45.123.67.89', '45.123.67.90'],
            webhookUrl: 'https://api.financeflow.sl/wangov/webhook'
          }
        ]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch API key requests:', error);
      toast.error('Failed to load API key requests');
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
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleViewDetails = (request: ApiKeyRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleApprovalAction = (request: ApiKeyRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setApprovalAction(action);
    setRejectionReason('');
    setShowApprovalModal(true);
  };

  const handleSubmitApproval = async () => {
    if (!selectedRequest || !user) return;

    try {
      const updatedRequest: ApiKeyRequest = {
        ...selectedRequest,
        status: approvalAction === 'approve' ? 'approved' : 'rejected',
        ...(approvalAction === 'approve' ? {
          approvedBy: user.firstName || user.email,
          approvedAt: new Date().toISOString(),
          keyPreview: `wgid_live_${Math.random().toString(36).substr(2, 8)}...${Math.random().toString(36).substr(2, 4)}`
        } : {
          rejectionReason
        })
      };

      setApiKeyRequests(prev => prev.map(r => 
        r.id === selectedRequest.id ? updatedRequest : r
      ));

      toast.success(`API key request ${approvalAction}d successfully`);
      setShowApprovalModal(false);
    } catch (error) {
      console.error('Failed to update API key request:', error);
      toast.error('Failed to update API key request');
    }
  };

  const filteredRequests = filterStatus === 'all' 
    ? apiKeyRequests 
    : apiKeyRequests.filter(r => r.status === filterStatus);

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
          <KeyIcon className="w-8 h-8 mr-3 text-green-600" />
          API Key Approval Management
        </h1>
        <p className="text-gray-600 mt-1">Review and approve live API key requests from organizations</p>
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
                {apiKeyRequests.filter(r => r.status === 'pending').length}
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
                {apiKeyRequests.filter(r => r.status === 'approved').length}
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
                {apiKeyRequests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <KeyIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{apiKeyRequests.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'all', name: 'All Requests', count: apiKeyRequests.length },
              { id: 'pending', name: 'Pending', count: apiKeyRequests.filter(r => r.status === 'pending').length },
              { id: 'approved', name: 'Approved', count: apiKeyRequests.filter(r => r.status === 'approved').length },
              { id: 'rejected', name: 'Rejected', count: apiKeyRequests.filter(r => r.status === 'rejected').length }
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

      {/* API Key Requests List */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <KeyIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No API key requests found</h3>
            <p className="text-gray-600">No requests match the current filter</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{request.keyName}</h3>
                      {getStatusIcon(request.status)}
                      <span className={getStatusBadge(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                        LIVE
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                        <span><strong>Business:</strong> {request.businessName}</span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span><strong>Requested:</strong> {new Date(request.requestedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <ShieldCheckIcon className="w-4 h-4 mr-2" />
                        <span><strong>Permissions:</strong> {request.permissions.length} granted</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-gray-700"><strong>Purpose:</strong> {request.purpose}</p>
                    </div>

                    <div className="text-sm text-gray-600">
                      <strong>Organization:</strong> {request.organizationName} | 
                      <strong className="ml-2">Requested by:</strong> {request.requestedBy}
                    </div>

                    {request.status === 'approved' && request.approvedBy && (
                      <div className="mt-2 text-sm text-green-600">
                        <strong>Approved by:</strong> {request.approvedBy} on {new Date(request.approvedAt!).toLocaleDateString()}
                        {request.keyPreview && (
                          <div className="mt-1">
                            <strong>API Key:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">{request.keyPreview}</code>
                          </div>
                        )}
                      </div>
                    )}

                    {request.status === 'rejected' && request.rejectionReason && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <strong className="text-red-800">Rejection reason:</strong>
                        <p className="text-red-700 mt-1">{request.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="text-blue-600 hover:text-blue-800 flex items-center px-3 py-2 border border-blue-300 rounded-lg hover:bg-blue-50"
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                    
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprovalAction(request, 'approve')}
                          className="text-green-600 hover:text-green-800 flex items-center px-3 py-2 border border-green-300 rounded-lg hover:bg-green-50"
                        >
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleApprovalAction(request, 'reject')}
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

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">API Key Request Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Request Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-gray-700">Key Name:</strong>
                    <p className="text-gray-900">{selectedRequest.keyName}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Environment:</strong>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
                      LIVE
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Business:</strong>
                    <p className="text-gray-900">{selectedRequest.businessName}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Organization:</strong>
                    <p className="text-gray-900">{selectedRequest.organizationName}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Requested by:</strong>
                    <p className="text-gray-900">{selectedRequest.requestedBy}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Requested on:</strong>
                    <p className="text-gray-900">{new Date(selectedRequest.requestedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <strong className="text-gray-700">Purpose:</strong>
                  <p className="text-gray-900 mt-1">{selectedRequest.purpose}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.permissions.map((permission, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>

              {selectedRequest.ipWhitelist && selectedRequest.ipWhitelist.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">IP Whitelist</h3>
                  <div className="space-y-1">
                    {selectedRequest.ipWhitelist.map((ip, index) => (
                      <code key={index} className="block bg-gray-100 px-3 py-1 rounded text-sm">
                        {ip}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.webhookUrl && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Webhook Configuration</h3>
                  <code className="block bg-gray-100 px-3 py-2 rounded text-sm">
                    {selectedRequest.webhookUrl}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {approvalAction === 'approve' ? 'Approve API Key Request' : 'Reject API Key Request'}
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to {approvalAction} the live API key request for <strong>{selectedRequest.keyName}</strong>?
              </p>

              {approvalAction === 'reject' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Please provide a detailed reason for rejection..."
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitApproval}
                  disabled={approvalAction === 'reject' && !rejectionReason.trim()}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    approvalAction === 'approve'
                      ? 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300'
                      : 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300'
                  }`}
                >
                  {approvalAction === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyApproval;
