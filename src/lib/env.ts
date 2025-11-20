/**
 * Environment Configuration and Validation
 * 
 * Validates and exports environment variables with security checks
 */

import { Platform } from 'react-native';
import { logger } from './utils/logger';

/**
 * Environment variable configuration
 */
interface EnvConfig {
  apiUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Validate that required environment variables are set
 */
function validateEnvVars(): void {
  const apiUrl = Platform.OS === 'ios' 
    ? process.env.EXPO_PUBLIC_API_URL_IOS || process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_API_URL;

  // In production, API URL should be HTTPS
  if (process.env.NODE_ENV === 'production' && apiUrl) {
    if (!apiUrl.startsWith('https://') && !apiUrl.includes('localhost')) {
      logger.warn(
        'Security Warning: API URL should use HTTPS in production. ' +
        `Current URL: ${apiUrl}`
      );
    }
  }

  // Warn about missing API URL (will fall back to default)
  if (!apiUrl && process.env.NODE_ENV === 'production') {
    logger.warn(
      'Warning: EXPO_PUBLIC_API_URL not set. Using default value. ' +
      'Set this environment variable for production deployments.'
    );
  }
}

/**
 * Get environment configuration
 */
export function getEnvConfig(): EnvConfig {
  validateEnvVars();

  return {
    apiUrl: Platform.OS === 'ios' 
      ? process.env.EXPO_PUBLIC_API_URL_IOS || process.env.EXPO_PUBLIC_API_URL || 'http://bible.test'
      : process.env.EXPO_PUBLIC_API_URL || 'http://bible.test',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  };
}

/**
 * Check if the app is running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development' || (typeof __DEV__ !== 'undefined' && __DEV__);
}

/**
 * Check if the app is running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}
