/**
 * API Configuration
 * 
 * Configure the base URL for the Laravel backend API.
 * In production, this should be set via environment variables.
 */

// Default API URL - should be overridden by environment variable in production
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

// API endpoints
export const API_ENDPOINTS = {
  // CSRF token endpoint (required for Laravel Sanctum)
  csrf: '/sanctum/csrf-cookie',
  
  // Authentication endpoints
  login: '/login',
  register: '/register',
  logout: '/logout',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  
  // User endpoints
  user: '/api/user',
} as const;

// API configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  withCredentials: true, // Required for CSRF cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;
