import { Button } from '@showcase/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@showcase/components/ui/dialog';
import { Text } from '@showcase/components/ui/text';
import { ThemeToggle } from '@showcase/components/theme-toggle';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { LogOut } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { getUserData } from '@showcase/src/lib/storage/auth-storage';
import { Link } from 'expo-router';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { isAuthenticated, logout} = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    getUserData().then((result) => {
      setUser(result.data.user);
    });
  }, []);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await logout();
      Toast.show({
        type: 'success',
        text1: 'Logged out',
        text2: 'You have been successfully logged out',
      });
      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" portalHost="root">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your app preferences and account settings
          </DialogDescription>
        </DialogHeader>
        <View className="gap-4 py-4">
          {/* Theme Section */}
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-sm font-medium">Theme</Text>
              <Text className="text-muted-foreground text-xs">
                Toggle between light and dark mode
              </Text>
            </View>
            <ThemeToggle />
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-sm font-medium">Reading Plan</Text>
              <Link href="/reading-plan" onPress={()=>{
                onOpenChange(false)
              }} asChild>
              <Button variant="outline" className="ml-4 mt-2">
                <Text>Reading Plan</Text>
              </Button>
            </Link>
            </View>
          </View>

        {/* User Info Section */}
        {isAuthenticated && user && (
          <View className="border-border border-t pt-4">
            <Text className="text-sm font-medium">Account</Text>
            <View className="mt-2 gap-1">
              <Text className="text-muted-foreground text-xs">Name: {user.name}</Text>
              <Text className="text-muted-foreground text-xs">Email: {user.email}</Text>
            </View>
          </View>
        )}

        </View>
        <DialogFooter>
          {isAuthenticated && (
            <Button
              variant="destructive"
              onPress={handleLogout}
              disabled={isLoggingOut}
              className="flex-row gap-2">
              {isLoggingOut ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <LogOut size={16} className="text-white" />
                  <Text className="text-white">Logout</Text>
                </>
              )}
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="outline">
              <Text>Close</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
