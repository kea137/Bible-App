import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { ScriptureText } from '@showcase/components/ui/scripture-text';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react-native';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { getLessonDetail, LessonDetail, markLessonProgress } from '@/lib/services/lessons.service';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const [lessonData, setLessonData] = useState<LessonDetail | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Theme-aware icon color
  const primaryIconColor = colorScheme === 'dark' ? '#fafafa' : '#18181b';

  // Fetch lesson detail on mount
  useEffect(() => {

    if (lessonData?.lesson?.title) {
      navigation.setOptions({
      headerTitle: lessonData.lesson.title,
      });
    }

    const fetchLessonDetail = async () => {
      try {
        setLoading(true);
        const data = await getLessonDetail(Number(id));
        setLessonData(data);
        setCompleted(data.userProgress?.completed || false);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch lesson detail:', err);
        setError(err.message || 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLessonDetail();
    }
  }, [id]);

  const handleMarkComplete = async () => {
    const newCompletedState = !completed;
    setCompleted(newCompletedState);
    
    try {
      await markLessonProgress({
        lesson_id: Number(id),
        completed: newCompletedState,
      });
    } catch (err: any) {
      console.error('Failed to mark lesson progress:', err);
      // Revert on error
      setCompleted(!newCompletedState);
    }
  };

  const handleNavigateToLesson = (lessonId: number) => {
    router.push(`/lessons/${lessonId}`);
  };

  // Determine if this is a series lesson and calculate next/previous lessons
  const isSeriesLesson = lessonData?.lesson.series_id != null && 
                         lessonData?.seriesLessons && 
                         lessonData.seriesLessons.length > 1;

  const currentLessonIndex = lessonData?.seriesLessons?.findIndex(
    (lesson) => lesson.id === Number(id)
  ) ?? -1;

  const previousLesson = currentLessonIndex > 0 
    ? lessonData?.seriesLessons?.[currentLessonIndex - 1] 
    : null;

  const nextLesson = currentLessonIndex >= 0 && 
                     currentLessonIndex < (lessonData?.seriesLessons?.length ?? 0) - 1
    ? lessonData?.seriesLessons?.[currentLessonIndex + 1]
    : null;

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-4 p-4">
        {/* Loading State */}
        {loading && (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-muted-foreground">{t('Loading lesson...')}</Text>
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
        {lessonData && !loading && (
          <>
            {/* Header Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex-row items-center gap-2">
                  <BookOpen size={20} color={primaryIconColor} />
                  <Text>{lessonData.lesson.title}</Text>
                </CardTitle>
                <CardDescription>{lessonData.lesson.description}</CardDescription>
                {lessonData.lesson.series && (
                  <CardDescription className="mt-1">
                    {t('Series:')} {lessonData.lesson.series.title}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="gap-3">
                {/* Show navigation buttons only for series lessons */}
                {isSeriesLesson && (
                  <View className="flex-row gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={!previousLesson}
                      className="flex-1"
                      onPress={() => previousLesson && handleNavigateToLesson(previousLesson.id)}
                    >
                      <ChevronLeft size={16} color={primaryIconColor} />
                      <Text className="ml-1">{t('Previous')}</Text>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={!nextLesson}
                      className="flex-1"
                      onPress={() => nextLesson && handleNavigateToLesson(nextLesson.id)}
                    >
                      <Text className="mr-1">{t('Next')}</Text>
                      <ChevronRight size={16} color={primaryIconColor} />
                    </Button>
                  </View>
                )}

                <Button 
                  variant={completed ? "default" : "outline"}
                  onPress={handleMarkComplete}
                >
                  <CheckCircle size={16} color={primaryIconColor} />
                  <Text className="ml-2">
                    {completed ? t('Completed') : t('Mark as Complete')}
                  </Text>
                </Button>
              </CardContent>
            </Card>

            {/* Lesson Content */}
            <View className="gap-4">
              {(lessonData?.lesson.paragraphs ?? []).map((paragraph) => (
                <Card key={paragraph.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{paragraph.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScriptureText
                      text={paragraph.text}
                      references={paragraph.references}
                      className="text-base leading-7 text-foreground"
                    />
                  </CardContent>
                </Card>
              ))}
            </View>

          </>
        )}
      </View>
    </ScrollView>
  );
}
