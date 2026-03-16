import api from './axiosConfig';

export const pollsApi = {
  getAll: (params) => api.get('/polls', { params }),
  getById: (id) => api.get(`/polls/${id}`),
  getActive: () => api.get('/polls', { params: { active: true } }),
  vote: (pollId, data) => api.post(`/polls/${pollId}/votes`, data),
  getResults: (id) => api.get(`/polls/${id}/results`),
};
