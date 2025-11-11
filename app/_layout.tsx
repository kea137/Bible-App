import '../global.css';

import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { HeaderRightView } from '@showcase/components/header-right-view';
import { MobileFooter } from '@showcase/components/mobile-footer';
import { useGeistFont } from '@showcase/hooks/use-geist-font';
import { NAV_THEME } from '@showcase/lib/theme';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Text, View, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function RootLayout() {
  const [loaded, error] = useGeistFont();
  const { colorScheme } = useColorScheme();

  React.useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={NAV_THEME[colorScheme]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <GestureHandlerRootView
          style={{ flex: 1, backgroundColor: NAV_THEME[colorScheme].colors.background }}>
          <KeyboardProvider>
            <View style={{ flex: 1 }}>
              <Stack
                screenOptions={{
                  headerBackTitle: 'Back',
                  headerTitleStyle: {
                    fontFamily: 'Geist-Medium',
                    fontWeight: '500',
                  },
                  headerTitle(props) {
                    return (
                      <Text style={{ fontFamily: 'Geist-Medium', fontWeight: '500', fontSize: 20, color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
                        {toOptions(props.children.split('/').pop())}
                      </Text>
                    );
                  },
                  headerRight: () => <HeaderRightView />,
                }}>
                <Stack.Screen
                  name="index"
                  options={{
                    headerLargeTitle: true,
                    headerTitle: 'Bible App',
                    headerLargeTitleShadowVisible: false,
                    headerTransparent: true,
                  }}
                />
              </Stack>
            </View>
            {<MobileFooter />}
            <PortalHost />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function toOptions(name: string) {
  const title = name
    .split('-')
    .map(function (str: string) {
      return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    })
    .join(' ');
  return title;
}
