/**
 * API Configuration
 * 
 * Configure the base URL for the Laravel backend API.
 * In production, this should be set via environment variables.
 */
import { Platform } from 'react-native';

// Default API URL - should be overridden by environment variable in production
export const API_BASE_URL = Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_API_URL_IOS
  : process.env.EXPO_PUBLIC_API_URL || 'http://bible.test';


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
  home: '/api/mobile/home',
  dashboard: '/api/mobile/dashboard',
  onboarding: '/api/mobile/onboarding',
  share: '/api/mobile/share',
  sitemap: '/api/mobile/sitemap',
  
  // User preferences
  updateLocale: '/api/mobile/update-locale',
  updateTheme: '/api/mobile/update-theme',
  updateTranslations: '/api/mobile/update-translations',
  
  // Bibles
  bibles: '/api/mobile/bibles',
  biblesParallel: '/api/mobile/bibles/parallel',
  apiBibles: '/api/mobile/api-bibles',
  markAsRead: '/api/mobile/bibles/mark_as_read',
  
  // Highlights
  verseHighlights: '/api/mobile/verse-highlights',
  highlightedVerses: '/api/mobile/highlighted-verses',
  
  // Notes
  notes: '/api/mobile/notes',
  
  // Study
  VerseWithReferences: '/api/mobile/study',

  // Reading plan
  readingPlan: '/api/mobile/reading-plan',
  readingProgress: '/api/mobile/reading-progress',
  
  // Lessons
  lessons: '/api/mobile/lessons',
  lessonProgress: '/api/mobile/lesson-progress',
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
