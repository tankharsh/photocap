import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('admin_token');
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Admin authentication API functions
export const adminApi = {
  // Login admin
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/admin/login', { email, password });
      
      // Store token in cookie
      if (response.data.token) {
        Cookies.set('admin_token', response.data.token, { 
          expires: 1, // 1 day
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Register new admin
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/admin/register', { name, email, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Get admin profile
  getProfile: async () => {
    try {
      const response = await api.get('/admin/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.get('/admin/verify-token');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token verification failed');
    }
  },

  // Logout admin
  logout: async () => {
    try {
      await api.post('/admin/logout');
      Cookies.remove('admin_token');
      return { message: 'Logout successful' };
    } catch (error: any) {
      // Even if API call fails, remove token from cookies
      Cookies.remove('admin_token');
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  }
};

export default api;