// OAuth Configuration for WanGov SSO
module.exports = {
  // SSO Service Configuration
  sso: {
    domain: process.env.SSO_DOMAIN || 'sso.localhost',
    port: process.env.PORT || 3004,
    protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http'
  },

  // Registered OAuth Clients
  clients: {
    // WanGov Internal Services
    'wangov-citizen-portal': {
      name: 'WanGov Citizen Portal',
      domain: 'portal.wangov.sl',
      redirectUris: [
        'https://portal.wangov.sl/auth/callback',
        'http://localhost:3003/auth/callback' // Development only
      ],
      scopes: ['profile', 'email', 'nin'],
      trusted: true
    },
    'wangov-gov-portal': {
      name: 'WanGov Government Portal',
      domain: 'gov.wangov.sl',
      redirectUris: [
        'https://gov.wangov.sl/auth/callback',
        'http://localhost:3003/gov/auth/callback'
      ],
      scopes: ['profile', 'email', 'government_access'],
      trusted: true
    },
    'wangov-org-portal': {
      name: 'WanGov Organization Portal',
      domain: 'org.wangov.sl',
      redirectUris: [
        'https://org.wangov.sl/auth/callback',
        'http://localhost:3003/org/auth/callback'
      ],
      scopes: ['profile', 'email', 'organization_access'],
      trusted: true
    },
    'ncra-portal': {
      name: 'National Civil Registration Authority',
      domain: 'ncra.gov.sl',
      redirectUris: [
        'https://ncra.gov.sl/auth/callback',
        'http://localhost:3003/ncra/auth/callback'
      ],
      scopes: ['profile', 'email', 'nin', 'civil_registration'],
      trusted: true
    },

    // Third-party Services
    'africell-sl': {
      name: 'Africell Sierra Leone',
      domain: 'africell.sl',
      redirectUris: [
        'https://africell.sl/auth/wangov/callback',
        'https://my.africell.sl/login/callback',
        'http://127.0.0.1:8081' // Demo development
      ],
      scopes: ['profile', 'email', 'phone'],
      trusted: false
    },
    'orange-sl': {
      name: 'Orange Sierra Leone',
      domain: 'orange.sl',
      redirectUris: [
        'https://orange.sl/auth/wangov/callback',
        'https://my.orange.sl/sso/callback'
      ],
      scopes: ['profile', 'email', 'phone'],
      trusted: false
    },
    'rokel-bank': {
      name: 'Rokel Commercial Bank',
      domain: 'rokelbank.sl',
      redirectUris: [
        'https://online.rokelbank.sl/auth/callback',
        'https://mobile.rokelbank.sl/sso/wangov'
      ],
      scopes: ['profile', 'email', 'nin', 'verified_identity'],
      trusted: false
    },
    'sierra-leone-airlines': {
      name: 'Sierra Leone Airlines',
      domain: 'flysla.com',
      redirectUris: [
        'https://booking.flysla.com/auth/callback',
        'https://flysla.com/login/wangov/return'
      ],
      scopes: ['profile', 'email'],
      trusted: false
    },

    // Development/Testing
    'test-client': {
      name: 'Test Application',
      domain: 'localhost',
      redirectUris: [
        'http://localhost:3000/callback',
        'http://localhost:3001/auth/callback',
        'http://localhost:8080/callback'
      ],
      scopes: ['profile', 'email'],
      trusted: false
    }
  },

  // Available OAuth Scopes
  scopes: {
    'profile': {
      description: 'Access to basic profile information (name, date of birth)',
      data: ['firstName', 'lastName', 'dateOfBirth', 'placeOfBirth']
    },
    'email': {
      description: 'Access to email address',
      data: ['email']
    },
    'phone': {
      description: 'Access to phone number',
      data: ['phoneNumber']
    },
    'nin': {
      description: 'Access to National ID Number',
      data: ['nin'],
      requiresVerification: true
    },
    'verified_identity': {
      description: 'Access to NCRA verified identity status',
      data: ['isVerified', 'verificationDate', 'verificationLevel'],
      requiresVerification: true
    },
    'government_access': {
      description: 'Access to government services',
      data: ['governmentRole', 'department', 'clearanceLevel'],
      internal: true
    },
    'organization_access': {
      description: 'Access to organization management',
      data: ['organizationId', 'organizationRole', 'permissions'],
      internal: true
    },
    'civil_registration': {
      description: 'Access to civil registration data',
      data: ['birthCertificate', 'marriageCertificate', 'deathCertificate'],
      internal: true,
      requiresVerification: true
    }
  },

  // OAuth Flow Configuration
  flow: {
    authorizationCodeExpiry: 10 * 60 * 1000, // 10 minutes
    accessTokenExpiry: 60 * 60 * 1000, // 1 hour
    refreshTokenExpiry: 30 * 24 * 60 * 60 * 1000, // 30 days
    stateExpiry: 15 * 60 * 1000 // 15 minutes
  },

  // Helper functions
  getClient: function(clientId) {
    return this.clients[clientId] || null;
  },

  validateRedirectUri: function(clientId, redirectUri) {
    const client = this.getClient(clientId);
    if (!client) return false;
    
    return client.redirectUris.includes(redirectUri);
  },

  getClientScopes: function(clientId) {
    const client = this.getClient(clientId);
    return client ? client.scopes : [];
  },

  validateScopes: function(clientId, requestedScopes) {
    const clientScopes = this.getClientScopes(clientId);
    const requestedScopeArray = Array.isArray(requestedScopes) 
      ? requestedScopes 
      : requestedScopes.split(' ');
    
    return requestedScopeArray.every(scope => clientScopes.includes(scope));
  }
};
