import { Router } from 'express';
import { register, login, logout, getProfile, verifyToken } from '../controller/adminController';
import { authenticateAdmin } from '../../../middleware/auth';

const router = Router();

// Public routes (no authentication required)
router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register); // Only SUPER_ADMIN role now

// Protected routes (authentication required)
router.use(authenticateAdmin);

// Admin profile routes
router.get('/profile', getProfile);
router.get('/verify-token', verifyToken);

export default router;