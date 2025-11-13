import '../global.css';

import * as React from 'react';
import { Platform } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@showcase/lib/theme';
import { HeaderRightView } from '@showcase/components/header-right-view';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { MobileFooter } from '@showcase/components/mobile-footer';

// Completely stripped layout to isolate RNSScreen boolean/string prop issue.

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
  // Hide footer on auth pages (anything under /auth) and welcome screen.
  const hideFooter = pathname.startsWith('/auth') || pathname === '/welcome';

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: colors.card,
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#333' : '#e5e5e5',
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
          headerRight: () => <HeaderRightView />,
        }}
      >
        <Stack.Screen name="index" options={{ headerTitle: 'Bible App' }} />
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
    </AuthProvider>
  );
}

// Removed helper until root cause of boolean/string screen prop mismatch is resolved.
