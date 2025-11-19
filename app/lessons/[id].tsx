import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { ScriptureText } from '@showcase/components/ui/scripture-text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react-native';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { getLessonDetail, LessonDetail, markLessonProgress } from '@/lib/services/lessons.service';
import { useColorScheme } from 'nativewind';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const [lessonData, setLessonData] = useState<LessonDetail | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Theme-aware icon color
  const primaryIconColor = colorScheme === 'dark' ? '#fafafa' : '#18181b';

  // Fetch lesson detail on mount
  useEffect(() => {
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
        // Use mock data as fallback
        setLessonData({
          lesson: {
            id: Number(id),
            title: 'Introduction to the Gospel',
            description: 'Learn about the good news of Jesus Christ and salvation',
            language: 'English',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            paragraphs: [
              {
                id: 1,
                title: 'What is the Gospel?',
                text: 'The Gospel means "good news." It is the message that God loves us and sent His Son Jesus Christ to save us from our sins. Through faith in Jesus, we can have eternal life and a relationship with God.',
                references: [],
              },
              {
                id: 2,
                title: 'The Need for Salvation',
                text: 'All people have sinned and fall short of the glory of God (Romans 3:23). Sin separates us from God and leads to spiritual death. We cannot save ourselves through our own efforts or good works.',
                references: [],
              },
              {
                id: 3,
                title: 'God\'s Love and Grace',
                text: 'But God demonstrates His own love for us in this: While we were still sinners, Christ died for us (Romans 5:8). Jesus Christ, the Son of God, lived a perfect life, died on the cross for our sins, and rose again on the third day.',
                references: [],
              },
              {
                id: 4,
                title: 'Receiving Salvation',
                text: 'Salvation is a gift from God that we receive through faith in Jesus Christ. We must believe that Jesus is Lord, that He died for our sins and rose again, and confess Him as our Savior. This faith transforms our lives and gives us hope for eternity.',
                references: [],
              },
              {
                id: 5,
                title: 'Living as a Believer',
                text: 'Once we accept Christ, we are called to live for Him. This means reading the Bible, praying, fellowshipping with other believers, and sharing the Gospel with others. Our faith should be evident in how we live each day.',
                references: [],
              },
            ],
          },
          userProgress: null,
          seriesLessons: [],
        });
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
            <Text className="mt-4 text-muted-foreground">Loading lesson...</Text>
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
                Showing cached data
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
                    Series: {lessonData.lesson.series.title}
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
                      <Text className="ml-1">Previous</Text>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={!nextLesson}
                      className="flex-1"
                      onPress={() => nextLesson && handleNavigateToLesson(nextLesson.id)}
                    >
                      <Text className="mr-1">Next</Text>
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
                    {completed ? 'Completed' : 'Mark as Complete'}
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
                    />
                  </CardContent>
                </Card>
              ))}
            </View>

            {/* Footer Actions */}
            <Card>
              <CardContent className="gap-3 py-4">
                <Text className="text-center text-sm text-muted-foreground">
                  Lesson {lessonData.lesson.id} - {lessonData.lesson.language}
                </Text>
                <Button 
                  variant={completed ? "default" : "outline"}
                  onPress={handleMarkComplete}
                >
                  <CheckCircle size={16} color={primaryIconColor} />
                  <Text className="ml-2">
                    {completed ? 'Lesson Completed' : 'Mark as Complete'}
                  </Text>
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </View>
    </ScrollView>
  );
}
