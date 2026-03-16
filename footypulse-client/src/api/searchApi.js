import api from './axiosConfig';

export const searchApi = {
  search: (query, params) => api.get('/search', { params: { q: query, ...params } }),
};
