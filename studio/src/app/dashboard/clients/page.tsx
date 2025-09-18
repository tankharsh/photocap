'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Building,
  Globe
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { apiService, handleApiError } from '@/lib/api';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  company?: string;
  website?: string;
  totalEvents: number;
  totalSpent: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Mock data for demonstration
  const mockClients: Client[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+91 9876543210',
      address: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      company: 'Smith Enterprises',
      website: 'https://smithenterprises.com',
      totalEvents: 5,
      totalSpent: 125000,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+91 9876543211',
      address: '456 Oak Ave',
      city: 'Delhi',
      state: 'Delhi',
      company: 'Johnson Photography',
      totalEvents: 3,
      totalSpent: 75000,
      isActive: true,
      createdAt: '2024-02-10T14:30:00Z',
      updatedAt: '2024-02-10T14:30:00Z'
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+91 9876543212',
      city: 'Bangalore',
      state: 'Karnataka',
      totalEvents: 8,
      totalSpent: 200000,
      isActive: true,
      createdAt: '2024-01-05T09:15:00Z',
      updatedAt: '2024-01-05T09:15:00Z'
    }
  ];

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      // For now, use mock data since backend isn't implemented yet
      setTimeout(() => {
        setClients(mockClients);
        setLoading(false);
      }, 1000);
      
      // Uncomment when backend is ready:
      // const response = await apiService.getClients();
      // if (response.success) {
      //   setClients(response.data || []);
      // } else {
      //   setError(response.message || 'Failed to load clients');
      // }
    } catch (err: any) {
      setError(handleApiError(err));
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'ACTIVE' && client.isActive) ||
                         (statusFilter === 'INACTIVE' && !client.isActive);
    return matchesSearch && matchesStatus;
  });

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.isActive).length;
  const totalRevenue = clients.reduce((sum, client) => sum + client.totalSpent, 0);
  const avgRevenuePerClient = totalClients > 0 ? totalRevenue / totalClients : 0;

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

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          {...fadeInUp}
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
            <p className="text-gray-400">Manage your client relationships and track their engagement</p>
          </div>
          <motion.button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard/clients/create')}
          >
            <Plus className="w-5 h-5" />
            Add Client
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          {...fadeInUp}
        >
          {[
            {
              title: 'Total Clients',
              value: totalClients,
              icon: <Users className="w-8 h-8" />,
              color: 'from-blue-500 to-blue-700',
              change: '+12%'
            },
            {
              title: 'Active Clients',
              value: activeClients,
              icon: <TrendingUp className="w-8 h-8" />,
              color: 'from-green-500 to-green-700',
              change: '+8%'
            },
            {
              title: 'Total Revenue',
              value: `₹${totalRevenue.toLocaleString()}`,
              icon: <DollarSign className="w-8 h-8" />,
              color: 'from-purple-500 to-purple-700',
              change: '+25%'
            },
            {
              title: 'Avg Revenue/Client',
              value: `₹${Math.round(avgRevenuePerClient).toLocaleString()}`,
              icon: <TrendingUp className="w-8 h-8" />,
              color: 'from-pink-500 to-pink-700',
              change: '+15%'
            }
          ].map((card, index) => (
            <motion.div
              key={card.title}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color}`}>
                  {card.icon}
                </div>
                <span className="text-green-400 text-sm font-medium">{card.change}</span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </motion.div>
          ))}
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

        {/* Filters */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
          {...fadeInUp}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search clients by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              >
                <option value="ALL">All Clients</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Clients Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="initial"
          animate="animate"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <motion.div
                key={client.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 group"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                      {client.name}
                    </h3>
                    {client.company && (
                      <p className="text-gray-400 text-sm">{client.company}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    client.isActive 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {client.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{client.phone}</span>
                    </div>
                  )}
                  {(client.city || client.state) && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{client.city}{client.city && client.state && ', '}{client.state}</span>
                    </div>
                  )}
                  {client.website && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">{client.website}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                    <p className="text-2xl font-bold text-white">{client.totalEvents}</p>
                    <p className="text-xs text-gray-400">Events</p>
                  </div>
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                    <p className="text-2xl font-bold text-white">₹{(client.totalSpent / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-gray-400">Revenue</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Joined {new Date(client.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                      onClick={() => router.push(`/dashboard/clients/${client.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                      onClick={() => router.push(`/dashboard/clients/${client.id}/edit`)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-12"
              {...fadeInUp}
            >
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No clients found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== 'ALL' 
                  ? 'Try adjusting your search or filters' 
                  : 'Add your first client to get started'
                }
              </p>
              {!searchTerm && statusFilter === 'ALL' && (
                <motion.button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/dashboard/clients/create')}
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Client
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
