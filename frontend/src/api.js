import axios from 'axios';

// Create the axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Ensure your FastAPI server is running here
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor to handle global errors (like 401s)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Clearing token and redirecting to login...");
      localStorage.removeItem('access_token');
      // window.location.href = '/login'; // Optional: auto-redirect
    }
    return Promise.reject(error);
  }
);

export default api;