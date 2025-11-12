import { Button } from '@showcase/components/ui/button';
import { Text } from '@showcase/components/ui/text';
import { ThemeToggle } from '@showcase/components/theme-toggle';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'expo-router';
import * as Updates from 'expo-updates';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { LogOut } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export function HeaderRightView() {
  const { isUpdateAvailable, isUpdatePending, isDownloading } = Updates.useUpdates();
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  async function onReload() {
    try {
      if (!isUpdatePending) {
        await Updates.fetchUpdateAsync();
      }
      await Updates.reloadAsync();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await logout();
      Toast.show({
        type: 'success',
        text1: 'Logged out',
        text2: 'You have been successfully logged out',
      });
      router.replace('/auth/login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout failed',
        text2: 'An error occurred while logging out',
      });
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (isUpdateAvailable) {
    return (
      <View className="flex-row items-center gap-2">
        <Button
          size="sm"
          className="h-7 rounded-full bg-transparent active:bg-transparent"
          onPress={onReload}
          disabled={isDownloading}>
          {isDownloading ? (
            <ActivityIndicator color="white" size="small" className="scale-75" />
          ) : (
            <Text className="text-sky-600 dark:text-sky-500">Update</Text>
          )}
        </Button>
        {isAuthenticated && (
          <Button
            size="sm"
            className="h-7 rounded-full bg-transparent active:bg-transparent"
            onPress={handleLogout}
            disabled={isLoggingOut}>
            {isLoggingOut ? (
              <ActivityIndicator size="small" className="scale-75" />
            ) : (
              <LogOut size={16} className="text-destructive" />
            )}
          </Button>
        )}
        <ThemeToggle />
      </View>
    );
  }

  if (isAuthenticated) {
    return (
      <View className="flex-row items-center gap-2">
        <Button
          size="sm"
          className="h-7 rounded-full bg-transparent active:bg-transparent"
          onPress={handleLogout}
          disabled={isLoggingOut}>
          {isLoggingOut ? (
            <ActivityIndicator size="small" className="scale-75" />
          ) : (
            <LogOut size={16} className="text-destructive" />
          )}
        </Button>
        <ThemeToggle />
      </View>
    );
  }

  return <ThemeToggle />;
}
