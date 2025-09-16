import { Request, Response } from 'express';
import { AdminAuthService } from '../services/authService';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  admin?: {
    adminId: string;
    email: string;
    role: string;
  };
}

const signToken = (admin: any): string => {
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
  
  return jwt.sign(payload, secret, options);
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // basic validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password and name are required.' });
    }

    const admin = await AdminAuthService.register({
      email: email.toLowerCase(),
      password,
      name,
      role: 'SUPER_ADMIN'
    });

    return res.status(201).json({
      message: 'Admin registered successfully.',
      admin
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(400).json({ message: err.message || 'Registration failed.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // find admin
    const admin = await AdminAuthService.findAdminByEmail(email.toLowerCase());
    if (!admin) {
      // don't reveal whether email exists — generic message
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ message: 'Account is deactivated.' });
    }

    // check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // create JWT
    const token = signToken(admin);

    // optional: omit password in response
    const adminRes = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive
    };

    // set token in httpOnly cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    });

    // send token in body (or set cookie if you prefer httpOnly cookie)
    return res.json({
      message: 'Logged in successfully.',
      token,
      admin: adminRes
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const admin = await AdminAuthService.getAdminById(req.admin!.adminId);

    return res.json({
      message: 'Profile retrieved successfully.',
      admin
    });
  } catch (err: any) {
    console.error('Get profile error:', err);
    return res.status(404).json({ message: 'Admin not found.' });
  }
};



export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the JWT cookie
    res.clearCookie('admin_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return res.json({
      message: 'Logout successful.'
    });
  } catch (err: any) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

export const verifyToken = async (req: AuthenticatedRequest, res: Response) => {
  try {
    return res.json({
      message: 'Token is valid.',
      admin: req.admin
    });
  } catch (err: any) {
    console.error('Verify token error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};