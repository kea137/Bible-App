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

  // Load saved language on mount
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage && savedLanguage !== i18n.language) {
          await i18n.changeLanguage(savedLanguage);
          setCurrentLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Failed to load saved language:', error);
      }
    };

    loadSavedLanguage();
  }, []);

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
      if (isAuthenticated) {
        try {
          await updateLocalePreference(languageCode);
        } catch (error) {
          console.error('Failed to update locale preference on backend:', error);
          // Don't throw - local change succeeded
        }
      }
    } catch (error) {
      console.error('Failed to change language:', error);
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
