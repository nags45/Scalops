// src/services/authService.js
import { authApi } from './api';

export const authService = {
  // Token verification
  verifyToken: () => 
    authApi.get('/api/auth'),
  
  // Local authentication
  login: (credentials) => 
    authApi.post('/api/auth/login', credentials),
  
  register: (userData) => 
    authApi.post('/api/auth/register', userData),
  
  // Google OAuth
  googleAuth: (code) => 
    authApi.post('/api/auth/google', { code }),
  
  // Microsoft OAuth (if you want to add it)
  microsoftAuth: (code) => 
    authApi.post('/api/auth/microsoft', { code }),
  
  // Password management
  forgotPassword: (email) => 
    authApi.post('/api/auth/forgot-password', { email }),
  
  resetPassword: (token, password) => 
    authApi.post('/api/auth/reset-password', { token, password }),
  
  changePassword: (passwords) => 
    authApi.put('/api/auth/change-password', passwords),
  
  // Session management
  logout: () => 
    authApi.post('/api/auth/logout'),
  
  refreshToken: () => 
    authApi.post('/api/auth/refresh'),
  
  revokeToken: () => 
    authApi.post('/api/auth/revoke'),
  
  // Multi-factor authentication
  enableMFA: () => 
    authApi.post('/api/auth/mfa/enable'),
  
  verifyMFA: (code) => 
    authApi.post('/api/auth/mfa/verify', { code }),
  
  disableMFA: () => 
    authApi.delete('/api/auth/mfa'),
  
  // OAuth account linking
  linkOAuthAccount: (provider, code) => 
    authApi.post('/api/auth/oauth/link', { provider, code }),
  
  unlinkOAuthAccount: (provider) => 
    authApi.delete(`/api/auth/oauth/unlink/${provider}`),
  
  // Account security
  getLoginHistory: () => 
    authApi.get('/api/auth/login-history'),
  
  getSecurityEvents: () => 
    authApi.get('/api/auth/security-events'),
  
  // Two-factor backup codes
  generateBackupCodes: () => 
    authApi.post('/api/auth/mfa/backup-codes'),
  
  verifyBackupCode: (code) => 
    authApi.post('/api/auth/mfa/backup-verify', { code }),
  
  // Account recovery
  initiateAccountRecovery: (email) => 
    authApi.post('/api/auth/recovery/initiate', { email }),
  
  completeAccountRecovery: (token, newPassword) => 
    authApi.post('/api/auth/recovery/complete', { token, newPassword }),
  
  // Social login status
  getSocialAccounts: () => 
    authApi.get('/api/auth/social-accounts'),
  
  // Device management
  getTrustedDevices: () => 
    authApi.get('/api/auth/trusted-devices'),
  
  removeTrustedDevice: (deviceId) => 
    authApi.delete(`/api/auth/trusted-devices/${deviceId}`),
  
  // Account lockout
  unlockAccount: (email) => 
    authApi.post('/api/auth/unlock', { email }),
  
  // Session timeout
  extendSession: () => 
    authApi.post('/api/auth/extend-session'),
};