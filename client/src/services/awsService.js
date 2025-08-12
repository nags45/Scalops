// src/services/awsService.js
import { awsApi } from './api';

export const awsService = {
  // Account connection
  connectAccount: (credentials) => 
    awsApi.post('/api/aws/awsConnect', credentials),
  
  disconnectAccount: () => 
    awsApi.delete('/api/aws/awsConnect'),
  
  getConnectionStatus: () => 
    awsApi.get('/api/aws/connection-status'),
  
  // Cost management
  getCosts: (params = {}) => 
    awsApi.get('/api/aws/costs', { params }),
  
  getCostByService: (service, period) => 
    awsApi.get(`/api/aws/costs/service/${service}`, { 
      params: { period } 
    }),
  
  getCostByRegion: (region, period) => 
    awsApi.get(`/api/aws/costs/region/${region}`, { 
      params: { period } 
    }),
  
  getCostTrends: (period = '30days') => 
    awsApi.get('/api/aws/costs/trends', { params: { period } }),
  
  // Resource management
  getResources: (type = 'all') => 
    awsApi.get('/api/aws/resources', { params: { type } }),
  
  getEC2Instances: () => 
    awsApi.get('/api/aws/resources/ec2'),
  
  getS3Buckets: () => 
    awsApi.get('/api/aws/resources/s3'),
  
  getRDSInstances: () => 
    awsApi.get('/api/aws/resources/rds'),
  
  getLambdaFunctions: () => 
    awsApi.get('/api/aws/resources/lambda'),
  
  // Billing and budgets
  getBillingHistory: (period = '12months') => 
    awsApi.get('/api/aws/billing', { params: { period } }),
  
  getCurrentBill: () => 
    awsApi.get('/api/aws/billing/current'),
  
  setBudgetAlert: (budget) => 
    awsApi.post('/api/aws/alerts/budget', budget),
  
  getBudgetAlerts: () => 
    awsApi.get('/api/aws/alerts/budget'),
  
  // Cost optimization
  getCostOptimization: () => 
    awsApi.get('/api/aws/optimization'),
  
  getUnusedResources: () => 
    awsApi.get('/api/aws/resources/unused'),
  
  getReservedInstances: () => 
    awsApi.get('/api/aws/resources/reserved'),
};