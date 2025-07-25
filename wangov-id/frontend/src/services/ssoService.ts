/**
 * WanGov SSO Service
 * Handles Single Sign-On authentication with the main WanGov ID system
 */

export interface SSOUser {
  id: string;
  email: string;
  name: string;
  role: string;
  providerId?: string;
  permissions: string[];
}

export interface SSOLoginResponse {
  success: boolean;
  user?: SSOUser;
  token?: string;
  error?: string;
}

class SSOService {
  private baseUrl = 'http://localhost:3000/api'; // Backend API URL
  
  /**
   * Authenticate user with WanGov ID credentials
   */
  async login(email: string, password: string, providerId?: string): Promise<SSOLoginResponse> {
    try {
      // In a real implementation, this would make an API call to the backend
      // For now, we'll simulate the authentication process
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - in production this would be handled by the backend
      if (!email.endsWith('@wangov.sl')) {
        return {
          success: false,
          error: 'Only WanGov staff accounts are allowed to access provider portals'
        };
      }
      
      if (password.length < 6) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }
      
      // Mock successful authentication
      const mockUser: SSOUser = {
        id: `user-${Date.now()}`,
        email,
        name: this.extractNameFromEmail(email),
        role: 'provider_admin',
        providerId,
        permissions: ['read', 'write', 'admin']
      };
      
      const mockToken = `wangov_token_${Date.now()}`;
      
      // Store authentication data
      localStorage.setItem('wangov_sso_token', mockToken);
      localStorage.setItem('wangov_sso_user', JSON.stringify(mockUser));
      
      return {
        success: true,
        user: mockUser,
        token: mockToken
      };
      
    } catch (error) {
      console.error('SSO Login error:', error);
      return {
        success: false,
        error: 'Authentication service unavailable. Please try again later.'
      };
    }
  }
  
  /**
   * Logout user and clear SSO session
   */
  async logout(): Promise<void> {
    try {
      // In a real implementation, this would invalidate the token on the server
      localStorage.removeItem('wangov_sso_token');
      localStorage.removeItem('wangov_sso_user');
      localStorage.removeItem('providerAuthToken'); // Legacy token
      localStorage.removeItem('providerUser'); // Legacy user data
    } catch (error) {
      console.error('SSO Logout error:', error);
    }
  }
  
  /**
   * Get current authenticated user
   */
  getCurrentUser(): SSOUser | null {
    try {
      const userStr = localStorage.getItem('wangov_sso_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('wangov_sso_token');
    const user = this.getCurrentUser();
    return !!(token && user);
  }
  
  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('wangov_sso_token');
  }
  
  /**
   * Validate user permissions for provider access
   */
  hasProviderAccess(providerId: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Check if user has general provider access or specific provider access
    return user.permissions.includes('admin') || user.providerId === providerId;
  }
  
  /**
   * Extract display name from email
   */
  private extractNameFromEmail(email: string): string {
    const username = email.split('@')[0];
    return username
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
  
  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<boolean> {
    try {
      // In a real implementation, this would call the backend to refresh the token
      const currentUser = this.getCurrentUser();
      if (!currentUser) return false;
      
      // Simulate token refresh
      const newToken = `wangov_token_${Date.now()}`;
      localStorage.setItem('wangov_sso_token', newToken);
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const ssoService = new SSOService();
export default ssoService;
