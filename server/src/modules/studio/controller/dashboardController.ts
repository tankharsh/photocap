import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// Get dashboard statistics
export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Get total events
    const totalEvents = await prisma.event.count({
      where: { userId }
    });

    // Get total clients
    const totalClients = await prisma.client.count({
      where: { userId }
    });

    // Get storage usage
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const dataUsage = await prisma.dataUsage.findUnique({
      where: {
        userId_month_year: {
          userId,
          month: currentMonth,
          year: currentYear
        }
      }
    });

    const storageUsed = dataUsage?.storageUsedGB || 0;

    // Calculate monthly revenue (sum of all completed events)
    const completedEvents = await prisma.event.findMany({
      where: {
        userId,
        status: 'COMPLETED'
      }
    });

    // Extract numeric value from budget strings and sum them
    const monthlyRevenue = completedEvents.reduce((total, event) => {
      const budgetMatch = event.budget.match(/(\d+)/);
      const budgetValue = budgetMatch ? parseInt(budgetMatch[1]) : 0;
      return total + budgetValue;
    }, 0);

    // Get recent events (last 5)
    const recentEvents = await prisma.event.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        clientName: true,
        status: true,
        eventDate: true,
        createdAt: true
      }
    });

    // Get upcoming events (next 5)
    const upcomingEvents = await prisma.event.findMany({
      where: {
        userId,
        eventDate: {
          gte: new Date()
        }
      },
      orderBy: { eventDate: 'asc' },
      take: 5,
      select: {
        id: true,
        title: true,
        clientName: true,
        status: true,
        eventDate: true,
        eventLocation: true
      }
    });

    res.json({
      success: true,
      data: {
        totalEvents,
        totalClients,
        storageUsed,
        monthlyRevenue,
        recentEvents,
        upcomingEvents
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

// Get all events for the user
export const getEvents = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const events = await prisma.event.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
};

// Get single event by ID
export const getEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const eventId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event'
    });
  }
};

// Create validation schema for event
const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  eventType: z.string().min(1, 'Event type is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  eventLocation: z.string().optional(),
  duration: z.number().optional(),
  budget: z.string().min(1, 'Budget is required'),
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Valid email is required'),
  clientPhone: z.string().optional(),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'EDITING', 'COMPLETED', 'DELIVERED', 'CANCELLED']).default('PLANNING')
});

// Create new event
export const createEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const validatedData = createEventSchema.parse(req.body);

    // Check if client exists, if not create one
    let client = await prisma.client.findUnique({
      where: { email: validatedData.clientEmail }
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          userId,
          name: validatedData.clientName,
          email: validatedData.clientEmail,
          phone: validatedData.clientPhone,
          totalEvents: 1,
          totalSpent: 0
        }
      });
    } else {
      // Update client's total events
      await prisma.client.update({
        where: { id: client.id },
        data: {
          totalEvents: { increment: 1 }
        }
      });
    }

    // Create the event
    const event = await prisma.event.create({
      data: {
        userId,
        title: validatedData.title,
        description: validatedData.description,
        eventType: validatedData.eventType,
        eventDate: new Date(validatedData.eventDate),
        eventLocation: validatedData.eventLocation,
        duration: validatedData.duration,
        budget: validatedData.budget,
        clientName: validatedData.clientName,
        clientEmail: validatedData.clientEmail,
        clientPhone: validatedData.clientPhone,
        status: validatedData.status
      }
    });

    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }

    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event'
    });
  }
};

// Update event
export const updateEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const eventId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Check if event exists and belongs to user
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId
      }
    });

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const validatedData = createEventSchema.partial().parse(req.body);

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...validatedData,
        eventDate: validatedData.eventDate ? new Date(validatedData.eventDate) : undefined
      }
    });

    res.json({
      success: true,
      data: updatedEvent,
      message: 'Event updated successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }

    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event'
    });
  }
};

// Delete event
export const deleteEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const eventId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Check if event exists and belongs to user
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId
      }
    });

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await prisma.event.delete({
      where: { id: eventId }
    });

    // Update client's total events count
    const client = await prisma.client.findUnique({
      where: { email: existingEvent.clientEmail }
    });

    if (client && client.totalEvents > 0) {
      await prisma.client.update({
        where: { id: client.id },
        data: {
          totalEvents: { decrement: 1 }
        }
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event'
    });
  }
};

// Get all clients for the user
export const getClients = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const clients = await prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        events: {
          select: {
            id: true,
            title: true,
            eventDate: true,
            status: true
          },
          orderBy: { eventDate: 'desc' },
          take: 5
        }
      }
    });

    res.json({
      success: true,
      data: clients
    });

  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch clients'
    });
  }
};

// Get data usage statistics
export const getDataUsage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Get last 6 months of data usage
    const dataUsage = await prisma.dataUsage.findMany({
      where: { userId },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ],
      take: 6
    });

    // Calculate totals
    const totalStorageGB = dataUsage.reduce((sum, usage) => sum + usage.storageUsedGB, 0);
    const totalBandwidthGB = dataUsage.reduce((sum, usage) => sum + usage.bandwidthUsedGB, 0);
    const totalFilesUploaded = dataUsage.reduce((sum, usage) => sum + usage.filesUploaded, 0);
    const totalFilesDownloaded = dataUsage.reduce((sum, usage) => sum + usage.filesDownloaded, 0);

    res.json({
      success: true,
      data: {
        monthlyUsage: dataUsage.reverse(), // Reverse to show oldest first
        totals: {
          storageGB: totalStorageGB,
          bandwidthGB: totalBandwidthGB,
          filesUploaded: totalFilesUploaded,
          filesDownloaded: totalFilesDownloaded
        }
      }
    });

  } catch (error) {
    console.error('Get data usage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch data usage'
    });
  }
};
