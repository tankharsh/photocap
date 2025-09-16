'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import Cookies from 'js-cookie';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get('admin_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await adminApi.verifyToken();
      if (response.admin) {
        setAdmin(response.admin);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove('admin_token');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await adminApi.login(email, password);
      if (response.admin) {
        setAdmin(response.admin);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      await adminApi.register(name, email, password);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await adminApi.logout();
      setAdmin(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      setAdmin(null);
      Cookies.remove('admin_token');
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    admin,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!admin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};