// apiClient.ts
import axios, { InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, refreshToken, getRefreshToken, logout } from './AuthService';
import { router } from 'expo-router';

const api = axios.create({
  baseURL: 'https://kodaklogisticsapi.up.railway.app/api/',
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshTokenValue = await getRefreshToken();
        if (!refreshTokenValue) {
          throw new Error('No refresh token available');
        }

        // Try to refresh the token
        const tokens = await refreshToken(refreshTokenValue);
        
        // Update the original request with the new token
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${tokens.access}`;
        }
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user and redirect to login
        console.error('Token refresh failed:', refreshError);
        await logout();
        router.replace('/(auth)/login');
        return Promise.reject(refreshError);
      }
    }
    
    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);

// Add response type to common API calls
export const get = async <T>(url: string) => {
  const response = await api.get<T>(url);
  return response.data;
};

export const post = async <T>(url: string, data?: any) => {
  const response = await api.post<T>(url, data);
  return response.data;
};

export const put = async <T>(url: string, data?: any) => {
  const response = await api.put<T>(url, data);
  return response.data;
};

export const del = async <T>(url: string) => {
  const response = await api.delete<T>(url);
  return response.data;
};

export default api;