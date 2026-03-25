import api from './axiosConfig';

export const matchesApi = {
  getAll: (params) => api.get('/matches', { params }),
  getById: (id) => api.get(`/matches/${id}`),
  getLive: () => api.get('/matches/live'),
  // Use the dedicated date endpoint that actually exists on the server
  getByDate: (date) => api.get(`/matches/date/${date}`),
  getByTeam: (teamId) => api.get(`/teams/${teamId}/matches`),
  getByCompetition: (compId, params) => api.get(`/competitions/${compId}/matches`, { params }),
  getLineup: (id) => api.get(`/matches/${id}/players`),
  getEvents: (id) => api.get(`/matches/${id}/events`),
  getStats: (id) => api.get(`/matches/${id}/stats`),
};