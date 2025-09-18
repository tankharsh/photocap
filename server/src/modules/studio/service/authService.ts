import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

const prisma = new PrismaClient();

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

export class StudioAuthService {
  private static saltRounds = 12;

  static async register(data: RegisterData) {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone,
      dateOfBirth,
      photographyType,
      eventTypes = [],
      budget,
      preferredDate,
      subscribeNewsletter = false
    } = data;

    // Check if user already exists
    const existingUser = await prisma.studioUser.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    // Create user
    const user = await prisma.studioUser.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        photographyType,
        eventTypes,
        budget,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        subscribeNewsletter
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
        photographyType: true,
        eventTypes: true,
        budget: true,
        preferredDate: true,
        subscribeNewsletter: true,
        isActive: true,
        emailVerified: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      user,
      token,
      message: 'User registered successfully'
    };
  }

  static async login(data: LoginData) {
    const { email, password } = data;

    // Find user by email
    const user = await prisma.studioUser.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
        photographyType: true,
        eventTypes: true,
        budget: true,
        preferredDate: true,
        subscribeNewsletter: true,
        isActive: true,
        emailVerified: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT token
    const token = this.generateToken(userWithoutPassword);

    return {
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    };
  }

  static async getUserById(userId: string) {
    const user = await prisma.studioUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
        photographyType: true,
        eventTypes: true,
        budget: true,
        preferredDate: true,
        subscribeNewsletter: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        bookings: {
          select: {
            id: true,
            eventType: true,
            eventDate: true,
            eventLocation: true,
            duration: true,
            budget: true,
            status: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  static async updateProfile(userId: string, updateData: Partial<RegisterData>) {
    const user = await prisma.studioUser.update({
      where: { id: userId },
      data: {
        ...updateData,
        dateOfBirth: updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : undefined,
        preferredDate: updateData.preferredDate ? new Date(updateData.preferredDate) : undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
        photographyType: true,
        eventTypes: true,
        budget: true,
        preferredDate: true,
        subscribeNewsletter: true,
        isActive: true,
        emailVerified: true,
        createdAt: true
      }
    });

    return {
      user,
      message: 'Profile updated successfully'
    };
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // Get user with password
    const user = await prisma.studioUser.findUnique({
      where: { id: userId },
      select: { id: true, password: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, this.saltRounds);

    // Update password
    await prisma.studioUser.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    return {
      message: 'Password changed successfully'
    };
  }

  private static generateToken(user: any): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    const payload = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };
    
    const options: SignOptions = {
      expiresIn: '7d' // 7 days for studio users
    };
    
    return jwt.sign(payload, secret, options);
  }

  static verifyToken(token: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
