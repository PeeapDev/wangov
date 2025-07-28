import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Application {
  id: string;
  citizenName: string;
  nationalId: string;
  submissionDate: string;
  applicationType: string;
  processingStage: 'document_verification' | 'biometric_verification' | 'background_check' | 'final_review';
  status: 'processing';
  assignedTo?: string;
}

const ProcessingApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  useEffect(() => {
    // Mock data loading - would be replaced with actual API call
    setTimeout(() => {
      const mockApplications: Application[] = [
        {
          id: 'APP-002',
          citizenName: 'Jane Smith',
          nationalId: 'SL987654321',
          submissionDate: '2024-01-18',
          applicationType: 'Address Change',
          processingStage: 'document_verification',
          status: 'processing',
          assignedTo: 'John Analyst'
        },
        {
          id: 'APP-005',
          citizenName: 'Abdul Conteh',
          nationalId: 'SL546781239',
          submissionDate: '2024-01-20',
          applicationType: 'Name Correction',
          processingStage: 'biometric_verification',
          status: 'processing',
          assignedTo: 'Mary Processor'
        },
        {
          id: 'APP-008',
          citizenName: 'Fatmata Bangura',
          nationalId: 'SL876543210',
          submissionDate: '2024-01-15',
          applicationType: 'New ID Registration',
          processingStage: 'background_check',
          status: 'processing',
          assignedTo: 'James Verifier'
        },
        {
          id: 'APP-012',
          citizenName: 'Ibrahim Koroma',
          nationalId: 'SL654321098',
          submissionDate: '2024-01-17',
          applicationType: 'Information Update',
          processingStage: 'final_review',
          status: 'processing',
          assignedTo: 'Sarah Reviewer'
        }
      ];
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.nationalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = stageFilter === 'all' || app.processingStage === stageFilter;
    
    return matchesSearch && matchesStage;
  });

  const getStageBadgeClass = (stage: string) => {
    switch (stage) {
      case 'document_verification': return 'bg-purple-100 text-purple-800';
      case 'biometric_verification': return 'bg-blue-100 text-blue-800';
      case 'background_check': return 'bg-yellow-100 text-yellow-800';
      case 'final_review': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageDisplayName = (stage: string) => {
    switch (stage) {
      case 'document_verification': return 'Document Verification';
      case 'biometric_verification': return 'Biometric Verification';
      case 'background_check': return 'Background Check';
      case 'final_review': return 'Final Review';
      default: return stage;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Processing Applications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Applications currently in progress through the verification workflow
          </p>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Name, Application ID or National ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="stage-filter" className="block text-sm font-medium text-gray-700">
              Processing Stage
            </label>
            <select
              id="stage-filter"
              name="stage-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              <option value="all">All Stages</option>
              <option value="document_verification">Document Verification</option>
              <option value="biometric_verification">Biometric Verification</option>
              <option value="background_check">Background Check</option>
              <option value="final_review">Final Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications list */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              {loading ? (
                <div className="bg-white p-6 text-center">
                  <p className="text-gray-500">Loading processing applications...</p>
                </div>
              ) : filteredApplications.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Application ID/Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Citizen Information
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Processing Stage
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Assigned To
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                      <tr key={application.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{application.id}</div>
                          <div className="text-sm text-gray-500">{application.applicationType}</div>
                          <div className="text-xs text-gray-500">Submitted: {application.submissionDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{application.citizenName}</div>
                          <div className="text-sm text-gray-500">{application.nationalId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageBadgeClass(
                              application.processingStage
                            )}`}
                          >
                            {getStageDisplayName(application.processingStage)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {application.assignedTo || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <CheckIcon className="h-4 w-4 mr-1" />
                              Approve
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <XMarkIcon className="h-4 w-4 mr-1" />
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="bg-white p-6 text-center">
                  <p className="text-gray-500">No processing applications found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingApplications;
