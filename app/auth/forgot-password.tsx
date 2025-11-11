import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Input } from '@showcase/components/ui/input';
import { Label } from '@showcase/components/ui/label';
import { Link } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { useState } from 'react';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-6">
        <View className="w-full max-w-md gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-semibold">Forgot your password?</Text>
            <Text className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </Text>
          </View>

          {/* Form */}
          <View className="gap-6">
            {/* Email Field */}
            <View className="gap-2">
              <Label nativeID="email">Email address</Label>
              <Input
                placeholder="email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Submit Button */}
            <Button 
              className="w-full"
              onPress={() => {
                // Mock password reset - no logic for now
                console.log('Reset password pressed');
              }}
            >
              <Text>Send Reset Link</Text>
            </Button>
          </View>

          {/* Footer */}
          <View className="flex-row items-center justify-center gap-1">
            <Text className="text-sm text-muted-foreground">
              Remember your password?
            </Text>
            <Link href="/auth/login" asChild>
              <Text className="text-sm text-primary underline">Log in</Text>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
