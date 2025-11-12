import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Input } from '@showcase/components/ui/input';
import { Label } from '@showcase/components/ui/label';
import { Link, useRouter } from 'expo-router';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/lib/validation/auth.validation';
import Toast from 'react-native-toast-message';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { forgotPassword } = useAuth();

  const handleForgotPassword = async () => {
    try {
      // Reset errors
      setErrors({});
      
      // Validate form data
      const formData: ForgotPasswordFormData = {
        email,
      };
      
      const validated = forgotPasswordSchema.parse(formData);
      
      // Submit forgot password request
      setIsSubmitting(true);
      const response = await forgotPassword({
        email: validated.email,
      });
      
      // Show success message
      Toast.show({
        type: 'success',
        text1: 'Email sent',
        text2: response.message || 'Password reset link has been sent to your email',
      });
      
      // Navigate back to login
      router.push('/auth/login');
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
          text1: 'Error',
          text2: error.message || 'Failed to send reset link',
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
                editable={!isSubmitting}
              />
              {errors.email && (
                <Text className="text-sm text-destructive">{errors.email}</Text>
              )}
            </View>

            {/* Submit Button */}
            <Button 
              className="w-full"
              onPress={handleForgotPassword}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text>Send Reset Link</Text>
              )}
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
