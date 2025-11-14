/**
 * Auth Storage
 * 
 * Utilities for persisting authentication tokens using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const;

/**
 * Save authentication token
 */
export const setAuthToken = async (token: string): Promise<void> => {
  try {
    console.log('[AUTH STORAGE] Setting token:', token);
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    console.log('[AUTH STORAGE] Token saved');
  } catch (err) {
    console.error('[AUTH STORAGE] Failed to save token:', err);
    throw err;
  }
};

/**
 * Get authentication token
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    console.log('[AUTH STORAGE] Getting token:', token ? `Found (${token.substring(0, 20)}...)` : 'Not found');
    return token;
  } catch (error) {
    console.error('[AUTH STORAGE] Failed to get token:', error);
    return null;
  }
};

/**
 * Remove authentication token
 */
export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('[AUTH STORAGE] Failed to remove token:', error);
  }
};

/**
 * Save user data
 */
export const setUserData = async (userData: any): Promise<void> => {
  try {
    console.log('[AUTH STORAGE] Setting user data:', userData);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    console.log('[AUTH STORAGE] User data saved');
  } catch (err) {
    console.error('[AUTH STORAGE] Failed to save user data:', err);
    throw err;
  }
};

/**
 * Get user data
 */
export const getUserData = async (): Promise<any | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('[AUTH STORAGE] Failed to get user data:', error);
    return null;
  }
};

/**
 * Remove user data
 */
export const removeUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  } catch (error) {
    console.error('[AUTH STORAGE] Failed to remove user data:', error);
  }
};

/**
 * Clear all auth storage
 */
export const clearAuthStorage = async (): Promise<void> => {
  console.log('[AUTH STORAGE] clearAuthStorage called');
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
    ]);
  } catch (error) {
    console.error('[AUTH STORAGE] Failed to clear storage:', error);
  }
};
