import { Button } from '@showcase/components/ui/button';
import { Text } from '@showcase/components/ui/text';
import { AvatarButton } from '@showcase/components/avatar-button';
import { SettingsDialog } from '@showcase/components/settings-dialog';
import { useAuth } from '@/lib/contexts/AuthContext';
import * as Updates from 'expo-updates';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

export function HeaderRightView() {
  const { isUpdateAvailable, isUpdatePending, isDownloading } = Updates.useUpdates();
  const [settingsOpen, setSettingsOpen] = React.useState(false);

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
        <AvatarButton onPress={() => setSettingsOpen(true)} />
        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-2">
      <AvatarButton onPress={() => setSettingsOpen(true)} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </View>
  );
}
