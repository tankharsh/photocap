'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { 
  Camera, 
  Users, 
  Image, 
  Settings,
  TrendingUp,
  Activity,
  Calendar,
  User
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { admin } = useAuth();

  const stats = [
    {
      name: 'Total Photos',
      value: '2,543',
      change: '+12%',
      changeType: 'increase',
      icon: Image,
    },
    {
      name: 'Active Users',
      value: '847',
      change: '+5%',
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'Photo Sessions',
      value: '156',
      change: '+8%',
      changeType: 'increase',
      icon: Camera,
    },
    {
      name: 'System Health',
      value: '99.9%',
      change: '+0.1%',
      changeType: 'increase',
      icon: Activity,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'photo_upload',
      user: 'John Doe',
      action: 'uploaded 5 new photos',
      time: '2 minutes ago',
    },
    {
      id: 2,
      type: 'user_registration',
      user: 'Jane Smith',
      action: 'registered as new user',
      time: '1 hour ago',
    },
    {
      id: 3,
      type: 'photo_edit',
      user: 'Mike Johnson',
      action: 'edited photo "Sunset Beach"',
      time: '3 hours ago',
    },
    {
      id: 4,
      type: 'system',
      user: 'System',
      action: 'completed database backup',
      time: '6 hours ago',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {admin?.name}! Here's what's happening with PhotoCap today.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Activity className="w-3 h-3 mr-1" />
              Online
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="card p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span>{' '}
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 bg-gray-50 text-right">
              <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all activities →
              </a>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <button className="btn-primary w-full justify-center">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </button>
                <button className="btn-secondary w-full justify-center">
                  <Image className="w-4 h-4 mr-2" />
                  View Photos
                </button>
                <button className="btn-secondary w-full justify-center">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </button>
                <button className="btn-secondary w-full justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Backup
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">System Status</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-600">Healthy</div>
                <div className="text-sm text-gray-500">Database</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-600">Online</div>
                <div className="text-sm text-gray-500">File Storage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-600">Active</div>
                <div className="text-sm text-gray-500">Background Jobs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;