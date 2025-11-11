import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle, BookOpen, TrendingUp } from 'lucide-react-native';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function ReadingPlanScreen() {
  const [completedDays, setCompletedDays] = useState<number[]>([1, 2, 3]);

  // Mock reading plan data
  const readingPlan = {
    id: 1,
    title: 'Bible in One Year',
    description: 'Read through the entire Bible in 365 days',
    duration_days: 365,
    current_day: 3,
  };

  // Mock daily readings
  const dailyReadings = [
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
  ];

  const progress = (completedDays.length / readingPlan.duration_days) * 100;

  const toggleDayComplete = (day: number) => {
    setCompletedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-4 p-4">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <Calendar size={20} className="text-primary" />
              <Text>{readingPlan.title}</Text>
            </CardTitle>
            <CardDescription>{readingPlan.description}</CardDescription>
          </CardHeader>
          <CardContent className="gap-4">
            {/* Progress */}
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-medium">Overall Progress</Text>
                <Text className="text-sm text-muted-foreground">
                  {completedDays.length} / {readingPlan.duration_days} days
                </Text>
              </View>
              <Progress value={progress} className="h-2" />
              <Text className="text-xs text-muted-foreground">
                {progress.toFixed(1)}% complete
              </Text>
            </View>

            {/* Stats */}
            <View className="flex-row justify-around rounded-lg border border-border p-4">
              <View className="items-center">
                <Text className="text-2xl font-bold">{readingPlan.current_day}</Text>
                <Text className="text-xs text-muted-foreground">Current Day</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold">{completedDays.length}</Text>
                <Text className="text-xs text-muted-foreground">Completed</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold">
                  {readingPlan.duration_days - completedDays.length}
                </Text>
                <Text className="text-xs text-muted-foreground">Remaining</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Daily Readings */}
        <View className="gap-3">
          <Text className="text-lg font-semibold">Daily Readings</Text>
          
          {dailyReadings.map((reading) => (
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
      </View>
    </ScrollView>
  );
}
