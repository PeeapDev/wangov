import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

// Define user types based on role
export type UserRole = 'citizen' | 'organization' | 'organization-staff' | 'admin' | 'superadmin' | 'superadmin-staff' | 'ncra';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  organizationId?: string;
  organizationName?: string;
  isNCRA?: boolean; // Flag to identify NCRA users
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, allowedRoles?: string[]) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []); // Empty dependency array to run only once

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      // Check if there's a token in localStorage first
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      if (!token) {
        setUser(null);
        setAuthenticated(false);
        return;
      }
      
      // Check for mock NCRA user data in localStorage first
      const storedUser = localStorage.getItem('user');
      if (storedUser && token.startsWith('mock-ncra-token')) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setAuthenticated(true);
        setError(null);
        return;
      }
      
      // Otherwise, try to get user from API
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setAuthenticated(true);
      setError(null);
    } catch (err) {
      // Clear invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('user');
      setUser(null);
      setAuthenticated(false);
      // Silent fail on initial load as the user might not be logged in
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, allowedRoles?: string[]) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try admin login first if allowed roles suggest admin user
      let userData = null;
      if (allowedRoles && (allowedRoles.includes('superadmin') || allowedRoles.includes('admin') || allowedRoles.includes('superadmin-staff'))) {
        try {
          userData = await authService.adminLogin(email, password);
        } catch (adminError) {
          // If admin login fails, we'll try citizen login below
        }
      }
      
      // Try NCRA login specifically if that role is allowed
      if (!userData && allowedRoles && allowedRoles.includes('ncra')) {
        try {
          // Use same login mechanism but mark as NCRA specifically
          const ncraUserData = await authService.adminLogin(email, password);
          if (ncraUserData) {
            // Set role explicitly to 'ncra' instead of organization
            ncraUserData.role = 'ncra';
            userData = ncraUserData;
          }
        } catch (ncraError) {
          // If NCRA login fails, continue to other methods
        }
      }
      
      // Try organization login if allowed roles suggest organization user and NCRA didn't work
      if (!userData && allowedRoles && (allowedRoles.includes('organization') || allowedRoles.includes('organization-staff'))) {
        try {
          userData = await authService.adminLogin(email, password);
        } catch (orgError) {
          // If org login fails, we'll try citizen login below
        }
      }
      
      // Try citizen login if no admin/org login succeeded or if no specific roles required
      if (!userData) {
        userData = await authService.login(email, password);
      }
      
      setUser(userData);
      setAuthenticated(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      setAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      // Clear all stored user data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      setUser(null);
      setAuthenticated(false);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, 
      isLoading, 
      error, 
      isAuthenticated: authenticated,
      login, 
      logout, 
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};
