import { Input } from '@showcase/components/ui/input';
import { Label } from '@showcase/components/ui/label';
import * as React from 'react';
import { View } from 'react-native';

export function InputPreview() {
  return (
    <View className="w-full max-w-sm native:max-w-md gap-2">
      <Label nativeID="input-label">Email</Label>
      <Input
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </View>
  );
}
