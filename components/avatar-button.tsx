import { Button } from '@showcase/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@showcase/components/ui/avatar';
import { Text } from '@showcase/components/ui/text';
import { useAuth } from '@/lib/contexts/AuthContext';
import * as Haptics from 'expo-haptics';
import * as React from 'react';

interface AvatarButtonProps {
  onPress: () => void;
}

export function AvatarButton({ onPress }: AvatarButtonProps) {
  const { user, isAuthenticated } = useAuth();

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }

  // Get user initials from name
  const getUserInitials = (name: string) => {
    if (!name) return 'G';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Button
      onPress={handlePress}
      variant="ghost"
      size="icon"
      className="web:mr-5 size-9 rounded-full p-0">
      <Avatar className="size-8" alt="User avatar">
        {/* If user has an avatar image, it would go here */}
        {/* <AvatarImage source={{ uri: user?.avatar }} /> */}
        <AvatarFallback>
          <Text className="text-foreground text-xs font-medium">
            {isAuthenticated && user ? getUserInitials(user.name) : 'G'}
          </Text>
        </AvatarFallback>
      </Avatar>
    </Button>
  );
}
