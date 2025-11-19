/**
 * i18n Configuration
 * 
 * Configure internationalization for the app using i18next and react-i18next
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Import locale files
import en from '../../../locales/en.json';
import ar from '../../../locales/ar.json';
import de from '../../../locales/de.json';
import es from '../../../locales/es.json';
import fr from '../../../locales/fr.json';
import hi from '../../../locales/hi.json';
import it from '../../../locales/it.json';
import ja from '../../../locales/ja.json';
import ko from '../../../locales/ko.json';
import ru from '../../../locales/ru.json';
import sw from '../../../locales/sw.json';
import zh from '../../../locales/zh.json';

// Language resources
const resources = {
  en: { translation: en },
  ar: { translation: ar },
  de: { translation: de },
  es: { translation: es },
  fr: { translation: fr },
  hi: { translation: hi },
  it: { translation: it },
  ja: { translation: ja },
  ko: { translation: ko },
  ru: { translation: ru },
  sw: { translation: sw },
  zh: { translation: zh },
};

// Available languages with their display names
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية', rtl: true },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ru', name: 'Русский' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'zh', name: '中文' },
];

// Get device locale
const getDeviceLocale = (): string => {
  const locales = Localization.getLocales();
  if (locales && locales.length > 0) {
    const deviceLocale = locales[0].languageCode || 'en';
    // Check if we support this locale
    if (Object.keys(resources).includes(deviceLocale)) {
      return deviceLocale;
    }
  }
  return 'en'; // Default to English
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLocale(),
    fallbackLng: 'en',
    compatibilityJSON: 'v4', // Updated for compatibility
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for React Native
    },
  });

export default i18n;
