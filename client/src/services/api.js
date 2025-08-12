// src/services/api.js
import axios from 'axios';

// Microservices configuration - Use import.meta.env for Vite
const SERVICES = {
  AUTH: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:5000',
  USER: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:5001', 
  AWS: import.meta.env.VITE_AWS_SERVICE_URL || 'http://localhost:5002'
};

const API_TIMEOUT = 30000; // 30 seconds

// Create axios instances for each service
const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - add auth token
  instance.interceptors.request.use(
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

  // Response interceptor - handle common errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create service-specific API instances
export const authApi = createApiInstance(SERVICES.AUTH);
export const userApi = createApiInstance(SERVICES.USER);
export const awsApi = createApiInstance(SERVICES.AWS);

// Export services object for easy access
export const API_SERVICES = {
  AUTH: SERVICES.AUTH,
  USER: SERVICES.USER,
  AWS: SERVICES.AWS
};

export default { authApi, userApi, awsApi };