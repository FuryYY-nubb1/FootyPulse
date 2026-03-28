import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        localStorage.removeItem('fp_token');
        localStorage.removeItem('fp_user');
        window.location.href = '/login';
      }
      return Promise.reject({ status, message: data?.message || 'Something went wrong' });
    }
    return Promise.reject({ message: 'Network error. Please try again.' });
  }
);

export default api;
