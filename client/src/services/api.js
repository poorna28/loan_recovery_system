import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

/**
 * Request Interceptor
 * Logs all outgoing requests and adds auth token if available
 */
api.interceptors.request.use(
  (config) => {
    // Log request
    console.log(`📤 [${config.method.toUpperCase()}] ${config.url}`, {
      params: config.params,
      data: config.data
    });

    // Add token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles successful responses and standardizes error handling
 */
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(`✅ [${response.status}] ${response.config.method.toUpperCase()} ${response.config.url}`, {
      data: response.data
    });

    return response;
  },
  (error) => {
    // Log error response
    console.error(`❌ [${error.response?.status || 'ERROR'}] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/';
      console.warn('🔐 Session expired. Redirecting to login...');
    }

    if (error.response?.status === 403) {
      console.warn('⛔ Access denied - you do not have permission for this action');
    }

    if (error.response?.status === 429) {
      console.error('⏱️ Too many requests - please try again later');
    }

    return Promise.reject(error);
  }
);

export default api;

