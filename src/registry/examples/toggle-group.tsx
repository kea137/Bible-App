import { ToggleGroup, ToggleGroupItem } from '@showcase/components/ui/toggle-group';
import { Text } from '@showcase/components/ui/text';
import * as React from 'react';
import { Bold, Italic, Underline } from 'lucide-react-native';

export function ToggleGroupPreview() {
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <ToggleGroup type="multiple" value={value} onValueChange={setValue}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold className="size-4" />
        <Text>Bold</Text>
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic className="size-4" />
        <Text>Italic</Text>
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline className="size-4" />
        <Text>Underline</Text>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
