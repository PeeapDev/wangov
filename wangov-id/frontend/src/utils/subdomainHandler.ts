/**
 * Utility functions for handling subdomain routing and detection
 */

/**
 * Extracts the subdomain from the current hostname
 * Examples:
 * - "edsa.localhost:3000" returns "edsa"
 * - "localhost:3000" returns null
 * - "app.wangov.sl" returns "app"
 * - "wangov.sl" returns null
 */
export const getSubdomain = (): string | null => {
  // In a browser environment
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    console.log('🔍 Subdomain detection - hostname:', hostname);
    
    // Handle localhost development environment
    if (hostname.includes('localhost')) {
      const parts = hostname.split('.');
      console.log('🔍 Subdomain detection - parts:', parts);
      // If it's a subdomain of localhost (e.g., edsa.localhost)
      if (parts.length > 1 && parts[1] === 'localhost') {
        const subdomain = parts[0] === 'www' ? null : parts[0];
        console.log('🔍 Subdomain detection - found subdomain:', subdomain);
        return subdomain;
      }
      console.log('🔍 Subdomain detection - no subdomain found');
      return null;
    }
    
    // Handle production environment
    const parts = hostname.split('.');
    // If we have a subdomain (e.g., app.wangov.sl)
    if (parts.length > 2) {
      return parts[0] === 'www' ? null : parts[0];
    }
    
    return null;
  }
  
  // In a non-browser environment (SSR)
  return null;
};

/**
 * Checks if the current hostname has a provider subdomain
 */
export const isProviderSubdomain = async (): Promise<boolean> => {
  const subdomain = getSubdomain();
  console.log('🏢 Provider validation - subdomain:', subdomain);
  if (!subdomain) {
    console.log('🏢 Provider validation - no subdomain, returning false');
    return false;
  }
  
  // Here we would make an API call to verify if this is a valid provider
  // For now, we'll mock this behavior
  try {
    // In a real implementation, this would be:
    // const response = await fetch(`/api/providers/validate-subdomain/${subdomain}`);
    // return response.ok;
    
    // For development, we'll just consider some hardcoded values as valid
    const validProviderSubdomains = ['edsa', 'health', 'tax', 'education', 'nassit', 'mbsse', 'nacsa'];
    const isValid = validProviderSubdomains.includes(subdomain);
    console.log('🏢 Provider validation - is valid provider:', isValid);
    return isValid;
  } catch (error) {
    console.error('Error validating provider subdomain:', error);
    return false;
  }
};

/**
 * Provider details type definition
 */
export interface ProviderDetails {
  id: string;
  name: string;
  type: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * Mock provider data
 */
const mockProviders: Record<string, ProviderDetails> = {
  'edsa': {
    id: 'edsa-001',
    name: 'Electricity Distribution and Supply Authority',
    type: 'electricity',
    logo: '/logos/edsa.png',
    primaryColor: '#00796b',
    secondaryColor: '#004d40'
  },
  'health': {
    id: 'health-001',
    name: 'Ministry of Health and Sanitation',
    type: 'health',
    logo: '/logos/health.png',
    primaryColor: '#1976d2',
    secondaryColor: '#0d47a1'
  },
  'tax': {
    id: 'tax-001',
    name: 'National Revenue Authority',
    type: 'tax',
    logo: '/logos/tax.png',
    primaryColor: '#388e3c',
    secondaryColor: '#1b5e20'
  },
  'education': {
    id: 'edu-001',
    name: 'Ministry of Education',
    type: 'education',
    logo: '/logos/education.png',
    primaryColor: '#7b1fa2',
    secondaryColor: '#4a148c'
  },
  'nassit': {
    id: 'nassit-001',
    name: 'National Social Security and Insurance Trust',
    type: 'nassit',
    logo: '/logos/nassit.png',
    primaryColor: '#d32f2f',
    secondaryColor: '#b71c1c'
  },
  'mbsse': {
    id: 'mbsse-001',
    name: 'Ministry of Basic and Senior Secondary Education',
    type: 'education',
    logo: '/logos/mbsse.png',
    primaryColor: '#1565c0',
    secondaryColor: '#0d47a1'
  },
  'nacsa': {
    id: 'nacsa-001',
    name: 'National Commission for Social Action',
    type: 'social_action',
    logo: '/logos/nacsa.png',
    primaryColor: '#059669',
    secondaryColor: '#047857'
  }
};

/**
 * Gets provider details based on the current subdomain
 * @deprecated Use getProviderDetails instead for consistency
 */
export const getProviderFromSubdomain = async (): Promise<ProviderDetails | null> => {
  const subdomain = getSubdomain();
  if (!subdomain) return null;
  
  // In a real implementation, this would fetch provider details from an API
  return mockProviders[subdomain] || null;
};

/**
 * Gets provider details based on the current subdomain
 * This function is used by the provider landing page and other components
 * @returns Provider details object or throws error if provider not found
 */
export const getProviderDetails = async (): Promise<ProviderDetails> => {
  const subdomain = getSubdomain();
  if (!subdomain) {
    throw new Error('No subdomain found in the current URL');
  }
  
  // In a real implementation, this would fetch provider details from an API
  const provider = mockProviders[subdomain];
  
  if (!provider) {
    throw new Error(`Provider not found for subdomain: ${subdomain}`);
  }
  
  return provider;
};
