/**
 * Auth Storage
 * 
 * Utilities for persisting authentication tokens using react-native-mmkv
 */

import { MMKV } from 'react-native-mmkv';
import { Platform } from 'react-native';

// Initialize MMKV storage with platform-specific encryption
const storage = new MMKV({
  id: 'auth-storage',
  // Only use encryption on native platforms; web doesn't support it
  ...(Platform.OS !== 'web' && { encryptionKey: 'bible-app-auth-key' }), // In production, use a more secure key
});

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const;

/**
 * Save authentication token
 */
export const setAuthToken = (token: string): void => {
  console.log('[AUTH STORAGE] Setting token:', token);
  storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  console.log('[AUTH STORAGE] Token saved, verifying...');
  const saved = storage.getString(STORAGE_KEYS.AUTH_TOKEN);
  console.log('[AUTH STORAGE] Token verification:', saved === token ? 'SUCCESS' : 'FAILED');
};

/**
 * Get authentication token
 */
export const getAuthToken = (): string | undefined => {
  const token = storage.getString(STORAGE_KEYS.AUTH_TOKEN);
  console.log('[AUTH STORAGE] Getting token:', token ? `Found (${token.substring(0, 20)}...)` : 'Not found');
  return token;
};

/**
 * Remove authentication token
 */
export const removeAuthToken = (): void => {
  storage.delete(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Save user data
 */
export const setUserData = (userData: any): void => {
  console.log('[AUTH STORAGE] Setting user data:', userData);
  storage.set(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  console.log('[AUTH STORAGE] User data saved, verifying...');
  const saved = storage.getString(STORAGE_KEYS.USER_DATA);
  console.log('[AUTH STORAGE] User data verification:', saved ? 'SUCCESS' : 'FAILED');
};

/**
 * Get user data
 */
export const getUserData = (): any | null => {
  const data = storage.getString(STORAGE_KEYS.USER_DATA);
  return data ? JSON.parse(data) : null;
};

/**
 * Remove user data
 */
export const removeUserData = (): void => {
  storage.delete(STORAGE_KEYS.USER_DATA);
};

/**
 * Clear all auth storage
 */
export const clearAuthStorage = (): void => {
  removeAuthToken();
  removeUserData();
};
