import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

/**
 * Generic request function
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} url - API endpoint
 * @param {object} data - Request body (for POST, PUT)
 * @param {object} params - URL parameters (for GET)
 * @returns {Promise} - Response data
 */
const request = async ({ method = 'GET', url, data = null, params = null }) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      params,
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(errorMessage);
  }
};

// Convenience methods
const BaseApi = {
  get: (url, params) => request({ method: 'GET', url, params }),
  post: (url, data) => request({ method: 'POST', url, data }),
  put: (url, data) => request({ method: 'PUT', url, data }),
  delete: (url) => request({ method: 'DELETE', url }),
};

export default BaseApi;
