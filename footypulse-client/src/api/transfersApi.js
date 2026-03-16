import api from './axiosConfig';

export const transfersApi = {
  getAll: (params) => api.get('/transfers', { params }),
  getById: (id) => api.get(`/transfers/${id}`),
  getByTeam: (teamId) => api.get(`/teams/${teamId}/transfers`),
  getByPlayer: (playerId) => api.get(`/persons/${playerId}/transfers`),
  getLatest: () => api.get('/transfers', { params: { sort: '-date', limit: 20 } }),
};
