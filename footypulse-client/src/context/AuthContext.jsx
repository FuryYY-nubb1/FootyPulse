// ============================================
// src/context/AuthContext.jsx
// ============================================
// UPDATED: Verifies JWT token on every app load by calling /auth/me.
// If the token is invalid or expired, the user is logged out automatically.
// This ensures authentication is validated on every page load.
// ============================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start true — verify token first

  const isAuthenticated = !!user;

  // ─── Verify token on app load / every page refresh ───
  // This ensures that stale or tampered tokens are caught immediately.
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('fp_token');
      const storedUser = localStorage.getItem('fp_user');

      if (!token || !storedUser) {
        // No token stored — user is not logged in
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Call /auth/me to verify the token is still valid on the server
        const res = await authApi.getMe();
        const verifiedUser = res?.data || res;
        // Update stored user data with server-verified data
        localStorage.setItem('fp_user', JSON.stringify(verifiedUser));
        setUser(verifiedUser);
      } catch (err) {
        // Token is invalid or expired — clear everything and force re-login
        console.warn('Token verification failed:', err.message);
        localStorage.removeItem('fp_token');
        localStorage.removeItem('fp_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const res = await authApi.login(credentials);
      const { token, user: userData } = res?.data || res;
      localStorage.setItem('fp_token', token);
      localStorage.setItem('fp_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.register(userData);
      const { token, user: newUser } = res?.data || res;
      localStorage.setItem('fp_token', token);
      localStorage.setItem('fp_user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((data) => {
    const updated = { ...user, ...data };
    localStorage.setItem('fp_user', JSON.stringify(updated));
    setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}