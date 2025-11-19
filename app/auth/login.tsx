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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@showcase/components/ui/alert-dialog';
import * as React from 'react';
import { PortalHost } from '@rn-primitives/portal';
import { useTranslation } from 'react-i18next';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export function Alert({ message, open, onOpenChange }: { message: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useTranslation();
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent portalHost="root">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">{t('Error') || 'Error'}</AlertDialogTitle>
          <AlertDialogDescription>
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>{t('Cancel') || 'Cancel'}</Text>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AlertSuccess({ message, open, onOpenChange }: { message: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useTranslation();
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent portalHost="root">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primary">{t('Success') || 'Success'}</AlertDialogTitle>
          <AlertDialogDescription>
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>{t('Cancel') || 'Cancel'}</Text>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checker, setChecker] = useState(false);
  const [checkerSuccess, setCheckerSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      setErrors({});
      const formData: LoginFormData = { email, password, remember };
      const validated = loginSchema.parse(formData);
      setIsSubmitting(true);
      await login({
        email: validated.email,
        password: validated.password,
        remember: validated.remember,
      });
      setAlertMessage(t('Login successful!') || 'Login successful!');
      setCheckerSuccess(true);
      router.replace('/');
    } catch (error: any) {
      if (error.errors && Array.isArray(error.errors)) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
        setAlertMessage(error.message.message || 'Validation error');
        setChecker(true);
      } else if (error.errors && typeof error.errors === 'object') {
        const fieldErrors: Record<string, string> = {};
        Object.keys(error.errors).forEach((key) => {
          fieldErrors[key] = error.errors[key][0];
        });
        setErrors(fieldErrors);
        setAlertMessage(error.message || t('Validation error') || 'Validation error');
        setChecker(true);
      } else {
        setAlertMessage(error.message || t('Login failed. Please try again.') || 'Login failed. Please try again.');
        setChecker(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <PortalHost name="root" />
      <Alert open={checker} onOpenChange={setChecker} message={alertMessage} />
      <AlertSuccess open={checkerSuccess} onOpenChange={setChecker} message={alertMessage} />
      <View className="flex-1 items-center justify-center p-6">
        <View className="w-full max-w-md gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-semibold">{t('Log in to your account') || 'Log in to your account'}</Text>
            <Text className="text-sm text-muted-foreground">
              {t('Enter your email and password below to log in') || 'Enter your email and password below to log in'}
            </Text>
          </View>

          {/* Form */}
          <View className="gap-6">
            {/* Email Field */}
            <View className="gap-2">
              <Label nativeID="email">{t('Email address') || 'Email address'}</Label>
              <Input
                placeholder={t('email@example.com') || 'email@example.com'}
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
                <Label nativeID="password">{t('Password') || 'Password'}</Label>
                <Link href="/auth/forgot-password" asChild>
                  <Text className="text-sm text-primary">{t('Forgot password?') || 'Forgot password?'}</Text>
                </Link>
              </View>
              <Input
                placeholder={t('Password') || 'Password'}
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
              <Label nativeID="remember-label">{t('Remember me') || 'Remember me'}</Label>
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
                <Text>{t('Log in') || 'Log in'}</Text>
              )}
            </Button>
          </View>

          {/* Footer */}
          <View className="flex-row items-center justify-center gap-1">
            <Text className="text-sm text-muted-foreground">
              {t("Don't have an account?") || "Don't have an account?"}
            </Text>
            <Link href="/auth/register" asChild>
              <Text className="text-sm text-primary underline">{t('Sign up') || 'Sign up'}</Text>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
