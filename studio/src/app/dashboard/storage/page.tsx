'use client';

import { motion } from 'framer-motion';
import { 
  HardDrive, 
  Upload, 
  Download, 
  Folder, 
  Image, 
  Video,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiService, handleApiError } from '@/lib/api';

interface DataUsage {
  id: string;
  date: string;
  storageUsedGB: number;
  bandwidthUsedGB: number;
  filesUploaded: number;
  filesDownloaded: number;
  month: number;
  year: number;
}

interface StorageStats {
  totalStorageGB: number;
  usedStorageGB: number;
  availableStorageGB: number;
  totalFiles: number;
  monthlyUsage: DataUsage[];
  fileTypes: {
    images: number;
    videos: number;
    documents: number;
    others: number;
  };
}

export default function StoragePage() {
  const [stats, setStats] = useState<StorageStats>({
    totalStorageGB: 1000,
    usedStorageGB: 0,
    availableStorageGB: 1000,
    totalFiles: 0,
    monthlyUsage: [],
    fileTypes: {
      images: 0,
      videos: 0,
      documents: 0,
      others: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  // Mock data for demonstration
  const mockStats: StorageStats = {
    totalStorageGB: 1000,
    usedStorageGB: 245.8,
    availableStorageGB: 754.2,
    totalFiles: 1247,
    monthlyUsage: [
      { id: '1', date: '2024-01-01', storageUsedGB: 35.2, bandwidthUsedGB: 12.5, filesUploaded: 156, filesDownloaded: 89, month: 1, year: 2024 },
      { id: '2', date: '2024-02-01', storageUsedGB: 42.1, bandwidthUsedGB: 18.3, filesUploaded: 203, filesDownloaded: 124, month: 2, year: 2024 },
      { id: '3', date: '2024-03-01', storageUsedGB: 38.7, bandwidthUsedGB: 15.7, filesUploaded: 178, filesDownloaded: 95, month: 3, year: 2024 },
      { id: '4', date: '2024-04-01', storageUsedGB: 51.3, bandwidthUsedGB: 22.1, filesUploaded: 234, filesDownloaded: 156, month: 4, year: 2024 },
      { id: '5', date: '2024-05-01', storageUsedGB: 47.9, bandwidthUsedGB: 19.8, filesUploaded: 198, filesDownloaded: 132, month: 5, year: 2024 },
      { id: '6', date: '2024-06-01', storageUsedGB: 30.6, bandwidthUsedGB: 14.2, filesUploaded: 145, filesDownloaded: 78, month: 6, year: 2024 }
    ],
    fileTypes: {
      images: 856,
      videos: 234,
      documents: 98,
      others: 59
    }
  };

  useEffect(() => {
    fetchDataUsage();
  }, []);

  const fetchDataUsage = async () => {
    try {
      setLoading(true);
      // For now, use mock data since backend isn't implemented yet
      setTimeout(() => {
        setStats(mockStats);
        setLoading(false);
      }, 1000);
      
      // Uncomment when backend is ready:
      // const response = await apiService.getDataUsage();
      // if (response.success) {
      //   setStats(response.data);
      // } else {
      //   setError(response.message || 'Failed to load data usage');
      // }
    } catch (err: any) {
      setError(handleApiError(err));
      setLoading(false);
    }
  };

  const storagePercentage = (stats.usedStorageGB / stats.totalStorageGB) * 100;
  const currentMonthUsage = stats.monthlyUsage[stats.monthlyUsage.length - 1];
  const previousMonthUsage = stats.monthlyUsage[stats.monthlyUsage.length - 2];
  
  const storageChange = currentMonthUsage && previousMonthUsage 
    ? ((currentMonthUsage.storageUsedGB - previousMonthUsage.storageUsedGB) / previousMonthUsage.storageUsedGB) * 100
    : 0;

  const bandwidthChange = currentMonthUsage && previousMonthUsage 
    ? ((currentMonthUsage.bandwidthUsedGB - previousMonthUsage.bandwidthUsedGB) / previousMonthUsage.bandwidthUsedGB) * 100
    : 0;

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
            <h1 className="text-3xl font-bold text-white mb-2">Storage & Data Usage</h1>
            <p className="text-gray-400">Monitor your storage consumption and data transfer</p>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
            </select>
          </div>
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

        {/* Storage Overview */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
          {...fadeInUp}
        >
          <h2 className="text-xl font-bold text-white mb-6">Storage Overview</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Storage Usage Circle */}
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${storagePercentage * 2.51} 251`}
                    className="text-purple-500 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{storagePercentage.toFixed(1)}%</span>
                  <span className="text-gray-400 text-sm">Used</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-white font-semibold">
                  {stats.usedStorageGB.toFixed(1)} GB of {stats.totalStorageGB} GB used
                </p>
                <p className="text-gray-400 text-sm">
                  {stats.availableStorageGB.toFixed(1)} GB available
                </p>
              </div>
            </div>

            {/* Storage Stats */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                  <HardDrive className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.totalFiles}</p>
                  <p className="text-gray-400 text-sm">Total Files</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {currentMonthUsage?.filesUploaded || 0}
                  </p>
                  <p className="text-gray-400 text-sm">This Month</p>
                </div>
              </div>

              {/* File Type Breakdown */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">File Types</h3>
                {[
                  { name: 'Images', count: stats.fileTypes.images, icon: <Image className="w-4 h-4" />, color: 'bg-blue-500' },
                  { name: 'Videos', count: stats.fileTypes.videos, icon: <Video className="w-4 h-4" />, color: 'bg-red-500' },
                  { name: 'Documents', count: stats.fileTypes.documents, icon: <FileText className="w-4 h-4" />, color: 'bg-green-500' },
                  { name: 'Others', count: stats.fileTypes.others, icon: <Folder className="w-4 h-4" />, color: 'bg-yellow-500' }
                ].map((type) => {
                  const percentage = (type.count / stats.totalFiles) * 100;
                  return (
                    <div key={type.name} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 w-24">
                        {type.icon}
                        <span className="text-gray-300 text-sm">{type.name}</span>
                      </div>
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`${type.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-white text-sm w-12 text-right">{type.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Usage Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          {...fadeInUp}
        >
          {[
            {
              title: 'Storage Used',
              value: `${currentMonthUsage?.storageUsedGB.toFixed(1) || 0} GB`,
              icon: <HardDrive className="w-8 h-8" />,
              color: 'from-purple-500 to-purple-700',
              change: storageChange,
              period: 'this month'
            },
            {
              title: 'Bandwidth Used',
              value: `${currentMonthUsage?.bandwidthUsedGB.toFixed(1) || 0} GB`,
              icon: <Activity className="w-8 h-8" />,
              color: 'from-blue-500 to-blue-700',
              change: bandwidthChange,
              period: 'this month'
            },
            {
              title: 'Files Uploaded',
              value: currentMonthUsage?.filesUploaded || 0,
              icon: <Upload className="w-8 h-8" />,
              color: 'from-green-500 to-green-700',
              change: 12,
              period: 'this month'
            },
            {
              title: 'Files Downloaded',
              value: currentMonthUsage?.filesDownloaded || 0,
              icon: <Download className="w-8 h-8" />,
              color: 'from-pink-500 to-pink-700',
              change: -5,
              period: 'this month'
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
                <div className="flex items-center gap-1">
                  {card.change > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${card.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Math.abs(card.change).toFixed(1)}%
                  </span>
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
              <p className="text-gray-500 text-xs">{card.period}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Usage Chart */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
          {...fadeInUp}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Monthly Usage Trends</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-400 text-sm">Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-400 text-sm">Bandwidth</span>
              </div>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {stats.monthlyUsage.map((usage, index) => {
              const maxStorage = Math.max(...stats.monthlyUsage.map(u => u.storageUsedGB));
              const maxBandwidth = Math.max(...stats.monthlyUsage.map(u => u.bandwidthUsedGB));
              const storageWidth = (usage.storageUsedGB / maxStorage) * 100;
              const bandwidthWidth = (usage.bandwidthUsedGB / maxBandwidth) * 100;

              return (
                <div key={usage.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">
                      {new Date(usage.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-purple-400">{usage.storageUsedGB.toFixed(1)} GB</span>
                      <span className="text-blue-400">{usage.bandwidthUsedGB.toFixed(1)} GB</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${storageWidth}%` }}
                      />
                    </div>
                    <div className="bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${bandwidthWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
