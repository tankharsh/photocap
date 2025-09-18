'use client';

import { motion } from 'framer-motion';
import { 
  Camera, 
  Calendar, 
  Users, 
  HardDrive, 
  TrendingUp, 
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { apiService, handleApiError } from '@/lib/api';

interface DashboardStats {
  totalEvents: number;
  totalClients: number;
  storageUsed: number;
  monthlyRevenue: number;
  recentEvents: any[];
  upcomingEvents: any[];
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalClients: 0,
    storageUsed: 0,
    monthlyRevenue: 0,
    recentEvents: [],
    upcomingEvents: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDashboardStats();
      
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to load dashboard data');
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

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: <Calendar className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-700',
      change: '+12%'
    },
    {
      title: 'Active Clients',
      value: stats.totalClients,
      icon: <Users className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-700',
      change: '+8%'
    },
    {
      title: 'Storage Used',
      value: `${stats.storageUsed.toFixed(1)} GB`,
      icon: <HardDrive className="w-8 h-8" />,
      color: 'from-green-500 to-green-700',
      change: '+15%'
    },
    {
      title: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-pink-500 to-pink-700',
      change: '+25%'
    }
  ];

  if (loading) {
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center"
          {...fadeInUp}
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back! Here's what's happening with your studio.</p>
          </div>
          <motion.button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard/events/create')}
          >
            <Plus className="w-5 h-5" />
            Create Event
          </motion.button>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 shadow-xl hover:shadow-2xl group"
              variants={fadeInUp}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${card.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  {card.icon}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-semibold">{card.change}</span>
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">{card.title}</h3>
              <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
              <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-3">
                <div className={`bg-gradient-to-r ${card.color} h-1.5 rounded-full transition-all duration-1000 ease-out`} style={{ width: '75%' }}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Events */}
          <motion.div
            className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 shadow-xl"
            {...fadeInUp}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Recent Events</h2>
              </div>
              <button
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-purple-500/10"
                onClick={() => router.push('/dashboard/events')}
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {stats.recentEvents.length > 0 ? (
                stats.recentEvents.slice(0, 5).map((event: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{event.title}</p>
                        <p className="text-gray-400 text-sm">{event.clientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                        event.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {event.status}
                      </span>
                      <div className="flex gap-1">
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Camera className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No recent events</p>
                  <button 
                    className="text-purple-400 hover:text-purple-300 transition-colors mt-2"
                    onClick={() => router.push('/dashboard/events/create')}
                  >
                    Create your first event
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 shadow-xl"
            {...fadeInUp}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Create Event', icon: <Plus className="w-6 h-6" />, href: '/dashboard/events/create', color: 'from-green-500 to-emerald-500' },
                { title: 'View Clients', icon: <Users className="w-6 h-6" />, href: '/dashboard/clients', color: 'from-blue-500 to-cyan-500' },
                { title: 'Analytics', icon: <BarChart3 className="w-6 h-6" />, href: '/dashboard/analytics', color: 'from-purple-500 to-pink-500' },
                { title: 'Storage', icon: <HardDrive className="w-6 h-6" />, href: '/dashboard/storage', color: 'from-orange-500 to-red-500' }
              ].map((action, index) => (
                <motion.button
                  key={action.title}
                  className="p-6 bg-gray-700/40 rounded-xl hover:bg-gray-700/60 transition-all duration-300 text-left group border border-gray-600/30 hover:border-gray-500/50 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(action.href)}
                >
                  <div className={`p-3 bg-gradient-to-br ${action.color} rounded-lg mb-4 w-fit shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    {action.icon}
                  </div>
                  <p className="text-white font-semibold text-lg">{action.title}</p>
                  <p className="text-gray-400 text-sm mt-1">Quick access</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
