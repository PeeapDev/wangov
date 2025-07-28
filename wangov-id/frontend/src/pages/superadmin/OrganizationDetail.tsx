import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  CheckCircleIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import organizationService, { Organization, OrganizationPermissions } from '../../services/organizationService';
import VerificationBadge from '../../components/shared/VerificationBadge';

const OrganizationDetail: React.FC = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [permissions, setPermissions] = useState<OrganizationPermissions>({
    identityVerification: false,
    apiAccess: false,
    staffManagement: false,
    invoicing: false,
    reporting: false
  });
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'unverified' | 'in-progress'>('unverified');

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        if (!orgId) {
          toast.error('Organization ID is missing');
          navigate('/superadmin-dashboard/organizations');
          return;
        }
        
        const org = await organizationService.getOrganizationById(orgId);
        setOrganization(org);
        setVerificationStatus(org.verificationStatus);
        
        if (org.permissions) {
          setPermissions(org.permissions);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch organization:', error);
        toast.error('Failed to load organization details');
        setIsLoading(false);
        navigate('/superadmin-dashboard/organizations');
      }
    };

    fetchOrganization();
  }, [orgId, navigate]);

  const handleSaveVerification = async () => {
    try {
      if (!organization) return;
      
      setIsSaving(true);

      // Format note text with timestamp if provided
      const noteWithTimestamp = noteText.trim() ? 
        `${new Date().toLocaleString()}: ${noteText}` : undefined;
      
      // Call the service to update verification status and permissions
      const updatedOrg = await organizationService.updateOrganizationVerification(
        organization.id,
        verificationStatus,
        permissions,
        noteWithTimestamp
      );
      
      // Update local state
      setOrganization(updatedOrg);
      setNoteText('');
      
      toast.success('Organization verification updated successfully');
    } catch (error) {
      console.error('Failed to update verification:', error);
      toast.error('Failed to update organization verification');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: Organization['status']) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'inactive':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'suspended':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XMarkIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Organization not found. The requested organization may have been removed or you may not have permission to view it.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/superadmin-dashboard/organizations')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Organizations
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Back button and header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => navigate('/superadmin-dashboard/organizations')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-2 sm:mb-0"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Organizations
          </button>
        </div>
        <div className="flex space-x-2">
          <span className={getStatusBadge(organization.status)}>
            Status: {organization.status.charAt(0).toUpperCase() + organization.status.slice(1)}
          </span>
          <div>
            <VerificationBadge status={organization.verificationStatus} showText={true} size="lg" />
          </div>
        </div>
      </div>

      {/* Organization Details Card */}
      <div className="bg-white shadow overflow-hidden rounded-lg mb-6 border">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{organization.name}</h2>
              <p className="text-sm text-gray-600">{organization.registrationNumber}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Organization Information</h3>
            <dl>
              <div className="py-2 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="text-sm text-gray-900 col-span-2">{organization.type.charAt(0).toUpperCase() + organization.type.slice(1)}</dd>
              </div>
              <div className="py-2 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900 col-span-2">{organization.email}</dd>
              </div>
              <div className="py-2 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="text-sm text-gray-900 col-span-2">{organization.phone}</dd>
              </div>
              <div className="py-2 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Website</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  {organization.website ? (
                    <a href={organization.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                      {organization.website}
                    </a>
                  ) : (
                    <span className="text-gray-500 italic">Not provided</span>
                  )}
                </dd>
              </div>
              <div className="py-2 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="text-sm text-gray-900 col-span-2">{organization.address}</dd>
              </div>
              <div className="py-2 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  {organization.contactPerson || <span className="text-gray-500 italic">Not provided</span>}
                </dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Metrics & Details</h3>
            <dl>
              <div className="py-2 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Members</dt>
                <dd className="text-sm text-gray-900 col-span-2">{organization.membersCount}</dd>
              </div>
              <div className="py-2 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Businesses</dt>
                <dd className="text-sm text-gray-900 col-span-2">{organization.businessesCount}</dd>
              </div>
              <div className="py-2 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Created On</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  {new Date(organization.createdAt).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </dd>
              </div>
              <div className="py-2 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  {new Date(organization.updatedAt).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </dd>
              </div>
              <div className="py-2 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  {organization.description || <span className="text-gray-500 italic">No description available</span>}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Verification Section */}
      <div className="bg-white shadow overflow-hidden rounded-lg mb-6 border">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <DocumentCheckIcon className="h-5 w-5 mr-2 text-green-600" />
            Verification & Permissions
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Update verification status and set permissions for this organization
          </p>
        </div>
        
        <div className="px-6 py-5">
          <div className="mb-6">
            <label className="text-base font-medium text-gray-900">Verification Status</label>
            <p className="text-sm text-gray-500 mb-2">
              Set the verification status for this organization
            </p>
            <div className="mt-2 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
              <div className="flex items-center">
                <input
                  id="verification-verified"
                  name="verification-status"
                  type="radio"
                  checked={verificationStatus === 'verified'}
                  onChange={() => setVerificationStatus('verified')}
                  className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                />
                <label htmlFor="verification-verified" className="ml-3 block text-sm font-medium text-gray-700">
                  Verified
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="verification-in-progress"
                  name="verification-status"
                  type="radio"
                  checked={verificationStatus === 'in-progress'}
                  onChange={() => setVerificationStatus('in-progress')}
                  className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                />
                <label htmlFor="verification-in-progress" className="ml-3 block text-sm font-medium text-gray-700">
                  In Progress
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="verification-unverified"
                  name="verification-status"
                  type="radio"
                  checked={verificationStatus === 'unverified'}
                  onChange={() => setVerificationStatus('unverified')}
                  className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                />
                <label htmlFor="verification-unverified" className="ml-3 block text-sm font-medium text-gray-700">
                  Unverified
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">Permissions</legend>
              <p className="text-sm text-gray-500 mb-4">
                Select the features and permissions for this organization
              </p>
              <div className="space-y-4">
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="permission-identity"
                      name="permission-identity"
                      type="checkbox"
                      checked={permissions.identityVerification}
                      onChange={(e) => setPermissions({...permissions, identityVerification: e.target.checked})}
                      className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="permission-identity" className="font-medium text-gray-700">Identity Verification</label>
                    <p className="text-gray-500">Allow organization to verify identities</p>
                  </div>
                </div>

                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="permission-api"
                      name="permission-api"
                      type="checkbox"
                      checked={permissions.apiAccess}
                      onChange={(e) => setPermissions({...permissions, apiAccess: e.target.checked})}
                      className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="permission-api" className="font-medium text-gray-700">API Access</label>
                    <p className="text-gray-500">Allow organization to use WanGov API</p>
                  </div>
                </div>

                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="permission-staff"
                      name="permission-staff"
                      type="checkbox"
                      checked={permissions.staffManagement}
                      onChange={(e) => setPermissions({...permissions, staffManagement: e.target.checked})}
                      className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="permission-staff" className="font-medium text-gray-700">Staff Management</label>
                    <p className="text-gray-500">Allow organization to manage staff users</p>
                  </div>
                </div>

                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="permission-invoicing"
                      name="permission-invoicing"
                      type="checkbox"
                      checked={permissions.invoicing}
                      onChange={(e) => setPermissions({...permissions, invoicing: e.target.checked})}
                      className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="permission-invoicing" className="font-medium text-gray-700">Invoicing</label>
                    <p className="text-gray-500">Allow organization to create and manage invoices</p>
                  </div>
                </div>

                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="permission-reporting"
                      name="permission-reporting"
                      type="checkbox"
                      checked={permissions.reporting}
                      onChange={(e) => setPermissions({...permissions, reporting: e.target.checked})}
                      className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="permission-reporting" className="font-medium text-gray-700">Reporting</label>
                    <p className="text-gray-500">Allow organization to access and generate reports</p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveVerification}
              disabled={isSaving}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4 mr-1" />
                  Save Verification
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetail;
