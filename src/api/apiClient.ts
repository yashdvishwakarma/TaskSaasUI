// api/apiClient.ts
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { type ApiResponse, ApiException } from './types';
import AuthService from './Services/AuthService'; // Fixed import path

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7048/api",
  timeout: import.meta.env.DEV ? 100000 : 1000000,
});

// Request interceptor
http.interceptors.request.use(
  (config) => {
    const token = AuthService.getInstance().getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Single Response interceptor (combines both functionalities)
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // Handle successful response
    return response;
  },
  async (error: AxiosError<ApiResponse<any>>) => {
    console.log('Axios interceptor error:', error.response?.status); // Debug log
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - initiating logout');
      
      // Prevent infinite loops
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        try {
          await AuthService.getInstance().logout();
        } catch (logoutError) {
          console.error('Error during automatic logout:', logoutError);
          // Force redirect even if logout fails
          window.location.replace('/login');
        }
      }
      
      // Return rejected promise to stop further processing
      return Promise.reject(new ApiException(
        'Authentication expired. Please login again.',
        'UNAUTHORIZED',
        null,
        401
      ));
    }
    
    // Handle other errors
    if (error.response) {
      const { data, status } = error.response;
      
      if (data?.error) {
        // Server returned an error in our standard format
        throw new ApiException(
          data.error.message,
          data.error.code,
          data.error.details,
          status
        );
      } else {
        // Server returned an error but not in our standard format
        throw new ApiException(
          error.message || 'An unexpected error occurred',
          'UNKNOWN_ERROR',
          null,
          status
        );
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new ApiException(
        'Network error. Please check your connection.',
        'NETWORK_ERROR',
        null
      );
    } else {
      // Something else happened
      throw new ApiException(
        error.message || 'An unexpected error occurred',
        'CLIENT_ERROR',
        null
      );
    }
  }
);

export default http;