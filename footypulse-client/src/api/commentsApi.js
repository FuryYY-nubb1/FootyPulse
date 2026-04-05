
import api from './axiosConfig';

export const commentsApi = {
  // GET /comments/article/:articleId
  getByArticle: (articleId, params) => api.get(`/comments/article/${articleId}`, { params }),

  // POST /comments — body: { article_id, user_id, user_name, content }
  create: (data) => api.post('/comments', data),

  // PUT /comments/:id (auth required)
  update: (id, data) => api.put(`/comments/${id}`, data),

  // DELETE /comments/:id (auth required)
  delete: (id) => api.delete(`/comments/${id}`),

  // PATCH /comments/:id/like
  like: (id) => api.patch(`/comments/${id}/like`),
};