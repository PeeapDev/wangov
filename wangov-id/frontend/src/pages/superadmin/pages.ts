// SuperAdmin Dashboard Pages Configuration
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

export const superAdminPages: PageConfig[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/superadmin-dashboard',
    icon: 'HomeIcon',
    description: 'System overview and analytics',
    component: 'SuperAdminDashboard'
  },
  {
    id: 'user-management',
    title: 'User Management',
    path: '/superadmin-dashboard/users',
    icon: 'UsersIcon',
    description: 'Manage all system users',
    component: 'UserManagement',
    children: [
      {
        id: 'citizens',
        title: 'Citizens',
        path: '/superadmin-dashboard/users/citizens',
        icon: 'UserIcon',
        description: 'Manage citizen accounts',
        component: 'CitizenManagement'
      },
      {
        id: 'admins',
        title: 'Administrators',
        path: '/superadmin-dashboard/users/admins',
        icon: 'ShieldCheckIcon',
        description: 'Manage admin accounts',
        component: 'AdminManagement'
      },
      {
        id: 'organizations',
        title: 'Organizations',
        path: '/superadmin-dashboard/users/organizations',
        icon: 'BuildingOfficeIcon',
        description: 'Manage organization accounts',
        component: 'OrganizationManagement'
      },
      {
        id: 'roles',
        title: 'Roles & Permissions',
        path: '/superadmin-dashboard/users/roles',
        icon: 'KeyIcon',
        description: 'Manage user roles and permissions',
        component: 'RoleManagement'
      }
    ]
  },
  {
    id: 'system',
    title: 'System Management',
    path: '/superadmin-dashboard/system',
    icon: 'CogIcon',
    description: 'System configuration and monitoring',
    component: 'SystemManagement',
    children: [
      {
        id: 'settings',
        title: 'System Settings',
        path: '/superadmin-dashboard/system/settings',
        icon: 'AdjustmentsHorizontalIcon',
        description: 'Configure system settings',
        component: 'SystemSettings'
      },
      {
        id: 'monitoring',
        title: 'System Monitoring',
        path: '/superadmin-dashboard/system/monitoring',
        icon: 'ChartBarIcon',
        description: 'Monitor system performance',
        component: 'SystemMonitoring'
      },
      {
        id: 'logs',
        title: 'Audit Logs',
        path: '/superadmin-dashboard/system/logs',
        icon: 'DocumentTextIcon',
        description: 'View system audit logs',
        component: 'AuditLogs'
      }
    ]
  },
  {
    id: 'security',
    title: 'Security',
    path: '/superadmin-dashboard/security',
    icon: 'ShieldExclamationIcon',
    description: 'Security management and monitoring',
    component: 'SecurityManagement',
    children: [
      {
        id: 'access-control',
        title: 'Access Control',
        path: '/superadmin-dashboard/security/access-control',
        icon: 'LockClosedIcon',
        description: 'Manage access control policies',
        component: 'AccessControl'
      },
      {
        id: 'api-keys',
        title: 'API Keys',
        path: '/superadmin-dashboard/security/api-keys',
        icon: 'KeyIcon',
        description: 'Manage API keys and tokens',
        component: 'ApiKeyManagement'
      }
    ]
  },
  {
    id: 'reports',
    title: 'Reports',
    path: '/superadmin-dashboard/reports',
    icon: 'DocumentChartBarIcon',
    description: 'System reports and analytics',
    component: 'Reports'
  },
  {
    id: 'profile',
    title: 'Profile',
    path: '/superadmin-dashboard/profile',
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
  return findPage(superAdminPages);
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
  return flattenPages(superAdminPages);
};
