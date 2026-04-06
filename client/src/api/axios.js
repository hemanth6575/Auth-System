import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // Important for sending/receiving HTTP-only cookies
});

// Response interceptor to handle token refresh seamlessly
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet and not hitting auth/login
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login') {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const res = await axios.get(`${API_URL}/auth/refresh`, {
          withCredentials: true
        });
        
        const accessToken = res.data.accessToken;
        
        // set default header
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        // set header for this request
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed or expired
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
