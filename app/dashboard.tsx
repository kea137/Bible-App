import { DashData, getDashboardData } from '@/lib/services/dashboard.service';
import { Button } from '@showcase/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { Input } from '@showcase/components/ui/input';
import { Text } from '@showcase/components/ui/text';
import { Link, useNavigation } from 'expo-router';
import {
  BookOpen,
  Highlighter,
  Library,
  Quote,
  Search,
  TrendingUp,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function DashboardScreen() {
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardData, setDashboardData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  
  // Theme-aware icon color
  const primaryIconColor = colorScheme === 'dark' ? '#fafafa' : '#18181b';

  // Fetch dashboard data on mount
  useEffect(() => {

    navigation.setOptions({
      headerTitle: (t('Dashboard') || 'Dashboard'),
    });

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message || t('Failed to load dashboard data') || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const verseOfTheDay = dashboardData?.data?.verseOfTheDay;
  const readingStats = dashboardData?.data?.readingStats;
  const lastReading = dashboardData?.data?.lastReading;

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-6 p-4">

        {/* Header */}
        <View className="gap-2">
          <Text className="text-3xl font-bold">{t('Welcome back,') || 'Welcome back,'} {dashboardData?.data?.userName}</Text>
          <Text className="text-base text-muted-foreground">
            {t("Continue your journey through God's Word") || "Continue your journey through God's Word"}
          </Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center gap-2 rounded-lg border border-border bg-card px-3">
          <Search size={20} color={primaryIconColor} />
          <Input
            placeholder={t('Search verses, highlights, or bibles...') || 'Search verses, highlights, or bibles...'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 border-0"
          />
        </View>

        {/* Loading State */}
        {loading && (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-muted-foreground">{t('Loading dashboard...') || 'Loading dashboard...'}</Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="border-destructive">
            <CardContent className="py-4">
              <Text className="text-destructive text-center">
                {error}
              </Text>
              <Text className="text-muted-foreground text-center text-sm mt-2">
                {t('Showing cached data') || 'Showing cached data'}
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Content - only show if we have data */}
        {dashboardData && !loading && (
          <>
            {/* Reading Stats */}
            {readingStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex-row items-center gap-2">
                    <TrendingUp size={20} color={primaryIconColor} />
                    <Text>{t('Reading Progress') || 'Reading Progress'}</Text>
                  </CardTitle>
                </CardHeader>
                <CardContent className="gap-4">
                  <View className="flex-row justify-between">
                    <View className="items-center">
                      <Text className="text-2xl font-bold">{readingStats.total_bibles}</Text>
                      <Text className="text-xs text-muted-foreground">{t('Total Bibles') || 'Total Bibles'}</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-2xl font-bold">{readingStats.verses_read_today}</Text>
                      <Text className="text-xs text-muted-foreground">{t('Verses Today') || 'Verses Today'}</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-2xl font-bold">{readingStats.chapters_completed}</Text>
                      <Text className="text-xs text-muted-foreground">{t('Chapters Done') || 'Chapters Done'}</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            )}

            {/* Verse of the Day */}
            {verseOfTheDay && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex-row items-center gap-2">
                    <Quote size={20} color={primaryIconColor} />
                    <Text>{t('Verse of the Day') || 'Verse of the Day'}</Text>
                  </CardTitle>
                </CardHeader>
                <CardContent className="gap-3">
                  <Text className="text-base leading-6">{verseOfTheDay.text}</Text>
                  <Text className="text-sm font-semibold text-primary">
                    {verseOfTheDay.book.title} {verseOfTheDay.chapter.chapter_number}:{verseOfTheDay.verse_number} ({verseOfTheDay.bible.name})
                  </Text>
                </CardContent>
              </Card>
            )}

            {/* Continue Reading */}
            {lastReading && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('Continue Reading') || 'Continue Reading'}</CardTitle>
                  <CardDescription>
                    {t('Pick up where you left off') || 'Pick up where you left off'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CardTitle>
                    {lastReading.bible_name}
                  </CardTitle>
                  <CardDescription className="mb-4">
                    {lastReading.book_title} {t('Chapter') || 'Chapter'} {lastReading.chapter_number}
                  </CardDescription>
                  <Link href={`/bibles/${lastReading.bible_id}`} asChild>
                    <Button>
                      <Text>{t('Continue Reading') || 'Continue Reading'}</Text>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>{t('Quick Actions') || 'Quick Actions'}</CardTitle>
                <CardDescription>
                  {t('Start your study Session') || 'Start your study Session'}
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-3">
                <Link href="/bibles" asChild>
                  <Button
                    variant='outline'
                    className='w-full justify-start'
                  >
                    <BookOpen className="mr-2 h-4 w-4" color={primaryIconColor} />
                    <Text>{t('Browse Bibles') || 'Browse Bibles'}</Text>
                  </Button>
                </Link>
                <Link href="/bibles/1" asChild>
                  <Button
                    variant='outline'
                    className='w-full justify-start'
                  >
                    <Library className="mr-2 h-4 w-4" color={primaryIconColor} />
                    <Text>{t('Compare Translations') || 'Compare Translations'}</Text>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card
                    className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10"
                >
                <CardContent className="pt-2">
                  
                            <CardTitle className="mb-1 text-sm font-semibold sm:text-base">
                              {t('Make Reading a Habit') || 'Make Reading a Habit'}
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                              {t('Set aside time each day to read and reflect on the Word') || 'Set aside time each day to read and reflect on the Word'}
                            </CardDescription>
                        <BookOpen
                            className="h-6 w-6 mt-2 sm:h-8 sm:w-8"
                            color={primaryIconColor}
                        />
                
                </CardContent>
            </Card>

            {/* Highlighted Verses */}
            {dashboardData.data?.highlightedVerses && dashboardData.data?.highlightedVerses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex-row items-center gap-2">
                    <Highlighter size={20} color={primaryIconColor} />
                    <Text>{t('Your Highlighted Verses') || 'Your Highlighted Verses'}</Text>
                  </CardTitle>
                    <CardDescription>
                    {t("Recent verses you've marked") || "Recent verses you've marked"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="gap-3">
                  {dashboardData.data?.highlightedVerses.map((highlight) =>{
                    const bgClass = 
                    highlight.color === 'yellow' ? 'bg-yellow-200/20' : 'bg-green-300/25';
                    const bgColor = 
                      highlight.color === 'yellow' ? '#FEF08A1F' : '#86EFAC1F'; // 1F hex = 12% opacity

                    return (
                    <View
                      key={highlight.id}
                      className={`rounded-r border-l-4 py-2 pl-3 ${bgClass}`}
                      style={{ 
                        borderLeftColor: highlight.color, 
                        backgroundColor: bgColor // More transparent tint (hex alpha 20 ≈ 12% opacity)
                      }}
                    >
                      <Text className="mb-2 text-sm">
                        {highlight.verse.text}
                      </Text>
                      {/* <Text className="text-xs font-medium tex</View>t-muted-foreground">
                        {highlight.reference}
                      </Text> */}
                      {highlight.note && (
                        <Text className="mt-1 text-xs italic text-muted-foreground">
                          Note: {highlight.note}
                        </Text>
                      )}
                    </View>
                  )})}
                  
                  <Link href="/highlights" asChild>
                    <Button variant="outline" className="mt-4 w-full">
                        <Text>{t('View All Highlights') || 'View All Highlights'}</Text>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </>
        )}

      </View>
    </ScrollView>
  );
}
