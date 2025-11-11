import { Label } from '@showcase/components/ui/label';
import { Checkbox } from '@showcase/components/ui/checkbox';
import * as React from 'react';
import { View } from 'react-native';

export function LabelPreview() {
  const [checked, setChecked] = React.useState(false);

  return (
    <View className="flex-row items-center gap-2">
      <Checkbox
        checked={checked}
        onCheckedChange={setChecked}
        aria-labelledby="label-preview"
      />
      <Label nativeID="label-preview">Accept terms and conditions</Label>
    </View>
  );
}
