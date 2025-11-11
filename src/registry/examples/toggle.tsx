import { Toggle } from '@showcase/components/ui/toggle';
import { Text } from '@showcase/components/ui/text';
import * as React from 'react';
import { Bold } from 'lucide-react-native';

export function TogglePreview() {
  const [pressed, setPressed] = React.useState(false);

  return (
    <Toggle pressed={pressed} onPressedChange={setPressed} aria-label="Toggle bold">
      <Bold className="size-4" />
      <Text>Bold</Text>
    </Toggle>
  );
}
