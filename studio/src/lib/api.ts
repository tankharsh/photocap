import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/studio';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  photographyType?: string;
  eventTypes?: string[];
  budget?: string;
  preferredDate?: string;
  subscribeNewsletter?: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  photographyType?: string;
  eventTypes?: string[];
  budget?: string;
  preferredDate?: string;
  subscribeNewsletter?: boolean;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface BookingData {
  eventType: string;
  eventDate: string;
  eventLocation?: string;
  duration?: number;
  budget: string;
  specialRequests?: string;
}

interface EventData {
  title: string;
  description?: string;
  eventType: string;
  eventDate: string;
  eventLocation?: string;
  duration?: number;
  budget: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

// Create Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any auth tokens or custom headers here if needed
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    console.error('Response interceptor error:', error);

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

class ApiService {
  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.request({
        method,
        url: endpoint,
        data,
      });

      return response.data;
    } catch (error: any) {
      console.error('API request failed:', error);

      // Handle Axios errors
      if (error.response) {
        throw new Error(error.response.data?.message || `HTTP error! status: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Network error - please check your connection');
      } else {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }

  // Authentication APIs
  async register(userData: RegisterData): Promise<ApiResponse> {
    return this.makeRequest('POST', '/register', userData);
  }

  async login(credentials: LoginData): Promise<ApiResponse> {
    return this.makeRequest('POST', '/login', credentials);
  }

  async logout(): Promise<ApiResponse> {
    return this.makeRequest('POST', '/logout');
  }

  async checkAuth(): Promise<ApiResponse> {
    return this.makeRequest('GET', '/check-auth');
  }

  // Profile APIs
  async getProfile(): Promise<ApiResponse> {
    return this.makeRequest('GET', '/profile');
  }

  async updateProfile(profileData: UpdateProfileData): Promise<ApiResponse> {
    return this.makeRequest('PUT', '/profile', profileData);
  }

  async changePassword(passwordData: ChangePasswordData): Promise<ApiResponse> {
    return this.makeRequest('POST', '/change-password', passwordData);
  }

  // Booking APIs
  async createBooking(bookingData: BookingData): Promise<ApiResponse> {
    return this.makeRequest('POST', '/bookings', bookingData);
  }

  async getBookings(): Promise<ApiResponse> {
    return this.makeRequest('GET', '/bookings');
  }

  async getBooking(bookingId: string): Promise<ApiResponse> {
    return this.makeRequest('GET', `/bookings/${bookingId}`);
  }

  async updateBooking(bookingId: string, bookingData: Partial<BookingData>): Promise<ApiResponse> {
    return this.makeRequest('PUT', `/bookings/${bookingId}`, bookingData);
  }

  async cancelBooking(bookingId: string): Promise<ApiResponse> {
    return this.makeRequest('POST', `/bookings/${bookingId}/cancel`);
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<ApiResponse> {
    return this.makeRequest('GET', '/dashboard/stats');
  }

  async getEvents(): Promise<ApiResponse> {
    return this.makeRequest('GET', '/events');
  }

  async getEvent(eventId: string): Promise<ApiResponse> {
    return this.makeRequest('GET', `/events/${eventId}`);
  }

  async createEvent(eventData: EventData): Promise<ApiResponse> {
    return this.makeRequest('POST', '/events', eventData);
  }

  async updateEvent(eventId: string, eventData: Partial<EventData>): Promise<ApiResponse> {
    return this.makeRequest('PUT', `/events/${eventId}`, eventData);
  }

  async deleteEvent(eventId: string): Promise<ApiResponse> {
    return this.makeRequest('DELETE', `/events/${eventId}`);
  }

  async getClients(): Promise<ApiResponse> {
    return this.makeRequest('GET', '/clients');
  }

  async getDataUsage(): Promise<ApiResponse> {
    return this.makeRequest('GET', '/data-usage');
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type {
  ApiResponse,
  RegisterData,
  LoginData,
  UpdateProfileData,
  ChangePasswordData,
  BookingData,
  EventData,
};

// Utility functions for handling API responses
export const handleApiError = (error: any): string => {
  if (error?.errors && Array.isArray(error.errors)) {
    return error.errors.map((err: any) => err.message).join(', ');
  }
  return error?.message || 'An unexpected error occurred';
};

export const isApiError = (error: any): boolean => {
  return error && typeof error === 'object' && 'message' in error;
};

// Constants
export const API_ENDPOINTS = {
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  CHECK_AUTH: '/check-auth',
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
  BOOKINGS: '/bookings',
} as const;

// Photography types and event types for forms
export const PHOTOGRAPHY_TYPES = [
  'Portrait Photography',
  'Wedding Photography',
  'Event Photography',
  'Product Photography',
  'Fashion Photography',
  'Nature Photography',
  'Corporate Photography',
] as const;

export const EVENT_TYPES = [
  'Weddings',
  'Birthdays',
  'Corporate Events',
  'Family Portraits',
  'Maternity Shoots',
  'Engagement Sessions',
  'Graduation Photos',
  'Anniversary Celebrations',
] as const;

export const BUDGET_RANGES = [
  { value: '5000-15000', label: '₹5,000 - ₹15,000' },
  { value: '15000-30000', label: '₹15,000 - ₹30,000' },
  { value: '30000-50000', label: '₹30,000 - ₹50,000' },
  { value: '50000-100000', label: '₹50,000 - ₹1,00,000' },
  { value: '100000+', label: '₹1,00,000+' },
] as const;
