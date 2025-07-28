// Mapping of subdomains to client IDs and service names
module.exports = {
  // Map specific subdomains to service information
  subdomains: {
    'edsa': {
      clientId: 'wangov-org-portal',
      name: 'EDSA Sierra Leone',
      domain: 'edsa.gov.sl'
    },
    'ncra': {
      clientId: 'ncra-portal',
      name: 'National Civil Registration Authority',
      domain: 'ncra.gov.sl'
    },
    'tax': {
      clientId: 'wangov-org-portal',
      name: 'Sierra Leone Tax Authority',
      domain: 'tax.gov.sl'
    },
    'education': {
      clientId: 'wangov-org-portal',
      name: 'Ministry of Education',
      domain: 'education.gov.sl'
    },
    'health': {
      clientId: 'wangov-org-portal',
      name: 'Ministry of Health',
      domain: 'health.gov.sl'
    },
    'nassit': {
      clientId: 'wangov-org-portal',
      name: 'National Social Security Trust',
      domain: 'nassit.gov.sl'
    },
    'mbsse': {
      clientId: 'wangov-org-portal',
      name: 'Ministry of Basic & Senior Secondary Education',
      domain: 'mbsse.gov.sl'
    }
  },
  
  // Get client info by subdomain
  getClientInfoBySubdomain: function(subdomain) {
    if (subdomain && this.subdomains[subdomain]) {
      return this.subdomains[subdomain];
    }
    
    // Default to universal client
    return null;
  }
};
