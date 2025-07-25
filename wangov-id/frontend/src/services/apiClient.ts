import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Create Axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  // Use relative URLs - the proxy in vite.config.ts will handle routing to the backend
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/session handling
});

// Request interceptor - adds auth token to requests if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (citizen token or admin token)
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors - redirect to login page
      if (error.response.status === 401) {
        // Instead of redirecting here directly, we'll let the auth context handle it
        console.error('Authentication error:', error.response.data);
      }
      
      // Handle 403 Forbidden errors
      if (error.response.status === 403) {
        console.error('Permission denied:', error.response.data);
      }

      // Handle 500 Server errors
      if (error.response.status >= 500) {
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error - no response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);
