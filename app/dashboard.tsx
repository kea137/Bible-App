import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { Input } from '@showcase/components/ui/input';
import { Link } from 'expo-router';
import { 
  BookOpen, 
  Highlighter, 
  Library, 
  Quote, 
  Search, 
  TrendingUp,
} from 'lucide-react-native';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { getDashboardData, DashboardData } from '@/src/lib/services/dashboard.service';

export default function DashboardScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
        // Use mock data as fallback
        setDashboardData({
          verse_of_the_day: {
            text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
            reference: 'John 3:16',
            bible: 'NIV',
          },
          reading_stats: {
            total_bibles: 5,
            verses_read_today: 12,
            chapters_completed: 3,
          },
          last_reading: {
            bible_id: 1,
            bible_name: 'NIV Bible',
            book_id: 19,
            book_title: 'Psalms',
            chapter_number: 23,
          },
          recent_highlights: [
            {
              id: 1,
              text: 'Trust in the LORD with all your heart and lean not on your own understanding.',
              reference: 'Proverbs 3:5',
              color: '#fbbf24',
              note: 'Remember to rely on God\'s wisdom, not my own',
              created_at: new Date().toISOString(),
            },
            {
              id: 2,
              text: 'I can do all things through Christ who strengthens me.',
              reference: 'Philippians 4:13',
              color: '#3b82f6',
              created_at: new Date().toISOString(),
            },
            {
              id: 3,
              text: 'The LORD is my shepherd, I lack nothing.',
              reference: 'Psalms 23:1',
              color: '#34d399',
              created_at: new Date().toISOString(),
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const verseOfTheDay = dashboardData?.verse_of_the_day;
  const readingStats = dashboardData?.reading_stats;
  const lastReading = dashboardData?.last_reading;

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-6 p-4">
        {/* Header */}
        <View className="gap-2">
          <Text className="text-3xl font-bold">Welcome back!</Text>
          <Text className="text-base text-muted-foreground">
            Continue your journey through God's Word
          </Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center gap-2 rounded-lg border border-border bg-card px-3">
          <Search size={20} className="text-muted-foreground" />
          <Input
            placeholder="Search verses, highlights, or bibles..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 border-0"
          />
        </View>

        {/* Loading State */}
        {loading && (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-muted-foreground">Loading dashboard...</Text>
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

        {/* Content - only show if we have data */}
        {dashboardData && !loading && (
          <>
            {/* Reading Stats */}
            {readingStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex-row items-center gap-2">
                    <TrendingUp size={20} className="text-primary" />
                    <Text>Reading Progress</Text>
                  </CardTitle>
                </CardHeader>
                <CardContent className="gap-4">
                  <View className="flex-row justify-between">
                    <View className="items-center">
                      <Text className="text-2xl font-bold">{readingStats.total_bibles}</Text>
                      <Text className="text-xs text-muted-foreground">Total Bibles</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-2xl font-bold">{readingStats.verses_read_today}</Text>
                      <Text className="text-xs text-muted-foreground">Verses Today</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-2xl font-bold">{readingStats.chapters_completed}</Text>
                      <Text className="text-xs text-muted-foreground">Chapters Done</Text>
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
                    <Quote size={20} className="text-primary" />
                    <Text>Verse of the Day</Text>
                  </CardTitle>
                </CardHeader>
                <CardContent className="gap-3">
                  <Text className="text-base leading-6">{verseOfTheDay.text}</Text>
                  <Text className="text-sm font-semibold text-primary">
                    {verseOfTheDay.reference} ({verseOfTheDay.bible})
                  </Text>
                </CardContent>
              </Card>
            )}

            {/* Continue Reading */}
            {lastReading && (
              <Card>
                <CardHeader>
                  <CardTitle>Continue Reading</CardTitle>
                  <CardDescription>
                    Pick up where you left off
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CardTitle>
                    {lastReading.bible_name}
                  </CardTitle>
                  <CardDescription className="mb-4">
                    {lastReading.book_title} Chapter {lastReading.chapter_number}
                  </CardDescription>
                  <Link href={`/bibles/${lastReading.bible_id}`} asChild>
                    <Button>
                      <Text>Continue Reading</Text>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Start your study Session
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-3">
                <Link href="/bibles" asChild>
                  <Button
                    variant='outline'
                    className='w-full justify-start'
                  >
                    <BookOpen className="mr-2 h-4 w-4 text-primary" />
                    <Text>Browse Bibles</Text>
                  </Button>
                </Link>
                <Link href="/bibles/1" asChild>
                  <Button
                    variant='outline'
                    className='w-full justify-start'
                  >
                    <Library className="mr-2 h-4 w-4 text-primary" />
                    <Text>Compare Translations</Text>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card
                    className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10"
                >
                <CardContent className="pt-2">
                  
                            <CardTitle className="mb-1 text-sm font-semibold sm:text-base">
                              Make Reading a Habit
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                              Set aside time each day to read and reflect on the Word
                            </CardDescription>
                        <BookOpen
                            className="h-6 w-6 mt-2 text-primary/40 sm:h-8 sm:w-8"
                        />
                
                </CardContent>
            </Card>

            {/* Highlighted Verses */}
            {dashboardData.recent_highlights && dashboardData.recent_highlights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex-row items-center gap-2">
                    <Highlighter size={20} className="text-primary" />
                    <Text>Your Highlighted Verses</Text>
                  </CardTitle>
                  <CardDescription>
                    Recent verses you've marked
                  </CardDescription>
                </CardHeader>
                <CardContent className="gap-3">
                  {dashboardData.recent_highlights.map((highlight) => (
                    <View
                      key={highlight.id}
                      className="rounded-r border-l-4 py-2 pl-3"
                      style={{ 
                        borderLeftColor: highlight.color, 
                        backgroundColor: `${highlight.color}14` 
                      }}
                    >
                      <Text className="mb-2 text-sm">
                        {highlight.text}
                      </Text>
                      <Text className="text-xs font-medium text-muted-foreground">
                        {highlight.reference}
                      </Text>
                      {highlight.note && (
                        <Text className="mt-1 text-xs italic text-muted-foreground">
                          Note: {highlight.note}
                        </Text>
                      )}
                    </View>
                  ))}
                  
                  <Link href="/highlights" asChild>
                    <Button variant="outline" className="mt-4 w-full">
                      <Text>View All Highlights</Text>
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
