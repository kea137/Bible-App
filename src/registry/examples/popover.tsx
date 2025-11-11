import { Popover, PopoverContent, PopoverTrigger } from '@showcase/components/ui/popover';
import { Button } from '@showcase/components/ui/button';
import { Text } from '@showcase/components/ui/text';
import * as React from 'react';

export function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Text>Open popover</Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Text className="font-semibold">Popover Title</Text>
        <Text className="text-sm text-muted-foreground mt-2">
          This is a popover content. You can place any content here.
        </Text>
      </PopoverContent>
    </Popover>
  );
}
