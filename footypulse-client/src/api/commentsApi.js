import api from './axiosConfig';

export const commentsApi = {
  getByArticle: (articleId, params) => api.get(`/articles/${articleId}/comments`, { params }),
  create: (articleId, data) => api.post(`/articles/${articleId}/comments`, data),
  update: (id, data) => api.put(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
};
