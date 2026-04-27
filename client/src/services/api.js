import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
  baseURL: 'https://loan-recovery-system-7vv5.onrender.com/api',
=======
  baseURL: 'http://localhost:5000/api',
>>>>>>> 06eb77230932ab7784391e9b63e7d1558b33ac85
  // Enable sending cookies with requests (for httpOnly cookie authentication)
  withCredentials: true
});

/**
 * Request Interceptor
 * Logs all outgoing requests
 * NOTE: Token is now sent via httpOnly cookie automatically
 */
api.interceptors.request.use(
  (config) => {
    // Log request
    // console.log(`📤 [${config.method.toUpperCase()}] ${config.url}`, {
    //   params: config.params,
    //   data: config.data
    // });

    // No need to add token manually - cookies are sent automatically with withCredentials: true
    // This prevents XSS attacks that could steal tokens from localStorage

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
    // console.log(`✅ [${response.status}] ${response.config.method.toUpperCase()} ${response.config.url}`, {
    //   data: response.data
    // });

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
      // Unauthorized - session expired
      // Clear any local session data if present
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
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

