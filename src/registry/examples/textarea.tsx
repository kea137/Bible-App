import { Textarea } from '@showcase/components/ui/textarea';
import { Label } from '@showcase/components/ui/label';
import * as React from 'react';
import { View } from 'react-native';

export function TextareaPreview() {
  return (
    <View className="w-full max-w-sm native:max-w-md gap-2">
      <Label nativeID="textarea-label">Your message</Label>
      <Textarea
        placeholder="Type your message here."
        aria-labelledby="textarea-label"
      />
    </View>
  );
}
