import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
instance.interceptors.request.use(
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

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    // Return the entire response object
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

const request = async (method, url, data = null, config = {}) => {
  try {
    const response = await instance({
      method,
      url,
      data,
      ...config,
    });
    
    // Extract the data from the response to handle our API format
    if (response && response.data) {
      // Handle our backend ResponseTrait format
      if (response.data.success !== undefined) {
        // For profile API where data is in message field
        if (response.data.message && typeof response.data.message === 'object' && response.data.data === null) {
          return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.message  // Use message as data when data is null
          };
        }
        // Standard format: { success: boolean, message: string, data: any }
        else if (response.data.data !== undefined) {
          return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data
          };
        }
      }
      
      // For regular axios responses, keep data property
      return response.data;
    }
    
    // Fallback for unexpected response format
    return response;
  } catch (error) {
    console.error('Request error:', error);
    throw error.response?.data || error;
  }
};

export default {
  get: (url, config) => request('get', url, null, config),
  post: (url, data, config) => request('post', url, data, config),
  put: (url, data, config) => request('put', url, data, config),
  delete: (url, config) => request('delete', url, null, config),
};
