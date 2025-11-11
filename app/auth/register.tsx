import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Input } from '@showcase/components/ui/input';
import { Label } from '@showcase/components/ui/label';
import { Link, useRouter } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { useState } from 'react';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-6">
        <View className="w-full max-w-md gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-semibold">Create an account</Text>
            <Text className="text-sm text-muted-foreground">
              Enter your details below to create your account
            </Text>
          </View>

          {/* Form */}
          <View className="gap-6">
            {/* Name Field */}
            <View className="gap-2">
              <Label nativeID="name">Name</Label>
              <Input
                placeholder="Full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>

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
              <Label nativeID="password">Password</Label>
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
              />
            </View>

            {/* Confirm Password Field */}
            <View className="gap-2">
              <Label nativeID="confirmPassword">Confirm password</Label>
              <Input
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
              />
            </View>

            {/* Submit Button */}
            <Button 
              className="mt-2 w-full"
              onPress={() => {
                // Mock registration - no logic for now, just navigate to dashboard
                router.push('/dashboard');
              }}
            >
              <Text>Create account</Text>
            </Button>
          </View>

          {/* Footer */}
          <View className="flex-row items-center justify-center gap-1">
            <Text className="text-sm text-muted-foreground">
              Already have an account?
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
