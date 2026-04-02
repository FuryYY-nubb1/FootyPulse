// ============================================
// src/routes/ProtectedRoute.jsx
// ============================================
// UPDATED: Handles loading state during token verification.
// Shows a loading indicator while AuthContext verifies the JWT,
// then redirects to /login if not authenticated.
// ============================================

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // While verifying token, show loading (prevents flash of login page)
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '1.1rem',
        color: 'var(--text-secondary, #888)',
      }}>
        Verifying authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}