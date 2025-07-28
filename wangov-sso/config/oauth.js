// OAuth Configuration for WanGov SSO
module.exports = {
  // SSO Service Configuration
  sso: {
    domain: process.env.SSO_DOMAIN || 'sso.localhost',
    port: process.env.PORT || 3003,
    protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http'
  },

  // Registered OAuth Clients
  clients: {
    // Universal WanGov SSO Client - handles all subdomains dynamically
    'wangov-universal': {
      name: 'WanGov Universal SSO',
      domain: '*', // Wildcard for all domains
      redirectUris: [
        // Production patterns
        'https://*.wangov.sl/auth/callback',
        'https://*.gov.sl/auth/callback',
        // Development patterns  
        'http://localhost:3003/auth/callback',
        'http://*.localhost:3003/auth/callback'
      ],
      scopes: ['profile', 'email', 'organization_access', 'government_access', 'nin'],
      trusted: true,
      universal: true // Flag for universal client
    },
    // Legacy - WanGov Core Portals
    'wangov-citizen-portal': {
      name: 'WanGov Citizen Portal',
      domain: 'wangov.sl',
      redirectUris: [
        'https://wangov.sl/auth/callback',
        'http://localhost:3004/auth/callback'
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
        'http://localhost:3003/org/auth/callback',
        'http://nacsa.localhost:3003/auth/callback',
        'http://tax.localhost:3003/auth/callback',
        'http://education.localhost:3003/auth/callback',
        'http://health.localhost:3003/auth/callback',
        'http://edsa.localhost:3003/auth/callback',
        'http://nassit.localhost:3003/auth/callback',
        'http://mbsse.localhost:3003/auth/callback'
      ],
      scopes: ['profile', 'email', 'organization_access'],
      trusted: true
    },
    'wangov-ncra-portal': {
      name: 'WanGov NCRA Portal',
      domain: 'ncra.wangov.sl',
      redirectUris: [
        'https://ncra.wangov.sl/auth/callback',
        'http://localhost:3004/auth/callback'
      ],
      scopes: ['profile', 'email', 'ncra_access', 'civil_registration'],
      trusted: true
    },
    'ncra-portal': {
      name: 'National Civil Registration Authority',
      domain: 'ncra.gov.sl',
      redirectUris: [
        'https://ncra.gov.sl/auth/callback',
        'http://localhost:3004/ncra/auth/callback'
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
    
    // For universal client, use dynamic validation
    if (client.universal) {
      return this.validateUniversalRedirectUri(redirectUri);
    }
    
    // For regular clients, check exact match
    return client.redirectUris.includes(redirectUri);
  },

  validateUniversalRedirectUri: function(redirectUri) {
    try {
      const url = new URL(redirectUri);
      const hostname = url.hostname;
      const port = url.port;
      const pathname = url.pathname;
      
      // Must contain callback in the path for security
      if (!pathname.includes('callback')) {
        return false;
      }
      
      // Development patterns - allow any port on localhost for flexibility
      if (hostname === 'localhost') {
        return true; // localhost:*/auth/callback
      }
      
      // Subdomain patterns for development - allow any port
      if (hostname.endsWith('.localhost')) {
        return true; // *.localhost:*/auth/callback
      }
      
      // Production patterns
      if (hostname.endsWith('.wangov.sl') || hostname.endsWith('.gov.sl')) {
        return true; // *.wangov.sl/auth/callback or *.gov.sl/auth/callback
      }
      
      // Main domains
      if (hostname === 'wangov.sl' || hostname === 'gov.sl') {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Invalid redirect URI format:', redirectUri);
      return false;
    }
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
