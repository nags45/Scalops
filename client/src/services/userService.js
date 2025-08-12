// src/services/userService.js
import { userApi } from './api';

export const userService = {
  // User profile
  getProfile: () => 
    userApi.get('/api/user/profile'),
  
  updateProfile: (data) => 
    userApi.put('/api/user/profile', data),
  
  deleteAccount: () => 
    userApi.delete('/api/user/account'),
  
  // User preferences
  getPreferences: () => 
    userApi.get('/api/user/preferences'),
  
  updatePreferences: (preferences) => 
    userApi.put('/api/user/preferences', preferences),
  
  // User management (admin only)
  getAllUsers: (params) => 
    userApi.get('/api/user/all', { params }),
  
  getUserById: (userId) => 
    userApi.get(`/api/user/${userId}`),
  
  updateUserRole: (userId, role) => 
    userApi.put(`/api/user/${userId}/role`, { role }),
  
  deactivateUser: (userId) => 
    userApi.put(`/api/user/${userId}/deactivate`),
  
  // User search and filtering
  searchUsers: (query, filters = {}) => 
    userApi.get('/api/user/search', { 
      params: { query, ...filters } 
    }),
  
  // User statistics
  getUserStats: () => 
    userApi.get('/api/user/stats'),
  
  // User activity
  getUserActivity: (userId, period = '30days') => 
    userApi.get(`/api/user/${userId}/activity`, { 
      params: { period } 
    }),
  
  // User verification
  verifyEmail: (token) => 
    userApi.post('/api/user/verify-email', { token }),
  
  resendVerification: (email) => 
    userApi.post('/api/user/resend-verification', { email }),
  
  // User sessions
  getUserSessions: () => 
    userApi.get('/api/user/sessions'),
  
  revokeSession: (sessionId) => 
    userApi.delete(`/api/user/sessions/${sessionId}`),
  
  revokeAllSessions: () => 
    userApi.delete('/api/user/sessions/all'),
};