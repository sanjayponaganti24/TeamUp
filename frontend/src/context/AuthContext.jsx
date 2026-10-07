import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../services/api/auth-api.js';
import * as studentApi from '../services/api/student-api.js';
import { joinUserChannel } from '../services/socket/socket.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.data) {
        setUser(res.data.user);
        setStudent(res.data.student);
        joinUserChannel(res.data.user._id);
      }
    } catch {
      setUser(null);
      setStudent(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res.success && res.data) {
      setUser(res.data.user);
      setStudent(res.data.student);
      joinUserChannel(res.data.user._id);
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.success && res.data) {
      setUser(res.data.user);
      setStudent(res.data.student);
      joinUserChannel(res.data.user._id);
      return res.data;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setStudent(null);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await studentApi.getProfile();
      if (res.success && res.data) {
        setStudent(res.data);
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshProfile,
        setUser,
        setStudent,
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
