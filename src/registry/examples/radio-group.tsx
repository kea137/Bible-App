import { RadioGroup, RadioGroupItem } from '@showcase/components/ui/radio-group';
import { Label } from '@showcase/components/ui/label';
import * as React from 'react';
import { View } from 'react-native';

export function RadioGroupPreview() {
  const [value, setValue] = React.useState('default');

  return (
    <RadioGroup value={value} onValueChange={setValue} className="gap-3">
      <View className="flex-row items-center gap-2">
        <RadioGroupItem accessibilityLabelledBy="default-label" value="default" />
        <Label nativeID="default-label">Default</Label>
      </View>
      <View className="flex-row items-center gap-2">
        <RadioGroupItem accessibilityLabelledBy="comfortable-label" value="comfortable" />
        <Label nativeID="comfortable-label">Comfortable</Label>
      </View>
      <View className="flex-row items-center gap-2">
        <RadioGroupItem accessibilityLabelledBy="compact-label" value="compact" />
        <Label nativeID="compact-label">Compact</Label>
      </View>
    </RadioGroup>
  );
}
