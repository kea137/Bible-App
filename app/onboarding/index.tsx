import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { useRouter } from 'expo-router';
import { 
  BookOpen, 
  Check, 
  Languages, 
  Palette,
} from 'lucide-react-native';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { getOnboardingData, storeOnboardingPreferences, Bible } from '@/lib/services/onboarding.service';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Checkbox } from '@showcase/components/ui/checkbox';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'sw', label: 'Swahili' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'ru', label: 'Русский' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ar', label: 'العربية' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'ko', label: '한국어' },
] as const;

export default function OnboardingScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { t } = useTranslation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [bibles, setBibles] = useState<Record<string, Bible[]>>({});
  
  // Form state
  const [selectedLanguage, setSelectedLanguage] = useState(user?.language || 'en');
  const [selectedTranslations, setSelectedTranslations] = useState<number[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>(
    user?.appearance_preferences?.theme || 'system'
  );

  const totalSteps = 3;

  const themes = [
    { value: 'light' as const, label: t('Light') || 'Light', icon: '☀️' },
    { value: 'dark' as const, label: t('Dark') || 'Dark', icon: '🌙' },
    { value: 'system' as const, label: t('System') || 'System', icon: '💻' },
  ];

  useEffect(() => {
    loadOnboardingData();
  }, []);

  const loadOnboardingData = async () => {
    try {
      setIsLoading(true);
      const data = await getOnboardingData();
      setBibles(data.bibles);
      
      // If user already has preferred translations, pre-select them
      if (user?.preferred_translations && user.preferred_translations.length > 0) {
        setSelectedTranslations(user.preferred_translations);
      }
    } catch (error) {
      console.error('Failed to load onboarding data:', error);
      Alert.alert(t('Error') || 'Error', t('Failed to load onboarding data. Please try again.') || 'Failed to load onboarding data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get all bibles (not filtered by language like web version)
  const allBibles = Object.values(bibles).flat();

  const canProceed = () => {
    if (currentStep === 1) return true;
    if (currentStep === 2) return selectedTranslations.length > 0;
    if (currentStep === 3) return true;
    return false;
  };

  const nextStep = () => {
    if (currentStep < totalSteps && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleTranslation = (id: number) => {
    if (selectedTranslations.includes(id)) {
      setSelectedTranslations(selectedTranslations.filter(tid => tid !== id));
    } else {
      setSelectedTranslations([...selectedTranslations, id]);
    }
  };

  const handleThemeSelection = (theme: 'light' | 'dark' | 'system') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTheme(theme);
    
    // Apply theme immediately for live preview
    if (theme === 'system') {
      // For system theme, we'd need to detect the system preference
      // For now, we'll just set it to the current system default
      setColorScheme(theme);
    } else {
      setColorScheme(theme);
    }
  };

  const completeOnboarding = async () => {
    try {
      setIsSaving(true);
      await storeOnboardingPreferences({
        language: selectedLanguage,
        preferred_translations: selectedTranslations,
        appearance_preferences: {
          theme: selectedTheme,
        },
      });
      
      // Refresh user data to get updated onboarding_completed status
      await refreshUser();
      
      // Navigate to dashboard
      router.replace('/dashboard');
    } catch (error) {
      console.error('Failed to save onboarding preferences:', error);
      Alert.alert(t('Error') || 'Error', t('Failed to save preferences. Please try again.') || 'Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const skipOnboarding = () => {
    router.replace('/dashboard');
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FDFDFC] dark:bg-[#0a0a0a]">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#FDFDFC] dark:bg-[#0a0a0a]">
      <View className="flex-1 items-center p-6 lg:justify-center lg:p-8">
        {/* Header */}
        <View className="mb-6 w-full max-w-[335px] lg:max-w-4xl">
          <View className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f53003]/10 dark:bg-[#FF4433]/10">
            <BookOpen size={32} color={colorScheme === 'dark' ? '#FF4433' : '#f53003'} />
          </View>
          <Text className="mb-2 text-center text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
            {t("Welcome! Let's get you started") || "Welcome! Let's get you started"}
          </Text>
          <Text className="mb-4 text-center text-[13px] leading-5 text-[#706f6c] dark:text-[#A1A09A]">
            {t("Let's personalize your Bible experience") || "Let's personalize your Bible experience"}
          </Text>
          <Text className="text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">
            {t('Step')} {currentStep} {t('of')} {totalSteps}
          </Text>
        </View>

        {/* Main Content */}
        <View className="w-full max-w-[335px] lg:max-w-4xl">
          <View className="rounded-lg bg-white p-6 pb-8 shadow-lg dark:bg-[#161615]">
            
            {/* Step 1: Language Selection */}
            {currentStep === 1 && (
              <View className="gap-4">
                <View className="flex-row items-center gap-2">
                  <Languages size={20} color={colorScheme === 'dark' ? '#FF4433' : '#f53003'} />
                  <Text className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                    {t('Choose your preferred language') || 'Choose your preferred language'}
                  </Text>
                </View>
                <Text className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                  {t('Select the language you want to use for the app interface') || 'Select the language you want to use for the app interface'}
                </Text>

                <View className="mt-2 gap-3">
                  {languages.map((lang) => (
                    <Button
                      key={lang.value}
                      variant="outline"
                      onPress={() => setSelectedLanguage(lang.value)}
                      className={`flex-row items-center justify-between border-2 ${
                        selectedLanguage === lang.value
                          ? 'border-[#f53003] bg-[#f53003]/10 dark:border-[#FF4433] dark:bg-[#FF4433]/10'
                          : 'border-[#e5e5e5] dark:border-[#333]'
                      }`}
                    >
                      <Text className={selectedLanguage === lang.value ? 'font-semibold' : ''}>
                        {lang.label}
                      </Text>
                      {selectedLanguage === lang.value && (
                        <Check size={16} color={colorScheme === 'dark' ? '#FF4433' : '#f53003'} />
                      )}
                    </Button>
                  ))}
                </View>
              </View>
            )}

            {/* Step 2: Bible Translations Selection */}
            {currentStep === 2 && (
              <View className="gap-4">
                <View className="flex-row items-center gap-2">
                  <BookOpen size={20} color={colorScheme === 'dark' ? '#FF4433' : '#f53003'} />
                  <Text className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                    {t('Select Your Preferred Bible Translations') || 'Select Your Preferred Bible Translations'}
                  </Text>
                </View>
                <Text className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                  {t("Choose the Bible translations you'd like to use for parallel reading and study") || "Choose the Bible translations you'd like to use for parallel reading and study"}
                </Text>
                <Text className="text-xs italic text-[#706f6c] dark:text-[#A1A09A]">
                  {t('You can select multiple translations') || 'You can select multiple translations'}
                </Text>

                <ScrollView className="max-h-[400px] rounded-md border border-[#e5e5e5] p-4 dark:border-[#333]">
                  {allBibles.length > 0 ? (
                    <View className="gap-3">
                      {allBibles.map((bible) => (
                        <View 
                          key={bible.id} 
                          className="flex-row items-start gap-3 rounded-lg border border-[#e5e5e5] p-3 dark:border-[#333]"
                        >
                          <Checkbox
                            checked={selectedTranslations.includes(bible.id)}
                            onCheckedChange={() => toggleTranslation(bible.id)}
                          />
                          <View className="flex-1">
                            <Text className="font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                              {bible.name}
                            </Text>
                            <Text className="text-xs text-[#706f6c] dark:text-[#A1A09A]">
                              {bible.abbreviation} - {bible.version}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View className="flex items-center justify-center py-8">
                      <Text className="text-[#706f6c] dark:text-[#A1A09A]">
                        {t('No translations available') || 'No translations available'}
                      </Text>
                    </View>
                  )}
                </ScrollView>

                {!canProceed() && (
                  <Text className="text-sm text-red-600 dark:text-red-400">
                    {t('Select at least one Bible translation') || 'Select at least one Bible translation'}
                  </Text>
                )}
              </View>
            )}

            {/* Step 3: Appearance Preferences */}
            {currentStep === 3 && (
              <View className="gap-4">
                <View className="flex-row items-center gap-2">
                  <Palette size={20} color={colorScheme === 'dark' ? '#FF4433' : '#f53003'} />
                  <Text className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                    {t('Customize Your Reading Experience') || 'Customize Your Reading Experience'}
                  </Text>
                </View>
                <Text className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                  {t('Choose your preferred theme for reading') || 'Choose your preferred theme for reading'}
                </Text>

                <View className="mt-2 flex-row gap-2">
                  {themes.map((theme) => (
                    <View key={theme.value} className="flex-1">
                      <Button
                        variant="outline"
                        onPress={() => handleThemeSelection(theme.value)}
                        className={`flex-col items-center justify-center border-2 pb-12 ${
                          selectedTheme === theme.value
                            ? 'border-[#f53003] bg-[#f53003]/10 dark:border-[#FF4433] dark:bg-[#FF4433]/10'
                            : 'border-[#e5e5e5] dark:border-[#333]'
                        }`}
                      >
                        <View className="items-center gap-2">
                          <Text className="text-2xl py-4">{theme.icon}</Text>
                          <Text className={`text-center text-sm ${selectedTheme === theme.value ? 'font-semibold text-[#1b1b18] dark:text-[#EDEDEC]' : 'text-[#706f6c] dark:text-[#A1A09A]'}`}>
                            {theme.label}
                          </Text>
                        </View>
                      </Button>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Navigation Buttons */}
            <View className="mt-6 flex-row items-center justify-between gap-4 border-t border-[#e5e5e5] pt-6 dark:border-[#333]">
              {currentStep > 1 ? (
                <Button variant="outline" onPress={previousStep}>
                  <Text>{t('Previous') || 'Previous'}</Text>
                </Button>
              ) : (
                <Button variant="ghost" onPress={skipOnboarding}>
                  <Text>{t('Skip for now') || 'Skip for now'}</Text>
                </Button>
              )}

              {currentStep < totalSteps ? (
                <Button 
                  onPress={nextStep} 
                  disabled={!canProceed()}
                  className="bg-[#1b1b18] dark:bg-[#eeeeec]"
                >
                  <Text className="text-white dark:text-[#1C1C1A]">{t('Next') || 'Next'}</Text>
                </Button>
              ) : (
                <Button 
                  onPress={completeOnboarding} 
                  disabled={isSaving || !canProceed()}
                  className="bg-[#1b1b18] dark:bg-[#eeeeec]"
                >
                  <Text className="text-white dark:text-[#1C1C1A]">
                    {isSaving ? t('Saving...') || 'Saving...' : t('Complete Setup') || 'Complete Setup'}
                  </Text>
                </Button>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
