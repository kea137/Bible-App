import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Input } from '@showcase/components/ui/input';
import { Label } from '@showcase/components/ui/label';
import { Checkbox } from '@showcase/components/ui/checkbox';
import { Link, useRouter } from 'expo-router';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { loginSchema, LoginFormData } from '@/lib/validation/auth.validation';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      // Reset errors
      setErrors({});
      
      // Validate form data
      const formData: LoginFormData = {
        email,
        password,
        remember,
      };
      
      const validated = loginSchema.parse(formData);
      
      // Submit login
      setIsSubmitting(true);
      await login({
        email: validated.email,
        password: validated.password,
        remember: validated.remember,
      });
      
      // Show success message
      Toast.show({
        type: 'success',
        text1: 'Login successful',
        text2: 'Welcome back!',
      });
      
      // Navigate to dashboard
      router.replace('/dashboard');
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else if (error.errors && typeof error.errors === 'object') {
        // API validation errors
        const fieldErrors: Record<string, string> = {};
        Object.keys(error.errors).forEach((key) => {
          fieldErrors[key] = error.errors[key][0];
        });
        setErrors(fieldErrors);
      } else {
        // General error
        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2: error.message || 'Invalid email or password',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
                editable={!isSubmitting}
              />
              {errors.email && (
                <Text className="text-sm text-destructive">{errors.email}</Text>
              )}
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
                editable={!isSubmitting}
              />
              {errors.password && (
                <Text className="text-sm text-destructive">{errors.password}</Text>
              )}
            </View>

            {/* Remember Me */}
            <View className="flex-row items-center gap-3">
              <Checkbox 
                checked={remember}
                onCheckedChange={setRemember}
                aria-labelledby="remember-label"
                disabled={isSubmitting}
              />
              <Label nativeID="remember-label">Remember me</Label>
            </View>

            {/* Submit Button */}
            <Button 
              className="mt-4 w-full"
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text>Log in</Text>
              )}
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
