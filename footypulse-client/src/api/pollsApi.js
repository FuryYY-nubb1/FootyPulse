// ============================================
// src/api/pollsApi.js
// ============================================
// UPDATED: vote() no longer sends user_id in the body.
//          The server now extracts user_id from the JWT token
//          (sent automatically via the axios Authorization header).
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

  // GET /polls?match_id=:matchId  — fetch polls linked to a specific match
  getByMatch: (matchId) => api.get('/polls', { params: { match_id: matchId } }),

  // POST /polls/:id/votes  { selected_options }
  // REQUIRES AUTH: JWT token sent via Authorization header
  // user_id is extracted from the token on the server side
  // Returns: { success: true, data: { vote: {...}, poll: {...} } }
  vote: (pollId, data) => api.post(`/polls/${pollId}/votes`, data),

  // GET /polls/:id/results
  // Returns: { success: true, data: {...} }
  getResults: (id) => api.get(`/polls/${id}/results`),

  // GET /polls/:id/user-vote/:userId
  // Returns: { success: true, data: { has_voted: bool, vote: {...}|null } }
  getUserVote: (pollId, userId) => api.get(`/polls/${pollId}/user-vote/${userId}`),
};