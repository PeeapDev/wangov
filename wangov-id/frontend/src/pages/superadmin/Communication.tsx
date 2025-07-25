import React, { useState, useEffect } from 'react';
import {
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  BellIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'notification';
  subject?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  variables?: string[];
  isActive: boolean;
}

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'notification';
  templateId: string;
  templateName: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'cancelled';
  audience: string;
  recipientCount: number;
  sentCount?: number;
  deliveredCount?: number;
  openedCount?: number;
  clickedCount?: number;
  scheduledAt?: string;
  sentAt?: string;
  completedAt?: string;
}

const Communication: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'campaigns' | 'logs'>('templates');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API calls
      setTimeout(() => {
        if (activeTab === 'templates') {
          setTemplates([
            {
              id: '1',
              name: 'ID Verification Approved',
              type: 'email',
              subject: 'Your ID Verification was Approved',
              content: 'Dear {{name}}, Your ID verification has been approved. You can now access all government services.',
              createdAt: '2024-01-15T10:30:00Z',
              updatedAt: '2024-01-20T14:15:00Z',
              variables: ['name', 'id_number', 'verification_date'],
              isActive: true,
            },
            {
              id: '2',
              name: 'Organization Registration',
              type: 'email',
              subject: 'Organization Registration Confirmation',
              content: 'Dear {{org_name}}, Your organization has been registered successfully with ID: {{org_id}}.',
              createdAt: '2024-01-10T09:45:00Z',
              updatedAt: '2024-01-10T09:45:00Z',
              variables: ['org_name', 'org_id', 'admin_name'],
              isActive: true,
            },
            {
              id: '3',
              name: 'Password Reset',
              type: 'email',
              subject: 'Password Reset Request',
              content: 'Click the following link to reset your password: {{reset_link}}. This link expires in 30 minutes.',
              createdAt: '2023-12-05T11:20:00Z',
              updatedAt: '2024-01-05T16:30:00Z',
              variables: ['name', 'reset_link', 'expiry_time'],
              isActive: true,
            },
            {
              id: '4',
              name: 'Verification Code',
              type: 'sms',
              content: 'Your WanGov verification code is: {{code}}. It expires in 10 minutes.',
              createdAt: '2024-01-02T13:15:00Z',
              updatedAt: '2024-01-02T13:15:00Z',
              variables: ['code'],
              isActive: true,
            },
            {
              id: '5',
              name: 'System Maintenance',
              type: 'notification',
              content: 'System will be down for maintenance on {{date}} from {{start_time}} to {{end_time}}.',
              createdAt: '2023-12-20T08:45:00Z',
              updatedAt: '2023-12-20T08:45:00Z',
              variables: ['date', 'start_time', 'end_time'],
              isActive: true,
            }
          ]);
        } else if (activeTab === 'campaigns') {
          setCampaigns([
            {
              id: '1',
              name: 'ID Renewal Reminder',
              type: 'email',
              templateId: '1',
              templateName: 'ID Renewal',
              status: 'completed',
              audience: 'Citizens with ID expiring in 30 days',
              recipientCount: 1250,
              sentCount: 1250,
              deliveredCount: 1240,
              openedCount: 856,
              clickedCount: 634,
              scheduledAt: '2024-01-15T08:00:00Z',
              sentAt: '2024-01-15T08:00:00Z',
              completedAt: '2024-01-15T08:45:00Z',
            },
            {
              id: '2',
              name: 'Business Tax Deadline',
              type: 'email',
              templateId: '2',
              templateName: 'Tax Reminder',
              status: 'scheduled',
              audience: 'Registered Businesses',
              recipientCount: 312,
              scheduledAt: '2024-02-20T09:00:00Z',
            },
            {
              id: '3',
              name: 'New Portal Features',
              type: 'notification',
              templateId: '5',
              templateName: 'Feature Announcement',
              status: 'draft',
              audience: 'All Active Users',
              recipientCount: 25400,
            },
            {
              id: '4',
              name: 'Emergency Alert',
              type: 'sms',
              templateId: '4',
              templateName: 'Emergency Notification',
              status: 'sending',
              audience: 'All Citizens in Western Region',
              recipientCount: 8500,
              sentCount: 5600,
              deliveredCount: 5590,
              scheduledAt: '2024-02-10T18:00:00Z',
              sentAt: '2024-02-10T18:00:00Z',
            },
            {
              id: '5',
              name: 'System Upgrade Notification',
              type: 'email',
              templateId: '5',
              templateName: 'System Maintenance',
              status: 'cancelled',
              audience: 'All Users',
              recipientCount: 26750,
              scheduledAt: '2024-01-05T22:00:00Z',
            }
          ]);
        }
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load communication data');
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <EnvelopeIcon className="w-5 h-5 text-blue-500" />;
      case 'sms':
        return <PhoneIcon className="w-5 h-5 text-green-500" />;
      case 'notification':
        return <BellIcon className="w-5 h-5 text-purple-500" />;
      default:
        return <DocumentTextIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (type) {
      case 'email':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'sms':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'notification':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'draft':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'scheduled':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'sending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleCreateTemplate = () => {
    setShowCreateModal(true);
    toast.success('Template creation would open a form modal');
    // In a real app, we'd show a modal form for template creation
    setShowCreateModal(false);
  };

  const handleEditTemplate = (id: string) => {
    toast.success(`Editing template ${id}`);
    // In a real app, we'd show a modal form for template editing
  };

  const handleDeleteTemplate = (id: string) => {
    toast.success(`Template ${id} deleted`);
    // In a real app, we'd confirm and then delete from the API
  };

  const handleCreateCampaign = () => {
    toast.success('Campaign creation would open a form modal');
    // In a real app, we'd show a modal form for campaign creation
  };

  // Filter templates based on search and type
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.subject && template.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || template.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Filter campaigns based on search and type
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = searchTerm === '' || 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.audience.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || campaign.type === filterType;
    
    return matchesSearch && matchesType;
  });

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
          <ChatBubbleLeftRightIcon className="w-8 h-8 mr-3 text-green-600" />
          Communication Center
        </h1>
        <p className="text-gray-600 mt-1">Manage communication templates, campaigns, and logs</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              Templates
            </div>
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'campaigns'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <PaperAirplaneIcon className="w-5 h-5 mr-2" />
              Campaigns
            </div>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              Logs
            </div>
          </button>
        </nav>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow border p-4 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-green-500 focus:border-green-500" 
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Type Filter */}
            <div className="flex items-center">
              <FunnelIcon className="w-5 h-5 text-gray-400 mr-2" />
              <select
                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="notification">Notification</option>
              </select>
            </div>

            {/* Create Button */}
            <button
              onClick={activeTab === 'templates' ? handleCreateTemplate : handleCreateCampaign}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create {activeTab === 'templates' ? 'Template' : activeTab === 'campaigns' ? 'Campaign' : 'Filter'}
            </button>
          </div>
        </div>
      </div>

      {/* Content Based on Active Tab */}
      {activeTab === 'templates' && (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject/Content
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTemplates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No templates found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredTemplates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {template.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTypeIcon(template.type)}
                          <span className={`${getTypeBadge(template.type)} ml-2`}>
                            {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="max-w-xs truncate">
                          {template.subject ? (
                            <>
                              <span className="font-medium">{template.subject}</span>
                              <span className="block text-xs mt-1 text-gray-400 truncate">{template.content}</span>
                            </>
                          ) : (
                            template.content
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(template.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          template.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditTemplate(template.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Audience
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipients
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule/Sent
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No campaigns found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div>
                          {campaign.name}
                          <div className="text-xs text-gray-500">
                            Template: {campaign.templateName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTypeIcon(campaign.type)}
                          <span className={`${getTypeBadge(campaign.type)} ml-2`}>
                            {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(campaign.status)}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="max-w-xs truncate">
                          {campaign.audience}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          {campaign.recipientCount.toLocaleString()}
                          {campaign.sentCount && (
                            <div className="text-xs text-gray-400">
                              Sent: {campaign.sentCount.toLocaleString()} ({Math.round((campaign.sentCount / campaign.recipientCount) * 100)}%)
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.scheduledAt ? (
                          <div>
                            {new Date(campaign.scheduledAt).toLocaleDateString()}
                            <div className="text-xs text-gray-400">
                              {new Date(campaign.scheduledAt).toLocaleTimeString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not scheduled</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="text-center py-8">
            <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Communication Logs</h3>
            <p className="text-gray-500 mb-6">Track delivery status, open rates, and user engagement</p>
            <p className="text-sm text-gray-400">
              This section would include detailed logs of all communications sent,<br />
              including delivery status, open rates, click-through rates, and other metrics.
            </p>
          </div>
        </div>
      )}

      {/* Pagination - simplified */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">
                {activeTab === 'templates' ? filteredTemplates.length : filteredCampaigns.length}
              </span> of{' '}
              <span className="font-medium">
                {activeTab === 'templates' ? filteredTemplates.length : filteredCampaigns.length}
              </span> results
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

export default Communication;
