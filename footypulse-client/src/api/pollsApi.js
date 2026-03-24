// ============================================
// src/api/pollsApi.js
// ============================================
// NOTE: axiosConfig interceptor already returns response.data,
// so api.get() returns the server's JSON body directly.
// Do NOT chain .then(res => res.data) — that would double-unwrap.
// ============================================

import api from './axiosConfig';

export const pollsApi = {
  // GET /polls?page=1&limit=9&status=active
  // Returns: { data: [...], pagination: {...} }
  getAll: (params) => api.get('/polls', { params }),

  // GET /polls/:id
  // Returns: { success: true, data: {...} }
  getById: (id) => api.get(`/polls/${id}`),

  // GET /polls?status=active
  getActive: () => api.get('/polls', { params: { status: 'active' } }),

  // POST /polls/:id/votes  { user_id, selected_options }
  // Returns: { success: true, data: { vote: {...}, poll: {...} } }
  vote: (pollId, data) => api.post(`/polls/${pollId}/votes`, data),

  // GET /polls/:id/results
  // Returns: { success: true, data: {...} }
  getResults: (id) => api.get(`/polls/${id}/results`),

  // GET /polls/:id/user-vote/:userId
  // Returns: { success: true, data: { has_voted: bool, vote: {...}|null } }
  getUserVote: (pollId, userId) => api.get(`/polls/${pollId}/user-vote/${userId}`),
};