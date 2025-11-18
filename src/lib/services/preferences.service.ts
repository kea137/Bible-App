/**
 * User Preferences Service
 * 
 * Service layer for updating user preferences (theme, locale, translations)
 */

import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';

/**
 * Update user theme preference
 */
export const updateThemePreference = async (theme: 'light' | 'dark' | 'system'): Promise<void> => {
  try {
    await apiClient.post(API_ENDPOINTS.updateTheme, { theme });
  } catch (error) {
    console.error('Failed to update theme preference:', error);
    throw error;
  }
};

/**
 * Update user locale preference
 */
export const updateLocalePreference = async (locale: string): Promise<void> => {
  try {
    await apiClient.post(API_ENDPOINTS.updateLocale, { locale });
  } catch (error) {
    console.error('Failed to update locale preference:', error);
    throw error;
  }
};

/**
 * Update user Bible translations preference
 */
export const updateTranslationsPreference = async (translations: number[]): Promise<void> => {
  try {
    await apiClient.post(API_ENDPOINTS.updateTranslations, { translations });
  } catch (error) {
    console.error('Failed to update translations preference:', error);
    throw error;
  }
};
