import { AspectRatio } from '@showcase/components/ui/aspect-ratio';
import { Text } from '@showcase/components/ui/text';
import * as React from 'react';
import { Image, View } from 'react-native';

export function AspectRatioPreview() {
  return (
    <View className="w-full max-w-sm native:max-w-md">
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80',
          }}
          className="h-full w-full rounded-md"
          resizeMode="cover"
        />
      </AspectRatio>
      <Text className="mt-2 text-sm text-muted-foreground">Photo by Drew Beamer</Text>
    </View>
  );
}
