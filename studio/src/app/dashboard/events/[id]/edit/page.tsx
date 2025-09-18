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
  Save,
  ArrowLeft,
  Camera
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { apiService, handleApiError, EventData, PHOTOGRAPHY_TYPES, EVENT_TYPES, BUDGET_RANGES } from '@/lib/api';

interface Event extends EventData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<EventData>>({
    title: '',
    description: '',
    eventType: '',
    eventDate: '',
    eventLocation: '',
    duration: 0,
    budget: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    status: 'PLANNING'
  });

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setFetchLoading(true);
      // For now, create mock data since backend endpoint isn't implemented yet
      const mockEvent: Event = {
        id: eventId,
        title: 'Wedding Photography - John & Sarah',
        description: 'Beautiful outdoor wedding ceremony and reception photography. Includes pre-wedding shoot, ceremony coverage, and reception documentation.',
        eventType: 'Wedding',
        eventDate: '2024-02-15T14:00:00',
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
        setFormData({
          title: mockEvent.title,
          description: mockEvent.description,
          eventType: mockEvent.eventType,
          eventDate: mockEvent.eventDate,
          eventLocation: mockEvent.eventLocation,
          duration: mockEvent.duration,
          budget: mockEvent.budget,
          clientName: mockEvent.clientName,
          clientEmail: mockEvent.clientEmail,
          clientPhone: mockEvent.clientPhone,
          status: mockEvent.status
        });
        setFetchLoading(false);
      }, 1000);
      
      // Uncomment when backend is ready:
      // const response = await apiService.getEvent(eventId);
      // if (response.success) {
      //   const event = response.data;
      //   setFormData({
      //     title: event.title,
      //     description: event.description,
      //     eventType: event.eventType,
      //     eventDate: event.eventDate,
      //     eventLocation: event.eventLocation,
      //     duration: event.duration,
      //     budget: event.budget,
      //     clientName: event.clientName,
      //     clientEmail: event.clientEmail,
      //     clientPhone: event.clientPhone,
      //     status: event.status
      //   });
      // } else {
      //   setError(response.message || 'Failed to load event');
      // }
    } catch (err: any) {
      setError(handleApiError(err));
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.eventType || !formData.eventDate || !formData.clientName || !formData.clientEmail) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.updateEvent(eventId, formData as EventData);
      
      if (response.success) {
        router.push(`/dashboard/events/${eventId}`);
      } else {
        setError(response.message || 'Failed to update event');
      }
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  if (fetchLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          {...fadeInUp}
        >
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Edit Event</h1>
            <p className="text-gray-400">Update your photography event details</p>
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

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 space-y-6"
          {...fadeInUp}
        >
          {/* Event Details Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-3">Event Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-200"
                  placeholder="e.g., Wedding Photography - John & Jane"
                  required
                />
              </div>

              <div>
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-300 mb-2">
                  Event Type *
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  required
                >
                  <option value="">Select event type</option>
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-300 mb-2">
                  Event Date *
                </label>
                <input
                  type="datetime-local"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  placeholder="e.g., 8"
                  min="1"
                  max="24"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-300 mb-2">
                  Event Location
                </label>
                <input
                  type="text"
                  id="eventLocation"
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  placeholder="e.g., Grand Ballroom, Hotel Taj"
                />
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                  Budget Range
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                >
                  <option value="">Select budget range</option>
                  {BUDGET_RANGES.map((budget) => (
                    <option key={budget.value} value={budget.value}>
                      {budget.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                >
                  <option value="PLANNING">Planning</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="EDITING">Editing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white resize-none"
                  placeholder="Describe the event details, special requirements, etc."
                />
              </div>
            </div>
          </div>

          {/* Client Information Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-3">Client Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-300 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  placeholder="e.g., John Smith"
                  required
                />
              </div>

              <div>
                <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-300 mb-2">
                  Client Email *
                </label>
                <input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  placeholder="e.g., john@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-300 mb-2">
                  Client Phone
                </label>
                <input
                  type="tel"
                  id="clientPhone"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  placeholder="e.g., +91 9876543210"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              <Save className="w-5 h-5" />
              {loading ? 'Updating Event...' : 'Update Event'}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </DashboardLayout>
  );
}
