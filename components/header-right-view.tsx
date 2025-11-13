import { Button } from '@showcase/components/ui/button';
import { Text } from '@showcase/components/ui/text';
import { AvatarButton } from '@showcase/components/avatar-button';
import * as Updates from 'expo-updates';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

interface HeaderRightViewProps {
  onSettingsPress?: () => void;
}

export function HeaderRightView({ onSettingsPress }: HeaderRightViewProps) {
  const { isUpdateAvailable, isUpdatePending, isDownloading } = Updates.useUpdates();

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
        <AvatarButton onPress={onSettingsPress} />
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-2">
      <AvatarButton onPress={onSettingsPress} />
    </View>
  );
}
