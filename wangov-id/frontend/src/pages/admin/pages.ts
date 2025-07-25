// Admin Dashboard Pages Configuration
export interface PageConfig {
  id: string;
  title: string;
  path: string;
  icon: string;
  description: string;
  component?: string;
  permissions?: string[];
  children?: PageConfig[];
}

export const adminPages: PageConfig[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/admin',
    icon: 'HomeIcon',
    description: 'Admin dashboard overview',
    component: 'AdminDashboard'
  },
  {
    id: 'citizens',
    title: 'Citizen Management',
    path: '/admin/citizens',
    icon: 'UsersIcon',
    description: 'Manage citizen accounts and verifications',
    component: 'CitizenManagement',
    children: [
      {
        id: 'citizen-list',
        title: 'All Citizens',
        path: '/admin/citizens/list',
        icon: 'UserGroupIcon',
        description: 'View all citizen accounts',
        component: 'CitizenList'
      },
      {
        id: 'verification-requests',
        title: 'Verification Requests',
        path: '/admin/citizens/verifications',
        icon: 'CheckBadgeIcon',
        description: 'Review citizen verification requests',
        component: 'VerificationRequests'
      },
      {
        id: 'citizen-reports',
        title: 'Citizen Reports',
        path: '/admin/citizens/reports',
        icon: 'DocumentChartBarIcon',
        description: 'Generate citizen reports',
        component: 'CitizenReports'
      }
    ]
  },
  {
    id: 'organizations',
    title: 'Organizations',
    path: '/admin/organizations',
    icon: 'BuildingOfficeIcon',
    description: 'Manage government organizations',
    component: 'OrganizationManagement',
    children: [
      {
        id: 'org-list',
        title: 'All Organizations',
        path: '/admin/organizations/list',
        icon: 'BuildingOffice2Icon',
        description: 'View all organizations',
        component: 'OrganizationList'
      },
      {
        id: 'org-registration',
        title: 'Registration Requests',
        path: '/admin/organizations/registration',
        icon: 'PlusCircleIcon',
        description: 'Review organization registration requests',
        component: 'OrganizationRegistration'
      }
    ]
  },
  {
    id: 'services',
    title: 'Government Services',
    path: '/admin/services',
    icon: 'CogIcon',
    description: 'Manage government services',
    component: 'ServiceManagement',
    children: [
      {
        id: 'service-catalog',
        title: 'Service Catalog',
        path: '/admin/services/catalog',
        icon: 'QueueListIcon',
        description: 'Manage available services',
        component: 'ServiceCatalog'
      },
      {
        id: 'service-requests',
        title: 'Service Requests',
        path: '/admin/services/requests',
        icon: 'InboxIcon',
        description: 'Process service requests',
        component: 'ServiceRequests'
      }
    ]
  },
  {
    id: 'documents',
    title: 'Document Management',
    path: '/admin/documents',
    icon: 'DocumentIcon',
    description: 'Manage official documents',
    component: 'DocumentManagement',
    children: [
      {
        id: 'document-templates',
        title: 'Document Templates',
        path: '/admin/documents/templates',
        icon: 'DocumentDuplicateIcon',
        description: 'Manage document templates',
        component: 'DocumentTemplates'
      },
      {
        id: 'issued-documents',
        title: 'Issued Documents',
        path: '/admin/documents/issued',
        icon: 'DocumentCheckIcon',
        description: 'View issued documents',
        component: 'IssuedDocuments'
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics',
    path: '/admin/analytics',
    icon: 'ChartBarIcon',
    description: 'View system analytics and reports',
    component: 'Analytics'
  },
  {
    id: 'profile',
    title: 'Profile',
    path: '/admin/profile',
    icon: 'UserCircleIcon',
    description: 'Manage your profile',
    component: 'Profile'
  }
];

export const getPageByPath = (path: string): PageConfig | undefined => {
  const findPage = (pages: PageConfig[]): PageConfig | undefined => {
    for (const page of pages) {
      if (page.path === path) return page;
      if (page.children) {
        const found = findPage(page.children);
        if (found) return found;
      }
    }
    return undefined;
  };
  return findPage(adminPages);
};

export const getAllPages = (): PageConfig[] => {
  const flattenPages = (pages: PageConfig[]): PageConfig[] => {
    let result: PageConfig[] = [];
    for (const page of pages) {
      result.push(page);
      if (page.children) {
        result = result.concat(flattenPages(page.children));
      }
    }
    return result;
  };
  return flattenPages(adminPages);
};
