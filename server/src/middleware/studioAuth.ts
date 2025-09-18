import { Request, Response, NextFunction } from 'express';
import { StudioAuthService } from '../modules/studio/service/authService';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const studioAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from cookie
    const token = req.cookies.studio_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = StudioAuthService.verifyToken(token) as any;

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    // Get user details
    const user = await StudioAuthService.getUserById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account deactivated.'
      });
    }

    // Add user to request object
    req.user = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };

    next();
  } catch (error: any) {
    console.error('Studio auth middleware error:', error);
    
    // Clear invalid cookie
    res.clearCookie('studio_token');
    
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};
