import { Separator } from '@showcase/components/ui/separator';
import { Text } from '@showcase/components/ui/text';
import * as React from 'react';
import { View } from 'react-native';

export function SeparatorPreview() {
  return (
    <View className="w-full max-w-sm native:max-w-md">
      <View className="gap-1">
        <Text className="text-sm font-medium leading-none">Radix Primitives</Text>
        <Text className="text-muted-foreground text-sm">An open-source UI component library.</Text>
      </View>
      <Separator className="my-4" />
      <View className="flex-row h-5 items-center gap-4 text-sm">
        <Text>Blog</Text>
        <Separator orientation="vertical" />
        <Text>Docs</Text>
        <Separator orientation="vertical" />
        <Text>Source</Text>
      </View>
    </View>
  );
}
