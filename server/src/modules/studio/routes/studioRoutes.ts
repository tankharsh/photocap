import { Router } from 'express';
import { StudioController } from '../controller/studioController';
import {
  getDashboardStats,
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getClients,
  getDataUsage
} from '../controller/dashboardController';
import { studioAuthMiddleware } from '../../../middleware/studioAuth';

const router = Router();

// Public routes (no authentication required)
router.post('/register', StudioController.register);
router.post('/login', StudioController.login);

// Protected routes (authentication required)
router.use(studioAuthMiddleware); // Apply middleware to all routes below

router.post('/logout', StudioController.logout);
router.get('/profile', StudioController.getProfile);
router.put('/profile', StudioController.updateProfile);
router.post('/change-password', StudioController.changePassword);
router.get('/check-auth', StudioController.checkAuth);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);

// Event routes
router.get('/events', getEvents);
router.get('/events/:id', getEvent);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// Client routes
router.get('/clients', getClients);

// Data usage routes
router.get('/data-usage', getDataUsage);

export default router;
