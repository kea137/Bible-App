import '../global.css';

import * as React from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@showcase/lib/theme';
import { HeaderRightView } from '@showcase/components/header-right-view';
import { AuthProvider } from '@/lib/contexts/AuthContext';

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

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: {
            color: colors.text,
            fontFamily: Platform.select({ ios: 'Instrument Sans', android: 'Instrument Sans' }) || undefined,
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
    </AuthProvider>
  );
}

// Removed helper until root cause of boolean/string screen prop mismatch is resolved.
