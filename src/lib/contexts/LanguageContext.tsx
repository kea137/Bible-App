/**
 * Language Context
 * 
 * Provides language state and functions to change language across the app
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateLocalePreference } from '../services/preferences.service';
import { useAuth } from './AuthContext';
import { getUserData } from '../storage/auth-storage';
import { logger } from '../utils/logger';

const LANGUAGE_STORAGE_KEY = 'app_language';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (languageCode: string) => Promise<void>;
  isChangingLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language);
  const [isChangingLanguage, setIsChangingLanguage] = useState<boolean>(false);

  // Load saved language on mount and when authentication changes
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        // If authenticated, try to get user's language preference from backend
        // Explicitly convert to boolean to avoid native bridge type issues
        if (Boolean(isAuthenticated) === true) {
          const userData = await getUserData();
          if (userData?.data?.user?.language) {
            const userLanguage = userData.data.user.language;
            if (userLanguage !== i18n.language) {
              await i18n.changeLanguage(userLanguage);
              setCurrentLanguage(userLanguage);
              // Also save to local storage for offline use
              await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, userLanguage);
              return;
            }
          }
        }
        
        // Fall back to local storage if not authenticated or no user language
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage && savedLanguage !== i18n.language) {
          await i18n.changeLanguage(savedLanguage);
          setCurrentLanguage(savedLanguage);
        }
      } catch (error) {
        logger.error('[LANGUAGE] Failed to load saved language');
      }
    };

    loadSavedLanguage();
  }, [Boolean(isAuthenticated)]);

  const changeLanguage = async (languageCode: string) => {
    try {
      setIsChangingLanguage(true);
      
      // Change language in i18n
      await i18n.changeLanguage(languageCode);
      
      // Save to local storage
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
      
      // Update state
      setCurrentLanguage(languageCode);
      
      // If user is authenticated, update preference on backend
      // Explicitly convert to boolean to avoid native bridge type issues
      if (Boolean(isAuthenticated) === true) {
        try {
          await updateLocalePreference(languageCode);
        } catch (error) {
          logger.warn('[LANGUAGE] Failed to update locale preference on backend');
          // Don't throw - local change succeeded
        }
      }
    } catch (error) {
      logger.error('[LANGUAGE] Failed to change language');
      throw error;
    } finally {
      setIsChangingLanguage(false);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        isChangingLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
