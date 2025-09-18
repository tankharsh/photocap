'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Home, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  HardDrive,
  User,
  Bell,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { apiService, handleApiError } from '@/lib/api';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    checkAuth();

    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiService.checkAuth();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect to login even if logout API fails
      router.push('/login');
    }
  };

  const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'Events', href: '/dashboard/events', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Clients', href: '/dashboard/clients', icon: <Users className="w-5 h-5" /> },
    { name: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Storage', href: '/dashboard/storage', icon: <HardDrive className="w-5 h-5" /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const sidebarVariants = {
    expanded: {
      width: 256, // w-64
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    },
    collapsed: {
      width: 80, // w-20
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    },
    mobile_open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    },
    mobile_closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 h-full bg-gray-900/98 backdrop-blur-xl border-r border-gray-700/50 z-50 shadow-2xl overflow-hidden"
        variants={sidebarVariants}
        animate={
          isMobile
            ? (sidebarOpen ? "mobile_open" : "mobile_closed")
            : (sidebarCollapsed ? "collapsed" : "expanded")
        }
        initial="expanded"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                <Camera className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <span className="text-lg font-bold text-white block">PhotoCap</span>
                  <span className="text-xs text-gray-400 block">Studio Dashboard</span>
                </div>
              )}
            </Link>
            <div className="flex items-center gap-2">
              {/* Desktop Collapse Button */}
              <button
                className="hidden lg:block p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Menu className="w-5 h-5" />
              </button>
              {/* Mobile Close Button */}
              <button
                className="lg:hidden text-gray-400 hover:text-white transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} py-3 rounded-xl transition-all duration-300 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white shadow-lg shadow-purple-500/10 border border-purple-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/60 hover:shadow-md'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  {item.icon}
                  {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}

                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-gray-700">
                      {item.name}
                      <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-gray-700"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-700/50">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} mb-4 p-3 bg-gray-800/50 rounded-xl`}>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg relative group">
                <User className="w-6 h-6 text-white" />
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-gray-700">
                    {user?.firstName} {user?.lastName}
                    <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-gray-700"></div>
                  </div>
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-xs text-green-400">Online</span>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} w-full py-3 text-gray-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl transition-all duration-300 group relative`}
              title={sidebarCollapsed ? 'Logout' : ''}
            >
              <LogOut className="w-4 h-4 group-hover:text-red-400" />
              {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}

              {/* Tooltip for collapsed state */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-gray-700">
                  Logout
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-gray-700"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <header className="bg-gray-900/98 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search Bar */}
              <div className="hidden md:flex items-center space-x-3 bg-gray-800/60 rounded-xl px-4 py-3 min-w-[350px] border border-gray-700/30 focus-within:border-purple-500/30 transition-all duration-300">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events, clients, projects..."
                  className="bg-transparent text-white placeholder-gray-400 outline-none flex-1 text-sm"
                />
                <kbd className="px-2 py-1 text-xs text-gray-400 bg-gray-700/50 rounded border border-gray-600/50">⌘K</kbd>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 group">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3 bg-gray-800/50 rounded-xl px-3 py-2 border border-gray-700/30">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <span className="text-sm font-semibold text-white block">
                    {user?.firstName}
                  </span>
                  <span className="text-xs text-gray-400">Studio Owner</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
          {children}
        </main>
      </div>
    </div>
  );
}
