import axios from 'axios';

// In Vercel monorepo, /api automatically routes to your backend via vercel.json
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_email');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    if (!error.response) {
      error.message = 'The server is waking up. Please wait 10 seconds and try again.';
    }
    return Promise.reject(error);
  }
);

export default api;