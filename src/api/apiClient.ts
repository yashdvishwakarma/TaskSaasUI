// api/apiClient.ts
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { type ApiResponse, ApiException } from './types';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://tasksaas-api.onrender.com/api",
  timeout: import.meta.env.DEV ? 10000 : 1000000,
});

// Request interceptor
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // Handle successful response
    return response;
  },
  (error: AxiosError<ApiResponse<any>>) => {
    // Handle error response
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