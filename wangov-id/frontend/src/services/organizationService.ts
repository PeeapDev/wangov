import { apiClient } from './apiClient';

export interface OrganizationPermissions {
  identityVerification: boolean;
  apiAccess: boolean;
  staffManagement: boolean;
  invoicing: boolean;
  reporting: boolean;
}

export interface Organization {
  id: string;
  name: string;
  type: 'government' | 'private' | 'ngo' | 'education';
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  verificationStatus: 'verified' | 'unverified' | 'in-progress';
  verified?: boolean;
  permissions?: OrganizationPermissions;
  membersCount: number;
  businessesCount: number;
  description?: string;
  logo?: string;
  website?: string;
  contactPerson?: string;
  notes?: string[];
  createdAt: string;
  updatedAt: string;
}

const MOCK_DELAY = 800;
const LOCAL_STORAGE_KEY = 'mockOrganizations';

// Mock organizations
const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Ministry of Education',
    type: 'government',
    email: 'info@education.gov.sl',
    phone: '+232-76-123456',
    address: 'New England, Freetown, Sierra Leone',
    registrationNumber: 'GOV-EDU-001',
    status: 'active',
    verificationStatus: 'verified',
    verified: true,
    permissions: {
      identityVerification: true,
      apiAccess: true,
      staffManagement: true,
      invoicing: true,
      reporting: true
    },
    membersCount: 145,
    businessesCount: 3,
    description: 'The Ministry of Education is responsible for overseeing the educational system of Sierra Leone, from primary through tertiary levels.',
    logo: 'https://example.com/logos/moe.png',
    website: 'https://education.gov.sl',
    contactPerson: 'Dr. John Smith',
    notes: [
      'Verification approved on 2023-12-15 by admin@wangov.sl',
      'Organization has completed all required documentation and verification steps'
    ],
    createdAt: '2023-05-10T09:00:00Z',
    updatedAt: '2023-12-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Sierra Leone Commercial Bank',
    type: 'private',
    email: 'contact@slcb.sl',
    phone: '+232-77-456789',
    address: 'Siaka Stevens Street, Freetown',
    registrationNumber: 'PRI-FIN-042',
    status: 'active',
    verificationStatus: 'verified',
    verified: true,
    permissions: {
      identityVerification: true,
      apiAccess: true,
      staffManagement: true,
      invoicing: false,
      reporting: true
    },
    membersCount: 78,
    businessesCount: 1,
    description: 'Sierra Leone Commercial Bank is one of the largest commercial banks in Sierra Leone, offering a wide range of financial services.',
    logo: 'https://example.com/logos/slcb.png',
    website: 'https://slcb.sl',
    contactPerson: 'Mrs. Aminata Bangura',
    notes: [
      'Verification approved on 2023-11-05 by admin@wangov.sl',
      'Conditional approval for limited API access'
    ],
    createdAt: '2023-06-22T10:15:00Z',
    updatedAt: '2023-11-05T16:45:00Z'
  },
  {
    id: '3',
    name: 'Save the Children SL',
    type: 'ngo',
    email: 'office@savechildren.sl',
    phone: '+232-78-789012',
    address: 'Lumley Beach Road, Freetown',
    registrationNumber: 'NGO-HUM-108',
    status: 'active',
    verificationStatus: 'verified',
    verified: true,
    permissions: {
      identityVerification: true,
      apiAccess: false,
      staffManagement: true,
      invoicing: false,
      reporting: true
    },
    membersCount: 34,
    businessesCount: 0,
    description: 'Save the Children works to improve the lives of children through better education, health care, and economic opportunities.',
    logo: 'https://example.com/logos/savechildren.png',
    website: 'https://savechildren.sl',
    contactPerson: 'Mr. Peter Johnson',
    notes: [
      'Verification approved on 2023-10-28 by admin@wangov.sl',
      'Limited to identity verification only, no API access granted'
    ],
    createdAt: '2023-07-15T13:20:00Z',
    updatedAt: '2023-10-28T09:10:00Z'
  },
  {
    id: '4',
    name: 'Fourah Bay College',
    type: 'education',
    email: 'admin@fbc.edu.sl',
    phone: '+232-79-345678',
    address: 'Mount Aureol, Freetown',
    registrationNumber: 'EDU-UNI-015',
    status: 'active',
    verificationStatus: 'verified',
    verified: true,
    permissions: {
      identityVerification: true,
      apiAccess: false,
      staffManagement: false,
      invoicing: false,
      reporting: true
    },
    membersCount: 67,
    businessesCount: 2,
    description: 'Fourah Bay College is the oldest university in West Africa and serves as a premier institution for higher education in Sierra Leone.',
    logo: 'https://example.com/logos/fbc.png',
    website: 'https://fbc.edu.sl',
    contactPerson: 'Prof. Mary Williams',
    notes: [
      'Verification approved on 2023-09-19 by admin@wangov.sl',
      'Approved for student verification purposes'
    ],
    createdAt: '2023-04-03T11:45:00Z',
    updatedAt: '2023-09-19T15:30:00Z'
  },
  {
    id: '5',
    name: 'TechHub Sierra Leone',
    type: 'private',
    email: 'info@techhub.sl',
    phone: '+232-76-234567',
    address: 'Wilkinson Road, Freetown',
    registrationNumber: 'PRI-TECH-087',
    status: 'pending',
    verificationStatus: 'in-progress',
    verified: false,
    permissions: {
      identityVerification: false,
      apiAccess: false,
      staffManagement: false,
      invoicing: false,
      reporting: false
    },
    membersCount: 12,
    businessesCount: 0,
    description: 'TechHub is a technology incubator and co-working space for startups and tech entrepreneurs in Sierra Leone.',
    logo: 'https://example.com/logos/techhub.png',
    website: 'https://techhub.sl',
    contactPerson: 'Ms. Fatima Sesay',
    notes: [
      'Initial application received on 2024-01-05',
      'Documentation review in progress'
    ],
    createdAt: '2024-01-05T08:30:00Z',
    updatedAt: '2024-01-05T08:30:00Z'
  }
];

// Initialize local storage with mock data if it doesn't exist
const initializeLocalStorage = () => {
  if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockOrganizations));
  }
};

// Get organizations from local storage or mock data
const getOrganizationsFromStorage = (): Organization[] => {
  initializeLocalStorage();
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : mockOrganizations;
};

// Save organizations to local storage
const saveOrganizationsToStorage = (organizations: Organization[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(organizations));
};

// Organization service with mock implementation
const organizationService = {
  // Get all organizations
  getAllOrganizations: async (): Promise<Organization[]> => {
    try {
      // Try to fetch from API first
      const response = await apiClient.get('/organizations');
      return response.data;
    } catch (error) {
      console.log('Fallback to mock data for organizations');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getOrganizationsFromStorage());
        }, MOCK_DELAY);
      });
    }
  },

  // Get organization by ID
  getOrganizationById: async (id: string): Promise<Organization> => {
    try {
      const response = await apiClient.get(`/organizations/${id}`);
      return response.data;
    } catch (error) {
      console.log('Fallback to mock data for organization detail');
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const orgs = getOrganizationsFromStorage();
          const org = orgs.find(o => o.id === id);
          if (org) {
            resolve(org);
          } else {
            reject(new Error('Organization not found'));
          }
        }, MOCK_DELAY);
      });
    }
  },

  // Update organization verification status and permissions
  updateOrganizationVerification: async (
    id: string, 
    verificationStatus: 'verified' | 'unverified' | 'in-progress',
    permissions: OrganizationPermissions,
    notes?: string
  ): Promise<Organization> => {
    try {
      const response = await apiClient.patch(`/organizations/${id}/verification`, {
        verificationStatus,
        permissions,
        notes
      });
      return response.data;
    } catch (error) {
      console.log('Fallback to mock data for organization verification update');
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const orgs = getOrganizationsFromStorage();
          const orgIndex = orgs.findIndex(o => o.id === id);
          
          if (orgIndex !== -1) {
            const updatedOrg = {
              ...orgs[orgIndex],
              verificationStatus,
              verified: verificationStatus === 'verified',
              permissions,
              updatedAt: new Date().toISOString()
            };
            
            if (notes) {
              updatedOrg.notes = [...(updatedOrg.notes || []), notes];
            }
            
            orgs[orgIndex] = updatedOrg;
            saveOrganizationsToStorage(orgs);
            resolve(updatedOrg);
          } else {
            reject(new Error('Organization not found'));
          }
        }, MOCK_DELAY);
      });
    }
  },
  
  // Update organization status (active, inactive, suspended, pending)
  updateOrganizationStatus: async (id: string, status: Organization['status']): Promise<Organization> => {
    try {
      const response = await apiClient.patch(`/organizations/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.log('Fallback to mock data for organization status update');
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const orgs = getOrganizationsFromStorage();
          const orgIndex = orgs.findIndex(o => o.id === id);
          
          if (orgIndex !== -1) {
            const updatedOrg = {
              ...orgs[orgIndex],
              status,
              updatedAt: new Date().toISOString()
            };
            
            orgs[orgIndex] = updatedOrg;
            saveOrganizationsToStorage(orgs);
            resolve(updatedOrg);
          } else {
            reject(new Error('Organization not found'));
          }
        }, MOCK_DELAY);
      });
    }
  },
  
  // Check if current user's organization has specific permission
  checkOrganizationPermission: async (permission: keyof OrganizationPermissions): Promise<boolean> => {
    try {
      const response = await apiClient.get('/organizations/permissions');
      return response.data[permission] || false;
    } catch (error) {
      console.log('Fallback to mock data for permission check');
      
      return new Promise((resolve) => {
        setTimeout(() => {
          // Check if permissions are stored in local storage for the current user's org
          const orgProfile = localStorage.getItem('organizationProfile');
          
          if (orgProfile) {
            const profile = JSON.parse(orgProfile);
            if (profile.permissions && profile.permissions[permission] !== undefined) {
              resolve(profile.permissions[permission]);
              return;
            }
          }
          
          // Default permissions based on organization name in user profile
          const userJson = localStorage.getItem('user');
          if (userJson) {
            const user = JSON.parse(userJson);
            
            if (user?.organizationName) {
              const orgs = getOrganizationsFromStorage();
              const org = orgs.find(o => o.name === user.organizationName);
              
              if (org?.permissions && org.permissions[permission] !== undefined) {
                resolve(org.permissions[permission]);
                return;
              }
            }
          }
          
          // Default fallback
          const defaultPermissions: Record<keyof OrganizationPermissions, boolean> = {
            identityVerification: true,  // Most orgs have this by default
            apiAccess: false,           // Restricted by default
            staffManagement: true,      // Common feature
            invoicing: false,           // Advanced feature, restricted
            reporting: true             // Common feature
          };
          
          resolve(defaultPermissions[permission]);
        }, MOCK_DELAY);
      });
    }
  }
};

export default organizationService;
