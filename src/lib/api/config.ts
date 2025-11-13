/**
 * API Configuration
 * 
 * Configure the base URL for the Laravel backend API.
 * In production, this should be set via environment variables.
 */

// Default API URL - should be overridden by environment variable in production
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://bible.test';

// API endpoints
export const API_ENDPOINTS = {
  // CSRF token endpoint (required for Laravel Sanctum)
  csrf: '/sanctum/csrf-cookie',
  
  // Authentication endpoints (mobile-specific)
  login: '/api/mobile/auth/login',
  register: '/api/mobile/auth/register',
  logout: '/api/mobile/auth/logout',
  forgotPassword: '/api/mobile/auth/forgot-password',
  resetPassword: '/api/mobile/auth/reset-password',
  
  // User endpoints
  user: '/api/mobile/auth/user',
  
  // Mobile app endpoints
  home: '/api/home',
  dashboard: '/api/dashboard',
  onboarding: '/api/onboarding',
  share: '/api/share',
  sitemap: '/api/sitemap',
  
  // User preferences
  updateLocale: '/api/update-locale',
  updateTheme: '/api/update-theme',
  updateTranslations: '/api/update-translations',
  
  // Bibles
  bibles: '/api/bibles',
  biblesParallel: '/api/bibles/parallel',
  apiBibles: '/api/api-bibles',
  
  // Highlights
  verseHighlights: '/api/verse-highlights',
  highlightedVerses: '/api/highlighted-verses',
  
  // Notes
  notes: '/api/notes',
  
  // Reading plan
  readingPlan: '/api/reading-plan',
  readingProgress: '/api/reading-progress',
  
  // Lessons
  lessons: '/api/lessons',
  lessonProgress: '/api/lesson-progress',
} as const;

// API configuration
export const API_CONFIG = {
  timeout: 300000, 
  withCredentials: false, // Disable for Bearer token auth (Sanctum uses tokens, not cookies)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;
