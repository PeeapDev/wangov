import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon,
  LockClosedIcon,
  KeyIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Interface for security policy
interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  lastUpdated: string;
  updatedBy: string;
  category: 'access' | 'authentication' | 'data' | 'compliance';
}

// Interface for security audit
interface SecurityAudit {
  id: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  user: string;
  ipAddress: string;
  description: string;
  resolved: boolean;
}

const SecurityManagement: React.FC = () => {
  const [policies, setPolicies] = useState<SecurityPolicy[]>([]);
  const [audits, setAudits] = useState<SecurityAudit[]>([]);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(true);
  const [isLoadingAudits, setIsLoadingAudits] = useState(true);
  const [activeTab, setActiveTab] = useState('policies');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  useEffect(() => {
    fetchPolicies();
    fetchAudits();
  }, []);

  const fetchPolicies = async () => {
    setIsLoadingPolicies(true);
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        setPolicies([
          {
            id: '1',
            name: 'Password Policy',
            description: 'Minimum 8 characters, must include numbers, letters, and special characters. Changes required every 90 days.',
            status: 'active',
            lastUpdated: '2025-06-15T10:30:00Z',
            updatedBy: 'System Admin',
            category: 'authentication'
          },
          {
            id: '2',
            name: 'Two-Factor Authentication',
            description: 'Two-factor authentication required for all administrator accounts and sensitive operations.',
            status: 'active',
            lastUpdated: '2025-07-01T14:45:00Z',
            updatedBy: 'System Admin',
            category: 'authentication'
          },
          {
            id: '3',
            name: 'Data Encryption Policy',
            description: 'All personal and sensitive data must be encrypted at rest and in transit using industry-standard encryption.',
            status: 'active',
            lastUpdated: '2025-06-10T09:15:00Z',
            updatedBy: 'Security Officer',
            category: 'data'
          },
          {
            id: '4',
            name: 'Session Timeout',
            description: 'User sessions automatically timeout after 30 minutes of inactivity.',
            status: 'active',
            lastUpdated: '2025-07-10T11:20:00Z',
            updatedBy: 'System Admin',
            category: 'access'
          },
          {
            id: '5',
            name: 'Audit Logging',
            description: 'All system activities, especially those involving personal data, must be logged and preserved for 12 months.',
            status: 'active',
            lastUpdated: '2025-05-22T08:00:00Z',
            updatedBy: 'Compliance Manager',
            category: 'compliance'
          }
        ]);
        setIsLoadingPolicies(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch security policies:', error);
      toast.error('Failed to load security policies');
      setIsLoadingPolicies(false);
    }
  };

  const fetchAudits = async () => {
    setIsLoadingAudits(true);
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        setAudits([
          {
            id: '1',
            eventType: 'Failed Login Attempt',
            severity: 'medium',
            timestamp: '2025-07-23T09:45:22Z',
            user: 'admin@wangov.sl',
            ipAddress: '192.168.1.105',
            description: 'Multiple failed login attempts detected',
            resolved: true
          },
          {
            id: '2',
            eventType: 'Unauthorized Access Attempt',
            severity: 'high',
            timestamp: '2025-07-22T14:30:15Z',
            user: 'unknown',
            ipAddress: '45.123.45.67',
            description: 'Attempted to access restricted API endpoints without proper authorization',
            resolved: true
          },
          {
            id: '3',
            eventType: 'Configuration Change',
            severity: 'low',
            timestamp: '2025-07-21T16:15:08Z',
            user: 'system.admin@wangov.sl',
            ipAddress: '192.168.1.10',
            description: 'System configuration updated: Email SMTP settings changed',
            resolved: true
          },
          {
            id: '4',
            eventType: 'Data Export',
            severity: 'medium',
            timestamp: '2025-07-20T11:05:33Z',
            user: 'data.officer@wangov.sl',
            ipAddress: '192.168.1.25',
            description: 'Bulk export of citizen data performed',
            resolved: true
          },
          {
            id: '5',
            eventType: 'Suspicious Activity',
            severity: 'critical',
            timestamp: '2025-07-19T03:22:47Z',
            user: 'unknown',
            ipAddress: '78.45.123.89',
            description: 'Multiple attempts to exploit potential XSS vulnerability',
            resolved: false
          }
        ]);
        setIsLoadingAudits(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch security audits:', error);
      toast.error('Failed to load security audit logs');
      setIsLoadingAudits(false);
    }
  };

  const handleUpdatePolicy = (policyId: string, newStatus: 'active' | 'inactive') => {
    setPolicies(policies.map(policy => 
      policy.id === policyId 
        ? { ...policy, status: newStatus, lastUpdated: new Date().toISOString(), updatedBy: 'Current User' }
        : policy
    ));
    toast.success(`Policy status updated to ${newStatus}`);
  };

  const handleResolveAudit = (auditId: string) => {
    setAudits(audits.map(audit => 
      audit.id === auditId
        ? { ...audit, resolved: true }
        : audit
    ));
    toast.success('Audit marked as resolved');
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || policy.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.eventType.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         audit.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || audit.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ShieldCheckIcon className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Security Management</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-6">
          <button
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'policies'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('policies')}
          >
            <div className="flex items-center">
              <LockClosedIcon className="w-5 h-5 mr-2" />
              Security Policies
            </div>
          </button>
          <button
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'audits'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('audits')}
          >
            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 mr-2" />
              Security Audits & Alerts
            </div>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-3 md:space-y-0">
        <div className="w-full md:w-64 relative">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
            placeholder={`Search ${activeTab === 'policies' ? 'policies' : 'audits'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {activeTab === 'policies' && (
          <select
            className="w-full md:w-48 p-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="access">Access Control</option>
            <option value="authentication">Authentication</option>
            <option value="data">Data Security</option>
            <option value="compliance">Compliance</option>
          </select>
        )}

        {activeTab === 'audits' && (
          <select
            className="w-full md:w-48 p-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="all">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        )}
      </div>

      {/* Policies Content */}
      {activeTab === 'policies' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoadingPolicies ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : filteredPolicies.length === 0 ? (
            <div className="text-center py-12">
              <ShieldCheckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No security policies found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Policy
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPolicies.map((policy) => (
                    <tr key={policy.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                            <div className="text-sm text-gray-500 max-w-md">{policy.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {policy.category === 'access' && 'Access Control'}
                          {policy.category === 'authentication' && 'Authentication'}
                          {policy.category === 'data' && 'Data Security'}
                          {policy.category === 'compliance' && 'Compliance'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          policy.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {policy.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(policy.lastUpdated).toLocaleDateString()} by {policy.updatedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {policy.status === 'active' ? (
                          <button
                            onClick={() => handleUpdatePolicy(policy.id, 'inactive')}
                            className="text-red-600 hover:text-red-900 mr-4"
                          >
                            Disable
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdatePolicy(policy.id, 'active')}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Enable
                          </button>
                        )}
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Audits Content */}
      {activeTab === 'audits' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoadingAudits ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : filteredAudits.length === 0 ? (
            <div className="text-center py-12">
              <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No security audits found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User/IP
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAudits.map((audit) => (
                    <tr key={audit.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{audit.eventType}</div>
                            <div className="text-sm text-gray-500 max-w-md">{audit.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityBadge(audit.severity)}`}>
                          {audit.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(audit.timestamp).toLocaleDateString()} {new Date(audit.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{audit.user}</div>
                        <div className="text-xs">{audit.ipAddress}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {audit.resolved ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                            Resolved
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                            Open
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!audit.resolved && (
                          <button
                            onClick={() => handleResolveAudit(audit.id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Resolve
                          </button>
                        )}
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SecurityManagement;
