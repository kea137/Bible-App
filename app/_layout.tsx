import '../global.css';

import * as React from 'react';
import { Platform } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@showcase/lib/theme';
import { HeaderRightView } from '@showcase/components/header-right-view';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import { MobileFooter } from '@showcase/components/mobile-footer';
import { SettingsDialog } from '@showcase/components/settings-dialog';
import { PortalHost } from '@rn-primitives/portal';
import '@/lib/i18n/config'; // Initialize i18n
import { useTranslation } from 'react-i18next';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme];
  const colors = theme.colors;
  const pathname = usePathname();
  // Hide footer on auth pages (anything under /auth), welcome screen, and onboarding.
  const hideFooter = pathname.startsWith('/auth') || pathname === '/welcome' || pathname === '/onboarding';
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const { t } = useTranslation();

  return (
    <AuthProvider>
      <LanguageProvider>
        <Stack
          screenOptions={{
            headerBackTitle: t('Back'),
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              color: colors.text,
              // Use Instrument Sans natively; on web fall back to CSS variable if defined
              fontFamily: Platform.select({
                ios: 'Instrument Sans',
                android: 'Instrument Sans',
                web: 'var(--font-sans), Instrument Sans, ui-sans-serif, system-ui, sans-serif'
              }) || undefined,
              fontSize: 18,
            },
            headerRight: () => <HeaderRightView onSettingsPress={() => setSettingsOpen(true)} />,
          }}
        >
          <Stack.Screen name="index" options={{ headerTitle: 'Bible App' }} />
          <Stack.Screen
            name="onboarding/index"
            options={{
              headerTitle: 'Setup',
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="dashboard"
            options={{
              headerTitle: 'Dashboard',
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
        </Stack>
        {!hideFooter && <MobileFooter />}
        <PortalHost name="root" />
        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </LanguageProvider>
    </AuthProvider>
  );
}