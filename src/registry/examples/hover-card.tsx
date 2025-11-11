import { HoverCard, HoverCardContent, HoverCardTrigger } from '@showcase/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@showcase/components/ui/avatar';
import { Button } from '@showcase/components/ui/button';
import { Text } from '@showcase/components/ui/text';
import * as React from 'react';
import { View } from 'react-native';

export function HoverCardPreview() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">
          <Text>@nextjs</Text>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <View className="flex-row justify-between gap-4">
          <Avatar alt="Vercel avatar" className="h-12 w-12">
            <AvatarImage source={{ uri: 'https://github.com/vercel.png' }} />
            <AvatarFallback>
              <Text>VC</Text>
            </AvatarFallback>
          </Avatar>
          <View className="flex-1 gap-1">
            <Text className="text-sm font-semibold">@nextjs</Text>
            <Text className="text-sm">The React Framework – created and maintained by @vercel.</Text>
            <View className="flex-row items-center pt-2">
              <Text className="text-muted-foreground text-xs">Joined December 2021</Text>
            </View>
          </View>
        </View>
      </HoverCardContent>
    </HoverCard>
  );
}
