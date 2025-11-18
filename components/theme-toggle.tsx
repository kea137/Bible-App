import { Button } from '@showcase/components/ui/button';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'nativewind';
import { Image, type ImageStyle } from 'react-native';
import { updateThemePreference } from '@/lib/services/preferences.service';
import { useAuth } from '@/lib/contexts/AuthContext';

const THEME_TOGGLE_IMAGES = {
  light: require('@showcase/assets/images/theme-toggle-light.png'),
  dark: require('@showcase/assets/images/theme-toggle-dark.png'),
};

const IMAGE_STYLE: ImageStyle = {
  height: 22,
  width: 22,
};

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { isAuthenticated, refreshUser } = useAuth();

  async function toggleColorScheme() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const newTheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newTheme);
    
    // Save to database if user is authenticated
    if (isAuthenticated) {
      try {
        await updateThemePreference(newTheme);
        // Refresh user data to get updated preferences
        await refreshUser();
      } catch (error) {
        console.error('Failed to save theme preference:', error);
        // Theme is still applied locally even if save fails
      }
    }
  }

  return (
    <Button
      onPress={toggleColorScheme}
      variant="ghost"
      size="icon"
      className="web:mr-5 size-9 rounded-full">
      <Image source={THEME_TOGGLE_IMAGES[colorScheme]} style={IMAGE_STYLE} />
    </Button>
  );
}
