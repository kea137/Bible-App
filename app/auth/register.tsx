import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Input } from '@showcase/components/ui/input';
import { Label } from '@showcase/components/ui/label';
import { Link, useRouter } from 'expo-router';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { registerSchema, RegisterFormData } from '@/lib/validation/auth.validation';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleRegister = async () => {
    try {
      // Reset errors
      setErrors({});
      
      // Validate form data
      const formData: RegisterFormData = {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      };
      
      const validated = registerSchema.parse(formData);
      
      // Submit registration
      setIsSubmitting(true);
      await register({
        name: validated.name,
        email: validated.email,
        password: validated.password,
        password_confirmation: validated.password_confirmation,
      });
      
      // Show success message
      Toast.show({
        type: 'success',
        text1: 'Registration successful',
        text2: 'Welcome to Bible App!',
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
          text1: 'Registration failed',
          text2: error.message || 'An error occurred during registration',
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
                editable={!isSubmitting}
              />
              {errors.name && (
                <Text className="text-sm text-destructive">{errors.name}</Text>
              )}
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
                editable={!isSubmitting}
              />
              {errors.email && (
                <Text className="text-sm text-destructive">{errors.email}</Text>
              )}
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
                editable={!isSubmitting}
              />
              {errors.password && (
                <Text className="text-sm text-destructive">{errors.password}</Text>
              )}
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
                editable={!isSubmitting}
              />
              {errors.password_confirmation && (
                <Text className="text-sm text-destructive">{errors.password_confirmation}</Text>
              )}
            </View>

            {/* Submit Button */}
            <Button 
              className="mt-2 w-full"
              onPress={handleRegister}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text>Create account</Text>
              )}
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
