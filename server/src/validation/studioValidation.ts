import { z } from 'zod';

// User Registration Validation
export const studioRegisterSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
    .optional(),
  
  dateOfBirth: z.string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13; // Minimum age requirement
    }, 'You must be at least 13 years old')
    .optional(),
  
  photographyType: z.enum([
    'Portrait Photography',
    'Wedding Photography',
    'Event Photography',
    'Product Photography',
    'Fashion Photography',
    'Nature Photography',
    'Corporate Photography'
  ]).optional(),
  
  eventTypes: z.array(z.enum([
    'Weddings',
    'Birthdays',
    'Corporate Events',
    'Family Portraits',
    'Maternity Shoots',
    'Engagement Sessions',
    'Graduation Photos',
    'Anniversary Celebrations'
  ])).optional(),
  
  budget: z.enum([
    '5000-15000',
    '15000-30000',
    '30000-50000',
    '50000-100000',
    '100000+'
  ]).optional(),
  
  preferredDate: z.string()
    .refine((date) => {
      const preferredDate = new Date(date);
      const today = new Date();
      return preferredDate >= today;
    }, 'Preferred date must be in the future')
    .optional(),
  
  subscribeNewsletter: z.boolean().optional()
});

// User Login Validation
export const studioLoginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  
  password: z.string()
    .min(1, 'Password is required')
});

// Profile Update Validation
export const studioUpdateProfileSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .optional(),
  
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .optional(),
  
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
    .optional(),
  
  dateOfBirth: z.string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13;
    }, 'You must be at least 13 years old')
    .optional(),
  
  photographyType: z.enum([
    'Portrait Photography',
    'Wedding Photography',
    'Event Photography',
    'Product Photography',
    'Fashion Photography',
    'Nature Photography',
    'Corporate Photography'
  ]).optional(),
  
  eventTypes: z.array(z.enum([
    'Weddings',
    'Birthdays',
    'Corporate Events',
    'Family Portraits',
    'Maternity Shoots',
    'Engagement Sessions',
    'Graduation Photos',
    'Anniversary Celebrations'
  ])).optional(),
  
  budget: z.enum([
    '5000-15000',
    '15000-30000',
    '30000-50000',
    '50000-100000',
    '100000+'
  ]).optional(),
  
  preferredDate: z.string()
    .refine((date) => {
      const preferredDate = new Date(date);
      const today = new Date();
      return preferredDate >= today;
    }, 'Preferred date must be in the future')
    .optional(),
  
  subscribeNewsletter: z.boolean().optional()
});

// Change Password Validation
export const studioChangePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'New password must contain at least one uppercase letter, one lowercase letter, and one number')
});

// Booking Validation
export const studioBookingSchema = z.object({
  eventType: z.string()
    .min(1, 'Event type is required'),
  
  eventDate: z.string()
    .refine((date) => {
      const eventDate = new Date(date);
      const today = new Date();
      return eventDate >= today;
    }, 'Event date must be in the future'),
  
  eventLocation: z.string()
    .min(1, 'Event location is required')
    .max(200, 'Event location must be less than 200 characters')
    .optional(),
  
  duration: z.number()
    .min(1, 'Duration must be at least 1 hour')
    .max(24, 'Duration cannot exceed 24 hours')
    .optional(),
  
  budget: z.string()
    .min(1, 'Budget is required'),
  
  specialRequests: z.string()
    .max(500, 'Special requests must be less than 500 characters')
    .optional()
});

// Email Validation
export const emailSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required')
});

// Generic ID Validation
export const idSchema = z.object({
  id: z.string()
    .min(1, 'ID is required')
});

// Pagination Validation
export const paginationSchema = z.object({
  page: z.number()
    .min(1, 'Page must be at least 1')
    .optional()
    .default(1),
  
  limit: z.number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(10)
});

// Search Validation
export const searchSchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be less than 100 characters'),
  
  ...paginationSchema.shape
});

// Date Range Validation
export const dateRangeSchema = z.object({
  startDate: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Invalid start date format'),
  
  endDate: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Invalid end date format')
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start <= end;
}, 'Start date must be before or equal to end date');
