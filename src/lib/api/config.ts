/**
 * API Configuration
 * 
 * Configure the base URL for the Laravel backend API.
 * In production, this should be set via environment variables.
 */
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get environment - check if we're in production
const IS_PRODUCTION = Constants.expoConfig?.extra?.eas?.projectId && 
                      !__DEV__;

// Validate and get API URL
function getApiBaseUrl(): string {
  const iosUrl = process.env.EXPO_PUBLIC_API_URL_IOS;
  const defaultUrl = process.env.EXPO_PUBLIC_API_URL;
  
  // In production, require HTTPS URLs
  if (IS_PRODUCTION) {
    const url = Platform.OS === 'ios' ? iosUrl : defaultUrl;
    
    if (!url) {
      throw new Error(
        'EXPO_PUBLIC_API_URL is required in production. Please set it in your environment variables.'
      );
    }
    
    if (!url.startsWith('https://')) {
      throw new Error(
        'API URL must use HTTPS in production. Insecure HTTP connections are not allowed.'
      );
    }
    
    return url;
  }
  
  // Development: allow HTTP for localhost
  return Platform.OS === 'ios' 
    ? (iosUrl || 'http://localhost:8000')
    : (defaultUrl || 'http://localhost:8000');
}

export const API_BASE_URL = getApiBaseUrl();


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
