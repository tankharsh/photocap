import { Request, Response } from 'express';
import { StudioAuthService } from '../service/authService';
import { z } from 'zod';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  photographyType: z.string().optional(),
  eventTypes: z.array(z.string()).optional(),
  budget: z.string().optional(),
  preferredDate: z.string().optional(),
  subscribeNewsletter: z.boolean().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  photographyType: z.string().optional(),
  eventTypes: z.array(z.string()).optional(),
  budget: z.string().optional(),
  preferredDate: z.string().optional(),
  subscribeNewsletter: z.boolean().optional()
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long')
});

export class StudioController {
  // Register new user
  static async register(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = registerSchema.parse(req.body);

      // Register user
      const result = await StudioAuthService.register(validatedData);

      // Set HTTP-only cookie with JWT token
      res.cookie('studio_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          user: result.user
        }
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  // Login user
  static async login(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = loginSchema.parse(req.body);

      // Login user
      const result = await StudioAuthService.login(validatedData);

      // Set HTTP-only cookie with JWT token
      res.cookie('studio_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          user: result.user
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

  // Logout user
  static async logout(req: Request, res: Response) {
    try {
      // Clear the cookie
      res.clearCookie('studio_token');

      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  // Get current user profile
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const user = await StudioAuthService.getUserById(req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          user
        }
      });
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'User not found'
      });
    }
  }

  // Update user profile
  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Validate request body
      const validatedData = updateProfileSchema.parse(req.body);

      // Update profile
      const result = await StudioAuthService.updateProfile(req.user.userId, validatedData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          user: result.user
        }
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      res.status(400).json({
        success: false,
        message: error.message || 'Profile update failed'
      });
    }
  }

  // Change password
  static async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Validate request body
      const validatedData = changePasswordSchema.parse(req.body);

      // Change password
      const result = await StudioAuthService.changePassword(
        req.user.userId,
        validatedData.currentPassword,
        validatedData.newPassword
      );

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      console.error('Change password error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      res.status(400).json({
        success: false,
        message: error.message || 'Password change failed'
      });
    }
  }

  // Check authentication status
  static async checkAuth(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      res.status(200).json({
        success: true,
        message: 'User is authenticated',
        data: {
          user: req.user
        }
      });
    } catch (error: any) {
      console.error('Check auth error:', error);
      res.status(500).json({
        success: false,
        message: 'Authentication check failed'
      });
    }
  }
}
