import { Avatar, AvatarFallback, AvatarImage } from '@showcase/components/ui/avatar';
import { Text } from '@showcase/components/ui/text';
import * as React from 'react';

export function AvatarPreview() {
  return (
    <Avatar alt="User Avatar" className="w-12 h-12">
      <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
      <AvatarFallback>
        <Text>CN</Text>
      </AvatarFallback>
    </Avatar>
  );
}
