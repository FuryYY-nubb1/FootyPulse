

import api from './axiosConfig';

export const pollsApi = {
  getAll: (params) => api.get('/polls', { params }),

  getById: (id) => api.get(`/polls/${id}`),

  // GET /polls?status=active
  getActive: () => api.get('/polls', { params: { status: 'active' } }),

  // GET /polls?match_id=:matchId  — fetch polls linked to a specific match
  getByMatch: (matchId) => api.get('/polls', { params: { match_id: matchId } }),

  vote: (pollId, data) => api.post(`/polls/${pollId}/votes`, data),

  getResults: (id) => api.get(`/polls/${id}/results`),

  getUserVote: (pollId, userId) => api.get(`/polls/${pollId}/user-vote/${userId}`),
};