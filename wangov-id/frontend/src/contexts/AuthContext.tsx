import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

// Define user types based on role
export type UserRole = 'citizen' | 'organization' | 'organization-staff' | 'admin' | 'superadmin' | 'superadmin-staff';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  organizationId?: string;
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
      
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setAuthenticated(true);
      setError(null);
    } catch (err) {
      // Clear invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
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
      
      // Try organization login if allowed roles suggest organization user
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
