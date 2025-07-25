import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ClockIcon,
  ServerIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  source: string;
  message: string;
  details?: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
}

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        setLogs([
          {
            id: '1',
            timestamp: '2024-02-10T15:45:30Z',
            level: 'info',
            source: 'auth',
            message: 'User login successful',
            userId: 'user123',
            userEmail: 'admin@wangov.sl',
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          {
            id: '2',
            timestamp: '2024-02-10T14:30:15Z',
            level: 'warning',
            source: 'api',
            message: 'Rate limit approached',
            details: 'API endpoint /api/v1/citizens is approaching rate limit of 100 requests/minute',
            ipAddress: '192.168.1.5',
            userAgent: 'PostmanRuntime/7.29.0'
          },
          {
            id: '3',
            timestamp: '2024-02-10T14:28:45Z',
            level: 'error',
            source: 'database',
            message: 'Database connection error',
            details: 'Failed to connect to database: Connection timeout after 30 seconds',
          },
          {
            id: '4',
            timestamp: '2024-02-10T13:15:20Z',
            level: 'info',
            source: 'system',
            message: 'System backup completed',
            details: 'Full system backup completed successfully. Backup size: 2.3GB'
          },
          {
            id: '5',
            timestamp: '2024-02-10T12:45:10Z',
            level: 'debug',
            source: 'api',
            message: 'API request processed',
            details: 'GET /api/v1/organizations completed in 320ms',
            userId: 'user456',
            userEmail: 'organization@example.com',
            ipAddress: '192.168.2.10'
          },
          {
            id: '6',
            timestamp: '2024-02-10T11:30:05Z',
            level: 'error',
            source: 'auth',
            message: 'Failed login attempt',
            details: 'Multiple failed login attempts detected. Account temporarily locked.',
            userEmail: 'john.doe@example.com',
            ipAddress: '192.168.3.15',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
          },
          {
            id: '7',
            timestamp: '2024-02-10T10:20:30Z',
            level: 'warning',
            source: 'storage',
            message: 'Storage capacity warning',
            details: 'Document storage is at 85% capacity. Consider cleanup or expansion.'
          },
          {
            id: '8',
            timestamp: '2024-02-10T09:15:45Z',
            level: 'info',
            source: 'system',
            message: 'System update available',
            details: 'New system update v2.3.5 is available for installation'
          }
        ]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      toast.error('Failed to load system logs');
      setIsLoading(false);
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'debug':
        return <DocumentTextIcon className="w-5 h-5 text-gray-500" />;
      default:
        return <DocumentTextIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getLevelBadge = (level: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (level) {
      case 'info':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'debug':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getSourceBadge = (source: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (source) {
      case 'auth':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'api':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'database':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'system':
        return `${baseClasses} bg-indigo-100 text-indigo-800`;
      case 'storage':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const toggleLogDetails = (id: string) => {
    if (expandedLog === id) {
      setExpandedLog(null);
    } else {
      setExpandedLog(id);
    }
  };

  const handleExportLogs = () => {
    toast.success('Logs export initiated');
    // In a real app, this would trigger a download
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilterLevel('all');
    setFilterSource('all');
    setDateRange({ from: '', to: '' });
  };

  const getUniqueSources = () => {
    const sources = logs.map(log => log.source);
    return ['all', ...new Set(sources)];
  };

  // Apply all filters
  const filteredLogs = logs
    .filter(log => filterLevel === 'all' || log.level === filterLevel)
    .filter(log => filterSource === 'all' || log.source === filterSource)
    .filter(log => {
      if (dateRange.from && new Date(log.timestamp) < new Date(dateRange.from)) {
        return false;
      }
      if (dateRange.to && new Date(log.timestamp) > new Date(dateRange.to)) {
        return false;
      }
      return true;
    })
    .filter(log => 
      searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase())
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
          <DocumentTextIcon className="w-8 h-8 mr-3 text-green-600" />
          System Logs
        </h1>
        <p className="text-gray-600 mt-1">View and analyze system logs and events</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <InformationCircleIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Info Logs</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(log => log.level === 'info').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(log => log.level === 'warning').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(log => log.level === 'error').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ServerIcon className="w-6 h-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow border p-4 mb-6">
        <div className="flex flex-col space-y-4">
          {/* Top row - search and buttons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-green-500 focus:border-green-500" 
                placeholder="Search logs by message or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                <FunnelIcon className="w-5 h-5 mr-2 text-gray-500" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <button
                onClick={handleExportLogs}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                <ArrowDownTrayIcon className="w-5 h-5 mr-2 text-gray-500" />
                Export Logs
              </button>
              <button
                onClick={handleClearSearch}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Filters row */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              {/* Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Log Level</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                >
                  <option value="all">All Levels</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="debug">Debug</option>
                </select>
              </div>

              {/* Source Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                >
                  {getUniqueSources().map(source => (
                    <option key={source} value={source}>
                      {source === 'all' ? 'All Sources' : source.charAt(0).toUpperCase() + source.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="datetime-local"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="datetime-local"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
              <p className="text-gray-600">No logs match your current filter settings</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr className={expandedLog === log.id ? 'bg-gray-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getLevelIcon(log.level)}
                          <span className={`${getLevelBadge(log.level)} ml-2`}>
                            {log.level.charAt(0).toUpperCase() + log.level.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getSourceBadge(log.source)}>
                          {log.source.charAt(0).toUpperCase() + log.source.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-lg truncate">{log.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => toggleLogDetails(log.id)}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                        >
                          Details
                          {expandedLog === log.id ? (
                            <ChevronUpIcon className="w-5 h-5 ml-1" />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5 ml-1" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedLog === log.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="px-6 py-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {log.details && (
                              <div className="col-span-1 md:col-span-2">
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Details:</h4>
                                <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded">{log.details}</p>
                              </div>
                            )}
                            {log.userId && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">User ID:</h4>
                                <p className="text-sm text-gray-600">{log.userId}</p>
                              </div>
                            )}
                            {log.userEmail && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">User Email:</h4>
                                <p className="text-sm text-gray-600">{log.userEmail}</p>
                              </div>
                            )}
                            {log.ipAddress && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">IP Address:</h4>
                                <p className="text-sm text-gray-600">{log.ipAddress}</p>
                              </div>
                            )}
                            {log.userAgent && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">User Agent:</h4>
                                <p className="text-sm text-gray-600 truncate">{log.userAgent}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination - simplified */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredLogs.length}</span> of{' '}
              <span className="font-medium">{filteredLogs.length}</span> results
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

export default SystemLogs;
