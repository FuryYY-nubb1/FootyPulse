import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000, // increased from 15s → 30s to allow for Neon cold starts
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

      if (status === 429) {
        return Promise.reject({
          status: 429,
          message: 'Too many requests — please slow down and try again in a moment.',
        });
      }

      return Promise.reject({
        status,
        message: data?.message || 'Something went wrong',
      });
    }

    // Network timeout
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return Promise.reject({
        message: 'Request timed out. The database may be waking up — please retry.',
      });
    }

    return Promise.reject({ message: 'Network error. Please try again.' });
  }
);

export default api;
