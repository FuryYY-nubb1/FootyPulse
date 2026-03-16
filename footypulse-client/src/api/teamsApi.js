import api from './axiosConfig';

export const teamsApi = {
  getAll: (params) => api.get('/teams', { params }),
  getById: (id) => api.get(`/teams/${id}`),
  getSquad: (id) => api.get(`/teams/${id}/squad`),
  getStats: (id, seasonId) => api.get(`/teams/${id}/stats`, { params: { seasonId } }),
  getFixtures: (id) => api.get(`/teams/${id}/matches`),
  getTransfers: (id) => api.get(`/teams/${id}/transfers`),
};
