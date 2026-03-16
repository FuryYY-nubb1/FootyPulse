import api from './axiosConfig';

export const competitionsApi = {
  getAll: (params) => api.get('/competitions', { params }),
  getById: (id) => api.get(`/competitions/${id}`),
  getSeasons: (id) => api.get(`/competitions/${id}/seasons`),
};
