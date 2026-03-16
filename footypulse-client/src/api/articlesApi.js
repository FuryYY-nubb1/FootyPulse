import api from './axiosConfig';

export const articlesApi = {
  getAll: (params) => api.get('/articles', { params }),
  getById: (id) => api.get(`/articles/${id}`),
  getBySlug: (slug) => api.get(`/articles/slug/${slug}`),
  getFeatured: () => api.get('/articles', { params: { featured: true, limit: 5 } }),
  getByCategory: (category, params) => api.get('/articles', { params: { category, ...params } }),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
};
