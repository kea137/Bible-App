/**
 * Auth Storage
 * 
 * Utilities for persisting authentication tokens using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';

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
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (err) {
    logger.error('[AUTH STORAGE] Failed to save token');
    throw err;
  }
};

/**
 * Get authentication token
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return token;
  } catch (error) {
    logger.error('[AUTH STORAGE] Failed to get token');
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
    logger.error('[AUTH STORAGE] Failed to remove token');
  }
};

/**
 * Save user data
 */
export const setUserData = async (userData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (err) {
    logger.error('[AUTH STORAGE] Failed to save user data');
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
    logger.error('[AUTH STORAGE] Failed to get user data');
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
    logger.error('[AUTH STORAGE] Failed to remove user data');
  }
};

/**
 * Clear all auth storage
 */
export const clearAuthStorage = async (): Promise<void> => {
  logger.debug('[AUTH STORAGE] Clearing auth storage');
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
    ]);
  } catch (error) {
    logger.error('[AUTH STORAGE] Failed to clear storage');
  }
};
