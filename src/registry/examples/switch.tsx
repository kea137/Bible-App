import { Switch } from '@showcase/components/ui/switch';
import { Label } from '@showcase/components/ui/label';
import * as React from 'react';
import { View } from 'react-native';

export function SwitchPreview() {
  const [checked, setChecked] = React.useState(false);

  return (
    <View className="flex-row items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={setChecked}
        accessibilityLabelledBy="airplane-mode"
      />
      <Label nativeID="airplane-mode">Airplane Mode</Label>
    </View>
  );
}
