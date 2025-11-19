import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Link } from 'expo-router';
import { 
  BookOpen, 
  Calendar, 
  Highlighter, 
  Library, 
  Link2, 
  Moon, 
  NotebookPen, 
  SplitSquareHorizontal 
} from 'lucide-react-native';
import { View, ScrollView, Image } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function WelcomeScreen() {
  const { colorScheme } = useColorScheme();
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  console.log(user, isAuthenticated);

  const features = [
    {
      icon: BookOpen,
      title: t('Multiple Bible Translations') || 'Multiple Bible Translations',
    },
    {
      icon: SplitSquareHorizontal,
      title: t('Parallel Bible Reading') || 'Parallel Bible Reading',
    },
    {
      icon: Highlighter,
      title: t('Highlight & Bookmark') || 'Highlight & Bookmark',
    },
    {
      icon: NotebookPen,
      title: t('Personal Notes') || 'Personal Notes',
    },
    {
      icon: Calendar,
      title: t('Reading Plans') || 'Reading Plans',
    },
    {
      icon: Link2,
      title: t('Cross References') || 'Cross References',
    },
    {
      icon: Library,
      title: t('Verse Study Tools') || 'Verse Study Tools',
    },
    {
      icon: Moon,
      title: t('Dark Mode') || 'Dark Mode',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-[#FDFDFC] dark:bg-[#0a0a0a]">
      <View className="flex-1 items-center p-6 lg:justify-center lg:p-8">
        {/* Header */}
        <View className="mb-6 w-full max-w-[335px] lg:max-w-4xl">
          <View className="flex-row items-center justify-end gap-4">
            <Link href="/auth/login" asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="border-transparent dark:border-transparent"
              >
                <Text>{t('Log in') || 'Log in'}</Text>
              </Button>
            </Link>
            <Link href="/auth/register" asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="border-[#19140035] dark:border-[#3E3E3A]"
              >
                <Text>{t('Register') || 'Register'}</Text>
              </Button>
            </Link>
          </View>
        </View>

        {/* Main Content */}
        <View className="w-full max-w-[335px] lg:max-w-4xl">
          {/* Logo/Image Section */}
          <View className="mb-4 aspect-[335/376] w-full overflow-hidden rounded-t-lg border border-[#e5e5e5] bg-[#fff2f2] dark:border-[#333] dark:bg-white">
            <View className="h-full w-full items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
              <BookOpen 
                size={120} 
                color={colorScheme === 'dark' ? '#FF4433' : '#f53003'} 
                strokeWidth={1.5}
              />
            </View>
          </View>

          {/* Content Section */}
          <View className="rounded-b-lg bg-white p-6 pb-12 shadow-lg dark:bg-[#161615]">
            <Text className="mb-2 text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
              {t('Welcome to Bible App') || 'Welcome to Bible App'}
            </Text>
            <Text className="mb-6 text-[13px] leading-5 text-[#706f6c] dark:text-[#A1A09A]">
              {t("A comprehensive platform for studying God's Word with powerful tools.") || "A comprehensive platform for studying God's Word with powerful tools."}
            </Text>

            {/* Features Section */}
            <View className="mb-6">
              <Text className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#706f6c] dark:text-[#A1A09A]">
                {t('Features') || 'Features'}
              </Text>
              <View className="gap-4">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <View key={index} className="flex-row gap-3">
                      <View className="h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f53003]/10 dark:bg-[#FF4433]/10">
                        <IconComponent 
                          size={16} 
                          color={colorScheme === 'dark' ? '#FF4433' : '#f53003'} 
                          strokeWidth={2}
                        />
                      </View>
                      <View className="flex-1 justify-center">
                        <Text className="font-medium leading-tight text-[#1b1b18] dark:text-[#EDEDEC]">
                          {feature.title}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* CTA Button */}
            <Link href="/auth/register" asChild>
              <Button 
                className="w-full bg-[#1b1b18] dark:bg-[#eeeeec]"
              >
                <Text className="text-white dark:text-[#1C1C1A]">{t('Get Started') || 'Get Started'}</Text>
              </Button>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
