// ============================================
// src/api/authApi.js
// ============================================
// UPDATED: Added getMe() for token verification on every page load.
// ============================================

import api from './axiosConfig';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),               // Verify token & get current user
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => {
    localStorage.removeItem('fp_token');
    localStorage.removeItem('fp_user');
  },
};