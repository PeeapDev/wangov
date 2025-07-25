import axios from 'axios';
import { User, UserRole } from '../contexts/AuthContext';
import { apiClient } from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  nationalId?: string;
}

export const authService = {
  /**
   * Login a user with email and password
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, citizen } = response.data.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Convert citizen data to User format
      return {
        id: citizen.id,
        email: email, // Use the email from login
        role: 'citizen',
        firstName: citizen.firstName,
        lastName: citizen.lastName,
        isEmailVerified: true
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Network error occurred');
    }
  },

  /**
   * Admin login with email and password
   */
  async adminLogin(email: string, password: string): Promise<User> {
    try {
      const response = await apiClient.post('/admin/login', { email, password });
      const { token, admin } = response.data.data;
      
      // Store admin token in localStorage
      localStorage.setItem('adminToken', token);
      
      // Convert admin data to User format
      return {
        id: admin.id,
        email: admin.email,
        role: this.mapAdminRoleToUserRole(admin.role),
        firstName: admin.username, // Use username as firstName for now
        lastName: '',
        isEmailVerified: true
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Admin login failed');
      }
      throw new Error('Network error occurred');
    }
  },

  /**
   * Map admin roles to user roles
   */
  mapAdminRoleToUserRole(adminRole: string): UserRole {
    switch (adminRole) {
      case 'SUPER_ADMIN':
        return 'superadmin';
      case 'SYSTEM_ADMIN':
        return 'admin';
      case 'ENROLLMENT_ADMIN':
        return 'organization';
      case 'SUPPORT_ADMIN':
        return 'organization-staff';
      default:
        return 'citizen';
    }
  },

  /**
   * Register a new citizen
   */
  async register(data: RegisterData): Promise<User> {
    try {
      const response = await apiClient.post('/auth/register', data);
      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Network error occurred');
    }
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local session even if server-side logout fails
    } finally {
      // Always clear tokens from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
    }
  },

  /**
   * Get the current logged in user
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data.user;
    } catch (error) {
      // Silently fail when checking authentication status
      throw new Error('Not authenticated');
    }
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      await apiClient.post('/auth/verify-email', { token });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Email verification failed');
      }
      throw new Error('Network error occurred');
    }
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await apiClient.post('/auth/forgot-password', { email });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Password reset request failed');
      }
      throw new Error('Network error occurred');
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/auth/reset-password', { token, password: newPassword });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Password reset failed');
      }
      throw new Error('Network error occurred');
    }
  }
};
