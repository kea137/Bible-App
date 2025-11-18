/**
 * Onboarding Service
 * 
 * Service layer for onboarding operations
 */

import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';

// Type definitions
export interface Bible {
  id: number;
  name: string;
  abbreviation: string;
  language: string;
  version: string;
}

export interface OnboardingData {
  bibles: Record<string, Bible[]>;
  currentLanguage: string;
  onboarding_completed: boolean;
}

export interface OnboardingPreferences {
  language: string;
  preferred_translations: number[];
  appearance_preferences: {
    theme: 'light' | 'dark' | 'system';
  };
}

export interface OnboardingResponse {
  success: boolean;
  data: OnboardingData;
}

export interface StoreOnboardingResponse {
  success: boolean;
  message: string;
  data: {
    user: any;
  };
}

/**
 * Get onboarding data (available bibles, current language)
 */
export const getOnboardingData = async (): Promise<OnboardingData> => {
  try {
    const response = await apiClient.get<OnboardingResponse>(API_ENDPOINTS.onboarding);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Store onboarding preferences
 */
export const storeOnboardingPreferences = async (
  preferences: OnboardingPreferences
): Promise<StoreOnboardingResponse> => {
  try {
    const response = await apiClient.post<StoreOnboardingResponse>(
      API_ENDPOINTS.onboarding,
      preferences
    );
    return response;
  } catch (error) {
    throw error;
  }
};
