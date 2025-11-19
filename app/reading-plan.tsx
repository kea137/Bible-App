import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { Progress } from '@showcase/components/ui/progress';
import { Calendar, CheckCircle, BookOpen, TrendingUp, BookMarked, Target } from 'lucide-react-native';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { getReadingPlan, markReadingProgress, ReadingPlanWithProgress } from '@/lib/services/reading-plan.service';

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
        setPlanData(Array.isArray(data) ? data : data);
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

  // Calculate reading plan suggestions
  const remainingDays = planData ? planData.plan.duration_days - completedDays.length : 0;
  const readingPlans = planData ? [
    {
      name: 'Intensive Plan',
      chaptersPerDay: 10,
      days: Math.ceil(remainingDays / 10),
      description: 'Complete your plan in about 4 months',
    },
    {
      name: 'Standard Plan',
      chaptersPerDay: 4,
      days: Math.ceil(remainingDays / 4),
      description: 'Complete your plan in about 10 months',
    },
    {
      name: 'Leisurely Plan',
      chaptersPerDay: 2,
      days: Math.ceil(remainingDays / 2),
      description: 'Complete your plan in about 20 months',
    },
    {
      name: 'Year Plan',
      chaptersPerDay: 3,
      days: Math.ceil(remainingDays / 3),
      description: 'Complete your plan in about one year',
    },
  ] : [];

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
            {/* Welcome Message */}
            <View className="gap-2 mb-2">
              <Text className="text-2xl font-bold text-foreground">
                Your Bible Reading Journey
              </Text>
              <Text className="text-base text-muted-foreground">
                Track your progress and stay motivated as you read through the Bible
              </Text>
            </View>

            {/* Progress Overview Card */}
            <Card>
              <CardHeader>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <CardTitle>Overall Progress</CardTitle>
                    <CardDescription>
                      {completedDays.length} of {planData.plan.duration_days} days completed
                    </CardDescription>
                  </View>
                  <TrendingUp size={24} className="text-primary" />
                </View>
              </CardHeader>
              <CardContent className="gap-3">
                <Progress 
                  value={(completedDays.length / planData.plan.duration_days) * 100} 
                  className="h-3" 
                />
                <Text className="text-center text-2xl font-bold text-primary">
                  {((completedDays.length / planData.plan.duration_days) * 100).toFixed(1)}%
                </Text>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <View className="gap-3">
              {/* Today Card */}
              <Card>
                <CardHeader>
                  <View className="flex-row items-center justify-between">
                    <CardTitle>Today</CardTitle>
                    <Calendar size={20} className="text-muted-foreground" />
                  </View>
                </CardHeader>
                <CardContent>
                  <Text className="text-3xl font-bold">
                    {planData.daily_readings.filter(r => r.completed && r.date === new Date().toISOString().split('T')[0]).length}
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-1">Chapters read</Text>
                </CardContent>
              </Card>

              {/* Completed Card */}
              <Card>
                <CardHeader>
                  <View className="flex-row items-center justify-between">
                    <CardTitle>Completed</CardTitle>
                    <CheckCircle size={20} className="text-muted-foreground" />
                  </View>
                </CardHeader>
                <CardContent>
                  <Text className="text-3xl font-bold">{completedDays.length}</Text>
                  <Text className="text-xs text-muted-foreground mt-1">Days done</Text>
                </CardContent>
              </Card>

              {/* Remaining Card */}
              <Card>
                <CardHeader>
                  <View className="flex-row items-center justify-between">
                    <CardTitle>Remaining</CardTitle>
                    <BookMarked size={20} className="text-muted-foreground" />
                  </View>
                </CardHeader>
                <CardContent>
                  <Text className="text-3xl font-bold">
                    {planData.plan.duration_days - completedDays.length}
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-1">Days left</Text>
                </CardContent>
              </Card>

              {/* Total Card */}
              <Card>
                <CardHeader>
                  <View className="flex-row items-center justify-between">
                    <CardTitle>Total</CardTitle>
                    <BookOpen size={20} className="text-muted-foreground" />
                  </View>
                </CardHeader>
                <CardContent>
                  <Text className="text-3xl font-bold">{planData.plan.duration_days}</Text>
                  <Text className="text-xs text-muted-foreground mt-1">Total days</Text>
                </CardContent>
              </Card>
            </View>

            {/* Suggested Reading Plans */}
            <Card>
              <CardHeader>
                <View className="flex-row items-center gap-2">
                  <Target size={20} className="text-primary" />
                  <CardTitle>Suggested Reading Plans</CardTitle>
                </View>
                <CardDescription>Choose a pace that works for you</CardDescription>
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
                        <Text className="text-xs text-muted-foreground">chapters/day</Text>
                      </View>
                      <View>
                        <Text className="font-medium">~{plan.days}</Text>
                        <Text className="text-xs text-muted-foreground">days</Text>
                      </View>
                    </View>
                  </View>
                ))}
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
