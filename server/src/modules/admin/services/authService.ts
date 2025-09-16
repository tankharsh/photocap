import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

const prisma = new PrismaClient();

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'SUPER_ADMIN';
}

interface LoginData {
  email: string;
  password: string;
}

export class AdminAuthService {
  private static saltRounds = 12;

  static async register(data: RegisterData) {
    const { email, password, name, role = 'SUPER_ADMIN' } = data;

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    return admin;
  }

  static async login(data: LoginData) {
    const { email, password } = data;

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      throw new Error('Invalid credentials');
    }

    if (!admin.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    const payload = {
      adminId: admin.id,
      email: admin.email,
      role: admin.role
    };
    
    const options: SignOptions = {
      expiresIn: '24h'
    };
    
    const token = jwt.sign(payload, secret, options);

    return {
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive
      },
      token
    };
  }

  static async findAdminByEmail(email: string) {
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    return admin;
  }

  static async getAdminById(id: string) {
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!admin) {
      throw new Error('Admin not found');
    }

    return admin;
  }


}