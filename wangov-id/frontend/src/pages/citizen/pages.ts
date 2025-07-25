// Citizen Dashboard Pages Configuration
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

export const citizenPages: PageConfig[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/citizen',
    icon: 'HomeIcon',
    description: 'Personal dashboard overview',
    component: 'CitizenDashboard'
  },
  {
    id: 'profile',
    title: 'My Profile',
    path: '/citizen/profile',
    icon: 'UserCircleIcon',
    description: 'Manage your personal profile',
    component: 'Profile',
    children: [
      {
        id: 'personal-info',
        title: 'Personal Information',
        path: '/citizen/profile/personal',
        icon: 'UserIcon',
        description: 'Update personal information',
        component: 'PersonalInfo'
      },
      {
        id: 'contact-info',
        title: 'Contact Information',
        path: '/citizen/profile/contact',
        icon: 'PhoneIcon',
        description: 'Update contact details',
        component: 'ContactInfo'
      },
      {
        id: 'security',
        title: 'Security Settings',
        path: '/citizen/profile/security',
        icon: 'LockClosedIcon',
        description: 'Manage password and security',
        component: 'SecuritySettings'
      }
    ]
  },
  {
    id: 'documents',
    title: 'My Documents',
    path: '/citizen/documents',
    icon: 'DocumentIcon',
    description: 'View and manage your documents',
    component: 'DocumentManagement',
    children: [
      {
        id: 'identity-documents',
        title: 'Identity Documents',
        path: '/citizen/documents/identity',
        icon: 'IdentificationIcon',
        description: 'National ID and identity documents',
        component: 'IdentityDocuments'
      },
      {
        id: 'certificates',
        title: 'Certificates',
        path: '/citizen/documents/certificates',
        icon: 'AcademicCapIcon',
        description: 'Educational and professional certificates',
        component: 'Certificates'
      },
      {
        id: 'licenses',
        title: 'Licenses & Permits',
        path: '/citizen/documents/licenses',
        icon: 'DocumentCheckIcon',
        description: 'Government licenses and permits',
        component: 'Licenses'
      }
    ]
  },
  {
    id: 'services',
    title: 'Government Services',
    path: '/citizen/services',
    icon: 'CogIcon',
    description: 'Access government services',
    component: 'ServiceAccess',
    children: [
      {
        id: 'available-services',
        title: 'Available Services',
        path: '/citizen/services/available',
        icon: 'QueueListIcon',
        description: 'Browse available government services',
        component: 'AvailableServices'
      },
      {
        id: 'my-applications',
        title: 'My Applications',
        path: '/citizen/services/applications',
        icon: 'DocumentDuplicateIcon',
        description: 'Track your service applications',
        component: 'MyApplications'
      },
      {
        id: 'service-history',
        title: 'Service History',
        path: '/citizen/services/history',
        icon: 'ClockIcon',
        description: 'View your service history',
        component: 'ServiceHistory'
      }
    ]
  },
  {
    id: 'payments',
    title: 'Payments',
    path: '/citizen/payments',
    icon: 'CreditCardIcon',
    description: 'Manage payments and fees',
    component: 'PaymentManagement',
    children: [
      {
        id: 'payment-history',
        title: 'Payment History',
        path: '/citizen/payments/history',
        icon: 'BanknotesIcon',
        description: 'View payment history',
        component: 'PaymentHistory'
      },
      {
        id: 'pending-payments',
        title: 'Pending Payments',
        path: '/citizen/payments/pending',
        icon: 'ExclamationTriangleIcon',
        description: 'View and pay pending fees',
        component: 'PendingPayments'
      }
    ]
  },
  {
    id: 'notifications',
    title: 'Notifications',
    path: '/citizen/notifications',
    icon: 'BellIcon',
    description: 'View your notifications',
    component: 'Notifications',
    children: [
      {
        id: 'all-notifications',
        title: 'All Notifications',
        path: '/citizen/notifications/all',
        icon: 'InboxIcon',
        description: 'View all notifications',
        component: 'AllNotifications'
      },
      {
        id: 'notification-settings',
        title: 'Notification Settings',
        path: '/citizen/notifications/settings',
        icon: 'AdjustmentsHorizontalIcon',
        description: 'Manage notification preferences',
        component: 'NotificationSettings'
      }
    ]
  },
  {
    id: 'support',
    title: 'Help & Support',
    path: '/citizen/support',
    icon: 'QuestionMarkCircleIcon',
    description: 'Get help and support',
    component: 'Support',
    children: [
      {
        id: 'faq',
        title: 'FAQ',
        path: '/citizen/support/faq',
        icon: 'ChatBubbleLeftRightIcon',
        description: 'Frequently asked questions',
        component: 'FAQ'
      },
      {
        id: 'contact-support',
        title: 'Contact Support',
        path: '/citizen/support/contact',
        icon: 'PhoneIcon',
        description: 'Contact customer support',
        component: 'ContactSupport'
      },
      {
        id: 'feedback',
        title: 'Feedback',
        path: '/citizen/support/feedback',
        icon: 'ChatBubbleBottomCenterTextIcon',
        description: 'Provide feedback',
        component: 'Feedback'
      }
    ]
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
  return findPage(citizenPages);
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
  return flattenPages(citizenPages);
};
