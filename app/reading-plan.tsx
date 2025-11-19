import { Text } from '@showcase/components/ui/text';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { Progress } from '@showcase/components/ui/progress';
import { Calendar, CheckCircle, BookOpen, TrendingUp, BookMarked, Target } from 'lucide-react-native';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { getReadingPlan, type ReadingPlanData } from '@/lib/services/reading-plan.service';
import { useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function ReadingPlanScreen() {
  const { t } = useTranslation();
  const [planData, setPlanData] = useState<ReadingPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  // Fetch reading plan on mount
  useEffect(() => {

    navigation.setOptions({
      headerTitle: t('Reading Plan') || 'Reading Plan',
    })

    const fetchReadingPlan = async () => {
      try {
        setLoading(true);
        const data = await getReadingPlan();
        setPlanData(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch reading plan:', err);
        setError(err.message || t('Failed to load reading plan') || 'Failed to load reading plan');
        // Use mock data as fallback
        setPlanData({
          totalChapters: 1189,
          completedChapters: 150,
          progressPercentage: 12.6,
          chaptersReadToday: 3,
          selectedBible: {
            id: 1,
            name: 'King James Version',
            language: 'English',
          },
          allBibles: [
            {
              id: 1,
              name: 'King James Version',
              language: 'English',
            },
          ],
          completedLessons: [],
          lessonsReadToday: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReadingPlan();
  }, []);

  // Calculate reading plan suggestions
  const remainingChapters = planData ? planData.totalChapters - planData.completedChapters : 0;
  const readingPlans = planData ? [
    {
      name: t('Intensive Plan'),
      chaptersPerDay: 10,
      days: Math.ceil(remainingChapters / 10),
      description: t('Complete the Bible in about 4 months'),
    },
    {
      name: t('Standard Plan'),
      chaptersPerDay: 4,
      days: Math.ceil(remainingChapters / 4),
      description: t('Complete the Bible in about 10 months'),
    },
    {
      name: t('Leisurely Plan'),
      chaptersPerDay: 2,
      days: Math.ceil(remainingChapters / 2),
      description: t('Complete the Bible in about 20 months'),
    },
    {
      name: t('Year Plan'),
      chaptersPerDay: 3,
      days: Math.ceil(remainingChapters / 3),
      description: t('Complete the Bible in about one year'),
    },
  ] : [];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-4 p-4">
        {/* Loading State */}
        {loading && (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-muted-foreground">{t('Loading reading plan...') || 'Loading reading plan...'}</Text>
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
                {t('Showing cached data')}
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {planData && !loading && (
          <>
            {/* Welcome Message */}
            <View className="gap-2 mb-2">
              <Text className="text-2xl font-bold text-foreground">
                {t('Your Bible Reading Journey')}
              </Text>
              <Text className="text-base text-muted-foreground">
                {t('Track your progress and stay motivated as you read through the Bible')}
              </Text>
            </View>

            {/* Progress Overview Card */}
            <Card>
              <CardHeader>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <CardTitle>{t('Overall Progress')}</CardTitle>
                    <CardDescription>
                      {planData.completedChapters} {t('of')} {planData.totalChapters} {t('chapters completed')}
                    </CardDescription>
                  </View>
                  <TrendingUp size={24} className="text-primary" />
                </View>
              </CardHeader>
              <CardContent className="gap-3">
                <Progress 
                  value={planData.progressPercentage} 
                  className="h-3" 
                />
                <Text className="text-center text-2xl font-bold text-primary">
                  {planData.progressPercentage.toFixed(1)}%
                </Text>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <View className="gap-3">
              {/* Today Card */}
              <Card>
                <CardHeader>
                  <View className="flex-row items-center justify-between">
                    <CardTitle>{t('Today')}</CardTitle>
                    <Calendar size={20} className="text-muted-foreground" />
                  </View>
                </CardHeader>
                <CardContent>
                  <Text className="text-3xl font-bold">
                    {planData.chaptersReadToday}
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-1">{t('Chapters read')}</Text>
                </CardContent>
              </Card>

              {/* Completed Card */}
              <Card>
                <CardHeader>
                  <View className="flex-row items-center justify-between">
                    <CardTitle>{t('Completed')}</CardTitle>
                    <CheckCircle size={20} className="text-muted-foreground" />
                  </View>
                </CardHeader>
                <CardContent>
                  <Text className="text-3xl font-bold">{planData.completedChapters}</Text>
                  <Text className="text-xs text-muted-foreground mt-1">{t('Chapters done')}</Text>
                </CardContent>
              </Card>

              {/* Remaining Card */}
              <Card>
                <CardHeader>
                  <View className="flex-row items-center justify-between">
                    <CardTitle>{t('Remaining')}</CardTitle>
                    <BookMarked size={20} className="text-muted-foreground" />
                  </View>
                </CardHeader>
                <CardContent>
                  <Text className="text-3xl font-bold">
                    {remainingChapters}
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-1">{t('Chapters left')}</Text>
                </CardContent>
              </Card>

              {/* Total Card */}
              <Card>
                <CardHeader>
                  <View className="flex-row items-center justify-between">
                    <CardTitle>{t('Total')}</CardTitle>
                    <BookOpen size={20} className="text-muted-foreground" />
                  </View>
                </CardHeader>
                <CardContent>
                  <Text className="text-3xl font-bold">{planData.totalChapters}</Text>
                  <Text className="text-xs text-muted-foreground mt-1">{t('Total chapters')}</Text>
                </CardContent>
              </Card>
            </View>

            {/* Suggested Reading Plans */}
            <Card>
              <CardHeader>
                <View className="flex-row items-center gap-2">
                  <Target size={20} className="text-primary" />
                  <CardTitle>{t('Suggested Reading Plans')}</CardTitle>
                </View>
                <CardDescription>{t('Choose a pace that works for you')}</CardDescription>
              </CardHeader>
              <CardContent className="gap-3">
                {readingPlans.map((plan) => (
                  <View
                    key={plan.name}
                    className="rounded-lg border border-border p-4 gap-2"
                  >
                    <Text className="text-base font-semibold">{plan.name}</Text>
                    <Text className="text-sm text-muted-foreground">
                      {plan.description}
                    </Text>
                    <View className="flex-row items-center gap-4 mt-2">
                      <View>
                        <Text className="font-medium">{plan.chaptersPerDay}</Text>
                        <Text className="text-xs text-muted-foreground">{t('chapters/day')}</Text>
                      </View>
                      <View>
                        <Text className="font-medium">~{plan.days}</Text>
                        <Text className="text-xs text-muted-foreground">{t('days')}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </CardContent>
            </Card>

            {/* Lesson Progress Section (if available) */}
            {planData.completedLessons && planData.completedLessons.length > 0 && (
              <Card>
                <CardHeader>
                  <View className="flex-row items-center gap-2">
                    <BookOpen size={20} className="text-primary" />
                    <CardTitle>{t('Lesson Progress')}</CardTitle>
                  </View>
                  <CardDescription>{t('Track your completed lessons and series')}</CardDescription>
                </CardHeader>
                <CardContent className="gap-4">
                  {/* Stats */}
                  <View className="flex-row gap-3">
                    <Card className="flex-1">
                      <CardContent className="py-3">
                        <Text className="text-2xl font-bold">
                          {planData.completedLessons.length}
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          {t('Total Lessons Completed')}
                        </Text>
                      </CardContent>
                    </Card>
                    <Card className="flex-1">
                      <CardContent className="py-3">
                        <Text className="text-2xl font-bold">
                          {planData.lessonsReadToday || 0}
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          {t('Lessons Completed Today')}
                        </Text>
                      </CardContent>
                    </Card>
                  </View>

                  {/* Recently Completed Lessons */}
                  <View className="gap-2">
                    <Text className="text-sm font-semibold">{t('Recently Completed')}</Text>
                    {planData.completedLessons.slice(0, 5).map((progress) => (
                      <View
                        key={progress.id}
                        className="flex-row items-center justify-between rounded-lg border border-border p-3"
                      >
                        <View className="flex-1">
                          <Text className="text-sm font-medium">
                            {progress.lesson.title}
                          </Text>
                          {progress.lesson.series && (
                            <Text className="text-xs text-muted-foreground">
                              {progress.lesson.series.title}
                              {progress.lesson.episode_number && 
                                ` - Episode ${progress.lesson.episode_number}`
                              }
                            </Text>
                          )}
                        </View>
                        <CheckCircle size={16} className="text-green-600" />
                      </View>
                    ))}
                  </View>
                </CardContent>
              </Card>
            )}

            {/* Reading Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>{t('How to Use Reading Progress Tracking')}</CardTitle>
                <CardDescription>
                  {t('Simple steps to track your Bible reading journey')}
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-4">
                <View className="flex-row gap-3">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <Text className="text-sm font-bold text-primary-foreground">1</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium">{t('Open Any Bible Chapter')}</Text>
                    <Text className="text-sm text-muted-foreground mt-1">
                      {t('Navigate to the Bible you want to read and select a book and chapter.')}
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-3">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <Text className="text-sm font-bold text-primary-foreground">2</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium">{t('Read Through the Chapter')}</Text>
                    <Text className="text-sm text-muted-foreground mt-1">
                      {t("Take your time to read and meditate on God's Word.")}
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-3">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <Text className="text-sm font-bold text-primary-foreground">3</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium">{t('Mark as Complete')}</Text>
                    <Text className="text-sm text-muted-foreground mt-1">
                     {t('When finished, mark the chapter as read to track your progress.')}
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </>
        )}
      </View>
    </ScrollView>
  );
}
