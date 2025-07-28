import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface PendingApplication {
  id: string;
  citizenName: string;
  nationalId: string;
  email: string;
  phone: string;
  submissionDate: string;
  applicationType: string;
  status: 'pending';
  documents: string[];
}

const PendingApplications: React.FC = () => {
  const [applications, setApplications] = useState<PendingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data loading - would be replaced with actual API call
    setTimeout(() => {
      const mockApplications: PendingApplication[] = [
        {
          id: 'APP-001',
          citizenName: 'John Doe',
          nationalId: 'SL123456789',
          email: 'john.doe@example.com',
          phone: '+232 76 123 456',
          submissionDate: '2024-01-15',
          applicationType: 'ID Renewal',
          status: 'pending',
          documents: ['National ID Card', 'Proof of Address', 'Photograph']
        },
        {
          id: 'APP-006',
          citizenName: 'Mariama Turay',
          nationalId: 'SL234567891',
          email: 'mariama.t@example.com',
          phone: '+232 77 345 678',
          submissionDate: '2024-01-22',
          applicationType: 'New ID Registration',
          status: 'pending',
          documents: ['Birth Certificate', 'Proof of Address', 'Photograph', 'Reference Letter']
        },
        {
          id: 'APP-009',
          citizenName: 'Samuel Conteh',
          nationalId: 'SL345678912',
          email: 'samuel.c@example.com',
          phone: '+232 78 456 789',
          submissionDate: '2024-01-25',
          applicationType: 'Information Update',
          status: 'pending',
          documents: ['National ID Card', 'Supporting Documents']
        },
        {
          id: 'APP-004',
          citizenName: 'Aminata Sesay',
          nationalId: 'SL789123456',
          email: 'aminata.s@example.com',
          phone: '+232 79 456 789',
          submissionDate: '2024-01-05',
          applicationType: 'Information Update',
          status: 'pending',
          documents: ['National ID Card', 'Supporting Documents', 'Marriage Certificate']
        }
      ];
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredApplications = applications.filter(app => {
    return app.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.nationalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm);
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Applications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Applications awaiting initial review and verification
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
                placeholder="Name, Email, ID or Phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
                  <p className="text-gray-500">Loading pending applications...</p>
                </div>
              ) : filteredApplications.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
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
                        Application Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Submission Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Required Documents
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
                          <div className="text-sm font-medium text-gray-900">{application.citizenName}</div>
                          <div className="text-sm text-gray-500">{application.nationalId}</div>
                          <div className="text-xs text-gray-500">{application.email}</div>
                          <div className="text-xs text-gray-500">{application.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{application.id}</div>
                          <div className="text-sm text-gray-500">{application.applicationType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {application.submissionDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <ul className="list-disc pl-5">
                            {application.documents.map((doc, index) => (
                              <li key={index} className="text-xs">{doc}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
                            Move to Processing
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="bg-white p-6 text-center">
                  <p className="text-gray-500">No pending applications found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApplications;
