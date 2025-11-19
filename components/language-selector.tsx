/**
 * Language Selector Component
 * 
 * Dropdown to select and change app language
 */

import * as React from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@showcase/components/ui/select';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { LANGUAGES } from '@/lib/i18n/config';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

export function LanguageSelector() {
  const { currentLanguage, changeLanguage, isChangingLanguage } = useLanguage();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = React.useState(currentLanguage);

  React.useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const handleLanguageChange = async (value: string | undefined) => {
    if (!value || value === currentLanguage) return;

    try {
      await changeLanguage(value);
      Toast.show({
        type: 'success',
        text1: t('Language Changed') || 'Language Changed',
        text2: t('App language updated successfully') || 'App language updated successfully',
      });
    } catch (error) {
      console.error('Failed to change language:', error);
      Toast.show({
        type: 'error',
        text1: t('Error') || 'Error',
        text2: t('Failed to change language') || 'Failed to change language',
      });
    }
  };

  const getCurrentLanguageName = () => {
    const lang = LANGUAGES.find((l) => l.code === currentLanguage);
    return lang?.name || 'English';
  };

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-sm font-medium">{t('Language') || 'Language'}</Text>
        <Text className="text-muted-foreground text-xs">
          {t('Select your preferred language') || 'Select your preferred language'}
        </Text>
      </View>
      <View className="ml-4">
        {isChangingLanguage ? (
          <ActivityIndicator size="small" />
        ) : (
          <Select
            value={{ value: currentLanguage, label: getCurrentLanguageName() }}
            onValueChange={(option) => handleLanguageChange(option?.value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('Select Language') || 'Select Language'} />
            </SelectTrigger>
            <SelectContent className="w-40" portalHost="root">
              <ScrollView style={{ maxHeight: 300 }}>
                <SelectGroup>
                  {LANGUAGES.map((language) => (
                    <SelectItem
                      key={language.code}
                      label={language.name}
                      value={language.code}
                    >
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </ScrollView>
            </SelectContent>
          </Select>
        )}
      </View>
    </View>
  );
}
