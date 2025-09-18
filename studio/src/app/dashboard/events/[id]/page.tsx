'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  User, 
  Mail, 
  Phone, 
  FileText,
  Edit,
  Trash2,
  ArrowLeft,
  Camera,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { apiService, handleApiError, EventData } from '@/lib/api';

interface Event extends EventData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      // For now, create mock data since backend endpoint isn't implemented yet
      const mockEvent: Event = {
        id: eventId,
        title: 'Wedding Photography - John & Sarah',
        description: 'Beautiful outdoor wedding ceremony and reception photography. Includes pre-wedding shoot, ceremony coverage, and reception documentation.',
        eventType: 'Wedding',
        eventDate: '2024-02-15T14:00:00Z',
        eventLocation: 'Grand Ballroom, Hotel Taj Palace, Mumbai',
        duration: 8,
        budget: '50000-100000',
        clientName: 'John Smith',
        clientEmail: 'john@example.com',
        clientPhone: '+91 9876543210',
        status: 'IN_PROGRESS',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z'
      };
      
      setTimeout(() => {
        setEvent(mockEvent);
        setLoading(false);
      }, 1000);
      
      // Uncomment when backend is ready:
      // const response = await apiService.getEvent(eventId);
      // if (response.success) {
      //   setEvent(response.data);
      // } else {
      //   setError(response.message || 'Failed to load event');
      // }
    } catch (err: any) {
      setError(handleApiError(err));
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;

    try {
      const response = await apiService.deleteEvent(eventId);
      if (response.success) {
        router.push('/dashboard/events');
      } else {
        setError(response.message || 'Failed to delete event');
      }
    } catch (err: any) {
      setError(handleApiError(err));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'IN_PROGRESS': return <AlertCircle className="w-5 h-5 text-blue-400" />;
      case 'CANCELLED': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'IN_PROGRESS': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PLANNING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'EDITING': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'DELIVERED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Event not found</h3>
            <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or has been deleted.</p>
            <button
              onClick={() => router.push('/dashboard/events')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Back to Events
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          {...fadeInUp}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
              <div className="flex items-center gap-3">
                {getStatusIcon(event.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                  {event.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/dashboard/events/${eventId}/edit`)}
            >
              <Edit className="w-5 h-5" />
              Edit Event
            </motion.button>
            <motion.button
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDeleteEvent}
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </motion.button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Event Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            {...fadeInUp}
          >
            {/* Event Information */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-6">Event Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Event Date</p>
                      <p className="text-white font-medium">
                        {new Date(event.eventDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {event.eventLocation && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Location</p>
                        <p className="text-white font-medium">{event.eventLocation}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Camera className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Event Type</p>
                      <p className="text-white font-medium">{event.eventType}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {event.duration && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Duration</p>
                        <p className="text-white font-medium">{event.duration} hours</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Budget Range</p>
                      <p className="text-white font-medium">₹{event.budget.replace('-', ' - ₹')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {event.description && (
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{event.description}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            {...fadeInUp}
          >
            {/* Client Information */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-6">Client Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Client Name</p>
                    <p className="text-white font-medium">{event.clientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <a href={`mailto:${event.clientEmail}`} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                      {event.clientEmail}
                    </a>
                  </div>
                </div>

                {event.clientPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <a href={`tel:${event.clientPhone}`} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                        {event.clientPhone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Event Timeline */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-6">Timeline</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">Event Created</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(event.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">Last Updated</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(event.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">Event Date</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
