import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface Application {
  id: string;
  referenceNumber: string;
  applicantName: string;
  applicationType: 'citizen' | 'resident_permit';
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'pending_documents';
  submittedAt: string;
  email: string;
  phone: string;
  priority: 'normal' | 'urgent';
}

const NCRAApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockApplications: Application[] = [
        {
          id: '1',
          referenceNumber: 'CIT-2025-001',
          applicantName: 'John Doe',
          applicationType: 'citizen',
          status: 'submitted',
          submittedAt: '2025-01-25T10:30:00Z',
          email: 'john.doe@example.com',
          phone: '+232 76 123 456',
          priority: 'normal'
        },
        {
          id: '2',
          referenceNumber: 'RP-2025-002',
          applicantName: 'Jane Smith',
          applicationType: 'resident_permit',
          status: 'under_review',
          submittedAt: '2025-01-25T09:15:00Z',
          email: 'jane.smith@example.com',
          phone: '+232 77 234 567',
          priority: 'urgent'
        },
        {
          id: '3',
          referenceNumber: 'CIT-2025-003',
          applicantName: 'Mohamed Kaba',
          applicationType: 'citizen',
          status: 'approved',
          submittedAt: '2025-01-24T16:45:00Z',
          email: 'mohamed.kaba@example.com',
          phone: '+232 78 345 678',
          priority: 'normal'
        },
        {
          id: '4',
          referenceNumber: 'CIT-2025-004',
          applicantName: 'Sarah Johnson',
          applicationType: 'citizen',
          status: 'pending_documents',
          submittedAt: '2025-01-24T14:20:00Z',
          email: 'sarah.johnson@example.com',
          phone: '+232 79 456 789',
          priority: 'normal'
        },
        {
          id: '5',
          referenceNumber: 'RP-2025-005',
          applicantName: 'Ahmed Hassan',
          applicationType: 'resident_permit',
          status: 'rejected',
          submittedAt: '2025-01-23T11:30:00Z',
          email: 'ahmed.hassan@example.com',
          phone: '+232 76 567 890',
          priority: 'normal'
        }
      ];
      
      setApplications(mockApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'submitted': 'bg-blue-100 text-blue-800',
      'under_review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'pending_documents': 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected':
        return <XCircleIcon className="h-4 w-4" />;
      case 'under_review':
      case 'pending_documents':
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesType = typeFilter === 'all' || app.applicationType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleUpdateStatus = (applicationId: string, newStatus: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus as any } : app
      )
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Applications Management</h1>
        <p className="text-gray-600">Review and manage citizen registration applications</p>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending_documents">Pending Documents</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="citizen">Citizen Registration</option>
              <option value="resident_permit">Resident Permit</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Loading applications...
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.referenceNumber}
                          </div>
                          {application.priority === 'urgent' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Urgent
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.applicantName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {application.applicationType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1 capitalize">
                          {application.status.replace('_', ' ')}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 flex items-center">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </button>
                        {application.status === 'submitted' && (
                          <button 
                            onClick={() => handleUpdateStatus(application.id, 'under_review')}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Review
                          </button>
                        )}
                        {application.status === 'under_review' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(application.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(application.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">
            {applications.filter(app => app.status === 'submitted').length}
          </div>
          <div className="text-sm text-gray-600">New Submissions</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {applications.filter(app => app.status === 'under_review').length}
          </div>
          <div className="text-sm text-gray-600">Under Review</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">
            {applications.filter(app => app.status === 'approved').length}
          </div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-red-600">
            {applications.filter(app => app.status === 'rejected').length}
          </div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-gray-600">
            {applications.length}
          </div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </div>
      </div>
    </div>
  );
};

export default NCRAApplications;
