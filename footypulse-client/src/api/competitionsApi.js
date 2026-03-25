import api from './axiosConfig';

export const competitionsApi = {
  getAll: (params) => api.get('/competitions', { params }),
  getById: (id) => api.get(`/competitions/${id}`),
  getSeasons: (id) => api.get(`/competitions/${id}/seasons`),
  getMatches: (id, params) => api.get(`/competitions/${id}/matches`, { params }),
  getScorers: (id, params) => api.get(`/competitions/${id}/scorers`, { params }),
  getNews: (id, params) => api.get(`/competitions/${id}/news`, { params }),
};