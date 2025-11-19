# i18n Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         App Entry Point                         │
│                     (app/_layout.tsx)                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              i18n Initialization                        │  │
│  │           import '@/lib/i18n/config'                    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                             ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │           AuthProvider (existing)                       │  │
│  │  ┌───────────────────────────────────────────────────┐  │  │
│  │  │        LanguageProvider (new)                     │  │  │
│  │  │  ┌─────────────────────────────────────────────┐  │  │  │
│  │  │  │          Stack Navigation               │  │  │  │  │
│  │  │  │          + All Screens                 │  │  │  │  │
│  │  │  └─────────────────────────────────────────────┘  │  │  │
│  │  └───────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────────┐
│   Device Locale  │ (Auto-detected on first launch)
└────────┬─────────┘
         ↓
┌────────────────────────────────────────────────────────────┐
│              i18n Config (src/lib/i18n/config.ts)          │
│  • Loads 12 locale JSON files                             │
│  • Sets device language or fallback to English            │
│  • Configures i18next                                      │
└────────┬───────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────────┐
│        LanguageContext (src/lib/contexts/...)              │
│  • Manages current language state                         │
│  • Provides changeLanguage() function                      │
│  • Handles persistence (AsyncStorage)                      │
│  • Syncs with backend API                                  │
└────────┬───────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────────┐
│                    Components                              │
│  • Use useTranslation() hook                               │
│  • Call t('key') to get translations                       │
│  • Use useLanguage() for language management               │
└────────────────────────────────────────────────────────────┘
```

## Language Change Flow

```
User Action: Select Language in Settings
              ↓
┌─────────────────────────────────────────┐
│  LanguageSelector Component             │
│  • Shows dropdown with 12 languages     │
│  • User clicks new language             │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  LanguageContext.changeLanguage()       │
│  1. Set loading state                   │
│  2. Change i18n language                │
│  3. Save to AsyncStorage                │
│  4. Update context state                │
│  5. If authenticated: API call          │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  Backend API (if authenticated)         │
│  POST /api/mobile/update-locale         │
│  • Updates user.language in DB          │
│  • Returns success                      │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  UI Updates                             │
│  • All t() calls re-render              │
│  • New language text displayed          │
│  • Toast notification shown             │
│  • Loading state cleared                │
└─────────────────────────────────────────┘
```

## Login Flow with Language Sync

```
User Login
    ↓
┌──────────────────────────────────┐
│  AuthContext                     │
│  • User authenticates            │
│  • Sets isAuthenticated=true     │
└────────┬─────────────────────────┘
         ↓
┌──────────────────────────────────┐
│  LanguageContext (useEffect)     │
│  • Detects auth change           │
│  • Fetches user data             │
│  • Reads user.language           │
└────────┬─────────────────────────┘
         ↓
┌──────────────────────────────────┐
│  Language Sync                   │
│  • If user.language exists       │
│  • Change to user's language     │
│  • Save to AsyncStorage          │
│  • Update UI                     │
└──────────────────────────────────┘
```

## File Structure

```
Bible-App/
├── locales/
│   ├── en.json         (English - Default)
│   ├── ar.json         (Arabic - RTL)
│   ├── de.json         (German)
│   ├── es.json         (Spanish)
│   ├── fr.json         (French)
│   ├── hi.json         (Hindi)
│   ├── it.json         (Italian)
│   ├── ja.json         (Japanese)
│   ├── ko.json         (Korean)
│   ├── ru.json         (Russian)
│   ├── sw.json         (Swahili)
│   └── zh.json         (Chinese)
├── src/lib/
│   ├── i18n/
│   │   └── config.ts   (i18n setup & configuration)
│   ├── contexts/
│   │   └── LanguageContext.tsx  (State management)
│   └── services/
│       └── preferences.service.ts (API calls)
├── components/
│   ├── language-selector.tsx    (UI component)
│   └── settings-dialog.tsx      (Integration point)
├── app/
│   ├── _layout.tsx             (Provider integration)
│   └── welcome.tsx             (Example usage)
└── docs/
    ├── i18n-guide.md           (Quick start)
    └── TRANSLATION_IMPLEMENTATION.md (Full docs)
```

## Component Integration Example

```tsx
// Any screen or component
import { useTranslation } from 'react-i18next';

export default function MyScreen() {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('Welcome to Bible App')}</Text>
      <Button>
        <Text>{t('Get Started')}</Text>
      </Button>
    </View>
  );
}
```

## Storage Layers

```
┌─────────────────────────────────────────────────┐
│  Layer 1: Device (First Launch)                │
│  • Detects device system language               │
│  • Uses as initial language                     │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│  Layer 2: AsyncStorage (Local)                 │
│  • Key: 'app_language'                          │
│  • Persists across app restarts                │
│  • Works offline                                │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│  Layer 3: Backend Database (Cloud)             │
│  • User.language field                          │
│  • Syncs when authenticated                     │
│  • Restored on login                            │
└─────────────────────────────────────────────────┘
```

## Priority Order for Language Selection

1. **User Manual Selection** (highest priority)
   - User explicitly changes language in settings

2. **Backend User Preference** (when authenticated)
   - Loaded from user.language on login
   - Synced across devices

3. **Local Storage** (AsyncStorage)
   - Previous selection when not authenticated
   - Offline fallback

4. **Device System Language** (first launch only)
   - Auto-detected from device settings
   - If supported in available languages

5. **Default Fallback** (English)
   - When none of above available
   - Always guaranteed to exist

## Key Benefits

✅ **Offline First**: Works without internet
✅ **Cloud Sync**: Preference follows user across devices
✅ **Smart Defaults**: Auto-detects device language
✅ **Performance**: Translations loaded once at startup
✅ **Type Safe**: Full TypeScript support
✅ **Maintainable**: Centralized translation files
✅ **Scalable**: Easy to add new languages
✅ **User Friendly**: Instant language switching
