import axios from 'axios';

// ─── BASE URL CONFIGURATION ─────────────────────────────────────────────────
// 1. First, try the environment variable.
// 2. Second, fallback to your specific Render production URL.
// 3. Last, fallback to localhost for development.
const BASE_URL = import.meta.env.VITE_API_URL || 
                 'https://weather-dashboard-api-v821.onrender.com';

// Helpful console check for debugging
if (import.meta.env.DEV) {
  console.log(`[API] Connecting to: ${BASE_URL}`);
}

// Create the axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Increased to 30s to allow Render free tier time to "wake up" from sleep
  timeout: 30000, 
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

// Response interceptor to handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Handle Token Expiry (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized. Logging out...");
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_email');
      
      // Forces a page refresh to trigger the App.jsx redirect to /login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // 2. Handle Network Errors / Backend Sleeping
    if (!error.response) {
      error.message = 'The server is taking a moment to wake up. Please wait 10 seconds and try again.';
    }
    
    return Promise.reject(error);
  }
);

export default api;