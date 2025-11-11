import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Input } from '@showcase/components/ui/input';
import { Label } from '@showcase/components/ui/label';
import { Checkbox } from '@showcase/components/ui/checkbox';
import { Link, useRouter } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { useState } from 'react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-6">
        <View className="w-full max-w-md gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-semibold">Log in to your account</Text>
            <Text className="text-sm text-muted-foreground">
              Enter your email and password below to log in
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

            {/* Password Field */}
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Label nativeID="password">Password</Label>
                <Link href="/auth/forgot-password" asChild>
                  <Text className="text-sm text-primary">Forgot password?</Text>
                </Link>
              </View>
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>

            {/* Remember Me */}
            <View className="flex-row items-center gap-3">
              <Checkbox 
                checked={remember}
                onCheckedChange={setRemember}
                aria-labelledby="remember-label"
              />
              <Label nativeID="remember-label">Remember me</Label>
            </View>

            {/* Submit Button */}
            <Button 
              className="mt-4 w-full"
              onPress={() => {
                // Mock login - no logic for now, just navigate to dashboard
                router.push('/dashboard');
              }}
            >
              <Text>Log in</Text>
            </Button>
          </View>

          {/* Footer */}
          <View className="flex-row items-center justify-center gap-1">
            <Text className="text-sm text-muted-foreground">
              Don't have an account?
            </Text>
            <Link href="/auth/register" asChild>
              <Text className="text-sm text-primary underline">Sign up</Text>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
