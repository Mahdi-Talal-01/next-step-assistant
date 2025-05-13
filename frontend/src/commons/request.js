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
    // Don't include data in the request config for DELETE method
    const requestConfig = {
      method,
      url,
      ...config,
    };
    
    // Only include data for methods that typically have a request body
    if (method.toLowerCase() !== 'delete' && data !== undefined) {
      requestConfig.data = data;
    }
    
    // Log detailed information for all request types
    console.log(`[REQUEST ${method.toUpperCase()} ${url}]`, { 
      method,
      url,
      config: requestConfig,
      headers: requestConfig.headers,
      hasData: !!requestConfig.data 
    });
    
    const response = await instance(requestConfig);
    
    // Log detailed response for all request types
    console.log(`[RESPONSE ${method.toUpperCase()} ${url}] Status: ${response.status}`, response.data);
    
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
    console.error(`[ERROR ${method.toUpperCase()} ${url}]`, error);
    
    // Log more details about the error
    if (error.response) {
      console.error('Error response details:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('Error request details:', error.request);
    }
    
    throw error.response?.data || error;
  }
};

export default {
  get: (url, config) => request('get', url, null, config),
  post: (url, data, config) => request('post', url, data, config),
  put: (url, data, config) => request('put', url, data, config),
  delete: (url, config) => request('delete', url, null, config),
  patch: (url, data, config) => request('patch', url, data, config),
};
