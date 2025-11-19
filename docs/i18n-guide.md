# i18n Translation Guide

This app supports multiple languages using i18next and react-i18next.

## Supported Languages

- English (en)
- Arabic (ar) - RTL
- German (de)
- Spanish (es)
- French (fr)
- Hindi (hi)
- Italian (it)
- Japanese (ja)
- Korean (ko)
- Russian (ru)
- Swahili (sw)
- Chinese (zh)

## Using Translations in Components

Import `useTranslation` from react-i18next:

```tsx
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <Text>{t('Welcome to Bible App')}</Text>
  );
}
```

## Fallback Pattern

Always provide a fallback value for translations:

```tsx
<Text>{t('Welcome to Bible App') || 'Welcome to Bible App'}</Text>
```

## Changing Language

Users can change the language through Settings:
1. Open Settings Dialog (gear icon in header)
2. Select Language from the dropdown
3. Language preference is saved locally and synced to backend if authenticated

### Language Synchronization

- **On Login**: The app automatically loads the user's language preference from the backend
- **On Language Change**: When authenticated, changes are synced to the backend
- **Offline Support**: Language preference is stored locally for offline use
- **Fallback**: If no saved preference exists, the app uses the device's system language

## For Developers

### Adding New Translation Keys

1. Add the key-value pair to all locale files in `/locales/`
2. Use the key in your component with `t('Your Key')`

### Language Context

The `LanguageContext` provides:
- `currentLanguage`: Current language code
- `changeLanguage(code)`: Function to change language
- `isChangingLanguage`: Loading state

```tsx
import { useLanguage } from '@/lib/contexts/LanguageContext';

const { currentLanguage, changeLanguage } = useLanguage();
```

## Translation Files Location

All translation files are located in `/locales/` directory and are JSON files with flat key-value structure mirroring the web app at https://github.com/kea137/Bible
