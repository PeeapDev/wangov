// Organization Dashboard Pages Configuration
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

export const organizationPages: PageConfig[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/organization',
    icon: 'HomeIcon',
    description: 'Organization dashboard overview',
    component: 'OrganizationDashboard'
  },
  {
    id: 'applications',
    title: 'Applications',
    path: '/organization/applications',
    icon: 'RectangleStackIcon',
    description: 'Manage your applications',
    component: 'ApplicationManagement',
    children: [
      {
        id: 'app-list',
        title: 'My Applications',
        path: '/organization/applications/list',
        icon: 'QueueListIcon',
        description: 'View all your applications',
        component: 'ApplicationList'
      },
      {
        id: 'create-app',
        title: 'Create Application',
        path: '/organization/applications/create',
        icon: 'PlusCircleIcon',
        description: 'Create a new application',
        component: 'CreateApplication'
      }
    ]
  },
  {
    id: 'api-integration',
    title: 'API Integration',
    path: '/organization/api',
    icon: 'KeyIcon',
    description: 'API keys and data exchange integration',
    component: 'ApiIntegration',
    children: [
      {
        id: 'api-keys',
        title: 'API Keys',
        path: '/organization/api/keys',
        icon: 'IdentificationIcon',
        description: 'Manage your API keys for data exchange',
        component: 'ApiKeys'
      },
      {
        id: 'webhooks',
        title: 'Webhooks',
        path: '/organization/api/webhooks',
        icon: 'BoltIcon',
        description: 'Configure webhook endpoints',
        component: 'Webhooks'
      }
    ]
  },
  {
    id: 'sso-management',
    title: 'SSO Management',
    path: '/organization/sso',
    icon: 'ShieldCheckIcon',
    description: 'Single Sign-On configuration per business',
    component: 'BusinessSSOManagement'
  },
  {
    id: 'sandbox',
    title: 'Developer Sandbox',
    path: '/organization/sandbox',
    icon: 'CodeBracketIcon',
    description: 'Test and develop integrations',
    component: 'DeveloperSandbox',
    children: [
      {
        id: 'api-explorer',
        title: 'API Explorer',
        path: '/organization/sandbox/api-explorer',
        icon: 'GlobeAltIcon',
        description: 'Explore and test API endpoints',
        component: 'ApiExplorer'
      },
      {
        id: 'documentation',
        title: 'Documentation',
        path: '/organization/sandbox/docs',
        icon: 'DocumentTextIcon',
        description: 'Integration documentation and guides',
        component: 'Documentation'
      },
      {
        id: 'code-samples',
        title: 'Code Samples',
        path: '/organization/sandbox/samples',
        icon: 'CodeBracketSquareIcon',
        description: 'Sample code and SDKs',
        component: 'CodeSamples'
      },
      {
        id: 'testing-tools',
        title: 'Testing Tools',
        path: '/organization/sandbox/testing',
        icon: 'WrenchScrewdriverIcon',
        description: 'Testing and debugging tools',
        component: 'TestingTools'
      }
    ]
  },
  {
    id: 'services',
    title: 'Services',
    path: '/organization/services',
    icon: 'CogIcon',
    description: 'Manage organization services',
    component: 'ServiceManagement',
    children: [
      {
        id: 'service-catalog',
        title: 'Service Catalog',
        path: '/organization/services/catalog',
        icon: 'QueueListIcon',
        description: 'Available services for citizens',
        component: 'ServiceCatalog'
      },
      {
        id: 'service-requests',
        title: 'Service Requests',
        path: '/organization/services/requests',
        icon: 'InboxIcon',
        description: 'Manage incoming service requests',
        component: 'ServiceRequests'
      }
    ]
  },
  {
    id: 'users',
    title: 'User Management',
    path: '/organization/users',
    icon: 'UsersIcon',
    description: 'Manage organization users',
    component: 'UserManagement',
    children: [
      {
        id: 'staff',
        title: 'Staff Members',
        path: '/organization/users/staff',
        icon: 'UserGroupIcon',
        description: 'Manage organization staff',
        component: 'StaffManagement'
      },
      {
        id: 'roles',
        title: 'Roles & Permissions',
        path: '/organization/users/roles',
        icon: 'ShieldExclamationIcon',
        description: 'Manage user roles and permissions',
        component: 'RoleManagement'
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics',
    path: '/organization/analytics',
    icon: 'ChartBarIcon',
    description: 'View usage analytics and reports',
    component: 'Analytics'
  },
  {
    id: 'settings',
    title: 'Settings',
    path: '/organization/settings',
    icon: 'AdjustmentsHorizontalIcon',
    description: 'Organization settings and configuration',
    component: 'Settings'
  },
  {
    id: 'profile',
    title: 'Profile',
    path: '/organization/profile',
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
  return findPage(organizationPages);
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
  return flattenPages(organizationPages);
};
