import { Checkbox } from '@showcase/components/ui/checkbox';
import { Label } from '@showcase/components/ui/label';
import * as React from 'react';
import { View } from 'react-native';

export function CheckboxPreview() {
  const [checked, setChecked] = React.useState(false);

  return (
    <View className="flex-row items-center gap-2">
      <Checkbox
        checked={checked}
        onCheckedChange={setChecked}
        aria-labelledby="checkbox-label"
      />
      <Label nativeID="checkbox-label">Accept terms and conditions</Label>
    </View>
  );
}
