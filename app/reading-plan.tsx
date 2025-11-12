import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { Progress } from '@showcase/components/ui/progress';
import { Calendar, CheckCircle, BookOpen, TrendingUp } from 'lucide-react-native';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { getReadingPlan, markReadingProgress, ReadingPlanWithProgress } from '@/src/lib/services/reading-plan.service';

export default function ReadingPlanScreen() {
  const [planData, setPlanData] = useState<ReadingPlanWithProgress | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reading plan on mount
  useEffect(() => {
    const fetchReadingPlan = async () => {
      try {
        setLoading(true);
        const data = await getReadingPlan();
        setPlanData(data);
        setCompletedDays(data.progress.filter(p => p.completed).map(p => p.day));
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch reading plan:', err);
        setError(err.message || 'Failed to load reading plan');
        // Use mock data as fallback
        setPlanData({
          plan: {
            id: 1,
            title: 'Bible in One Year',
            description: 'Read through the entire Bible in 365 days',
            duration_days: 365,
            current_day: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          daily_readings: [
            {
              day: 1,
              date: '2024-01-01',
              readings: [
                { book: 'Genesis', chapter: '1-3' },
                { book: 'Matthew', chapter: '1' },
              ],
              completed: true,
            },
            {
              day: 2,
              date: '2024-01-02',
              readings: [
                { book: 'Genesis', chapter: '4-6' },
                { book: 'Matthew', chapter: '2' },
              ],
              completed: true,
            },
            {
              day: 3,
              date: '2024-01-03',
              readings: [
                { book: 'Genesis', chapter: '7-9' },
                { book: 'Matthew', chapter: '3' },
              ],
              completed: true,
            },
            {
              day: 4,
              date: '2024-01-04',
              readings: [
                { book: 'Genesis', chapter: '10-12' },
                { book: 'Matthew', chapter: '4' },
              ],
              completed: false,
            },
            {
              day: 5,
              date: '2024-01-05',
              readings: [
                { book: 'Genesis', chapter: '13-15' },
                { book: 'Matthew', chapter: '5' },
              ],
              completed: false,
            },
          ],
          progress: [],
          completed_days: 3,
        });
        setCompletedDays([1, 2, 3]);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingPlan();
  }, []);

  const toggleDayComplete = async (day: number) => {
    const wasCompleted = completedDays.includes(day);
    const newCompleted = wasCompleted 
      ? completedDays.filter(d => d !== day) 
      : [...completedDays, day];
    
    setCompletedDays(newCompleted);

    try {
      await markReadingProgress({
        reading_plan_id: planData?.plan.id || 1,
        day: day,
        completed: !wasCompleted,
      });
    } catch (err: any) {
      console.error('Failed to mark reading progress:', err);
      // Revert on error
      setCompletedDays(completedDays);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-4 p-4">
        {/* Loading State */}
        {loading && (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-muted-foreground">Loading reading plan...</Text>
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
        {planData && !loading && (
          <>
            {/* Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex-row items-center gap-2">
                  <Calendar size={20} className="text-primary" />
                  <Text>{planData.plan.title}</Text>
                </CardTitle>
                <CardDescription>{planData.plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="gap-4">
                {/* Progress */}
                <View className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-medium">Overall Progress</Text>
                    <Text className="text-sm text-muted-foreground">
                      {completedDays.length} / {planData.plan.duration_days} days
                    </Text>
                  </View>
                  <Progress 
                    value={(completedDays.length / planData.plan.duration_days) * 100} 
                    className="h-2" 
                  />
                  <Text className="text-xs text-muted-foreground">
                    {((completedDays.length / planData.plan.duration_days) * 100).toFixed(1)}% complete
                  </Text>
                </View>

                {/* Stats */}
                <View className="flex-row justify-around rounded-lg border border-border p-4">
                  <View className="items-center">
                    <Text className="text-2xl font-bold">{planData.plan.current_day || completedDays.length + 1}</Text>
                    <Text className="text-xs text-muted-foreground">Current Day</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-2xl font-bold">{completedDays.length}</Text>
                    <Text className="text-xs text-muted-foreground">Completed</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-2xl font-bold">
                      {planData.plan.duration_days - completedDays.length}
                    </Text>
                    <Text className="text-xs text-muted-foreground">Remaining</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* Daily Readings */}
            <View className="gap-3">
              <Text className="text-lg font-semibold">Daily Readings</Text>
              
              {planData.daily_readings.map((reading) => (
                <TouchableOpacity
                  key={reading.day}
                  activeOpacity={0.7}
                  onPress={() => toggleDayComplete(reading.day)}
                >
                  <Card className={completedDays.includes(reading.day) ? 'border-primary' : ''}>
                    <CardContent className="gap-3 py-4">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 gap-1">
                          <View className="flex-row items-center gap-2">
                            <Text className="text-base font-semibold">Day {reading.day}</Text>
                            {completedDays.includes(reading.day) && (
                              <CheckCircle size={16} className="text-primary" />
                            )}
                          </View>
                          <Text className="text-xs text-muted-foreground">{reading.date}</Text>
                        </View>
                      </View>

                      <View className="gap-2">
                        {reading.readings.map((r, index) => (
                          <View key={index} className="flex-row items-center gap-2">
                            <BookOpen size={14} className="text-muted-foreground" />
                            <Text className="text-sm">
                              {r.book} {r.chapter}
                            </Text>
                          </View>
                        ))}
                      </View>

                      <Button
                        variant={completedDays.includes(reading.day) ? "default" : "outline"}
                        size="sm"
                      >
                        <Text>
                          {completedDays.includes(reading.day) ? 'Completed' : 'Mark Complete'}
                        </Text>
                      </Button>
                    </CardContent>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
