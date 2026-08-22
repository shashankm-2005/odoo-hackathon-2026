import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, type AuthSession } from '../services/authService';
import type { Profile, Employee, UserRole } from '../types';

interface AuthContextType {
  user: Profile | null;
  employee: Employee | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<AuthSession>;
  register: (params: {
    employeeId: string;
    fullName: string;
    email: string;
    password?: string;
    role: UserRole;
    department?: string;
    designation?: string;
    phone?: string;
  }) => Promise<AuthSession>;
  logout: () => Promise<void>;
  switchUser: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const current = authService.getCurrentSession();
      if (current) {
        setSession(current);
      }
    } catch (err) {
      console.error('Failed to load auth session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const newSession = await authService.login(email, password);
      setSession(newSession);
      return newSession;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (params: {
    employeeId: string;
    fullName: string;
    email: string;
    password?: string;
    role: UserRole;
    department?: string;
    designation?: string;
    phone?: string;
  }) => {
    setIsLoading(true);
    try {
      const newSession = await authService.register(params);
      setSession(newSession);
      return newSession;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const switchUser = async (email: string) => {
    setIsLoading(true);
    try {
      const newSession = await authService.login(email);
      setSession(newSession);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (updates: Partial<Profile>) => {
    if (!session) return;
    const updated = authService.updateCurrentProfile(updates);
    setSession(prev => prev ? { ...prev, user: updated } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        employee: session?.employee || null,
        role: session?.user?.role || null,
        isAuthenticated: !!session?.user,
        isLoading,
        login,
        register,
        logout,
        switchUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
