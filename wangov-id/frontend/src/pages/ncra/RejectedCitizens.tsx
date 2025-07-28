import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface RejectedCitizen {
  id: string;
  name: string;
  email: string;
  nationalId: string;
  phone: string;
  rejectedOn: string;
  rejectionReason: string;
}

const RejectedCitizens: React.FC = () => {
  const [rejectedCitizens, setRejectedCitizens] = useState<RejectedCitizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data loading - would be replaced with actual API call
    setTimeout(() => {
      const mockRejectedCitizens: RejectedCitizen[] = [
        {
          id: '5',
          name: 'Ibrahim Koroma',
          email: 'ibrahim.k@example.com',
          nationalId: 'SL321654987',
          phone: '+232 88 987 654',
          rejectedOn: '2023-12-15',
          rejectionReason: 'Document inconsistencies detected during verification process'
        },
        {
          id: '10',
          name: 'Isha Kanu',
          email: 'isha.k@example.com',
          nationalId: 'SL654321098',
          phone: '+232 76 765 432',
          rejectedOn: '2024-01-05',
          rejectionReason: 'Failed biometric verification after multiple attempts'
        },
        {
          id: '15',
          name: 'Mohamed Jalloh',
          email: 'mohamed.j@example.com',
          nationalId: 'SL098765432',
          phone: '+232 77 098 765',
          rejectedOn: '2024-01-12',
          rejectionReason: 'Background check revealed conflicting identity information'
        },
        {
          id: '20',
          name: 'Aminata Barrie',
          email: 'aminata.b@example.com',
          nationalId: 'SL210987654',
          phone: '+232 79 210 987',
          rejectedOn: '2023-12-28',
          rejectionReason: 'Supporting documents determined to be fraudulent'
        }
      ];
      setRejectedCitizens(mockRejectedCitizens);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCitizens = rejectedCitizens.filter(citizen => {
    return citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.nationalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.phone.includes(searchTerm);
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rejected Citizens</h1>
          <p className="mt-1 text-sm text-gray-500">
            Citizens that have been rejected during the verification process
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

      {/* Warning banner */}
      <div className="rounded-md bg-yellow-50 p-4 mb-6 border border-yellow-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Data Privacy Notice
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Rejected citizen data is retained for audit and appeal purposes. Ensure all review and handling of this data complies with privacy regulations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rejected citizens list */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              {loading ? (
                <div className="bg-white p-6 text-center">
                  <p className="text-gray-500">Loading rejected citizens data...</p>
                </div>
              ) : filteredCitizens.length > 0 ? (
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
                        National ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Rejection Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Rejection Reason
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCitizens.map((citizen) => (
                      <tr key={citizen.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{citizen.name}</div>
                          <div className="text-sm text-gray-500">{citizen.email}</div>
                          <div className="text-xs text-gray-500">{citizen.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {citizen.nationalId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {citizen.rejectedOn}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-red-600 max-w-xs">
                            {citizen.rejectionReason}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="bg-white p-6 text-center">
                  <p className="text-gray-500">No rejected citizens found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedCitizens;
