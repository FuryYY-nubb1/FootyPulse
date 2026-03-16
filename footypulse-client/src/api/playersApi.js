import api from './axiosConfig';

export const playersApi = {
  getAll: (params) => api.get('/persons', { params }),
  getById: (id) => api.get(`/persons/${id}`),
  getStats: (id, seasonId) => api.get(`/persons/${id}/stats`, { params: { seasonId } }),
  getCareer: (id) => api.get(`/persons/${id}/contracts`),
  getAchievements: (id) => api.get(`/persons/${id}/achievements`),
  getTransfers: (id) => api.get(`/persons/${id}/transfers`),
};
