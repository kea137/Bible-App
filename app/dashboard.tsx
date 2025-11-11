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
import { View, ScrollView } from 'react-native';
import { useState } from 'react';

export default function DashboardScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const verseOfTheDay = {
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    reference: 'John 3:16',
    bible: 'NIV',
  };

  const readingStats = {
    total_bibles: 5,
    verses_read_today: 12,
    chapters_completed: 3,
  };

  const lastReading = {
    bible_name: 'NIV Bible',
    book_title: 'Psalms',
    chapter_number: 23,
  };

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

        {/* Reading Stats */}
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

        {/* Verse of the Day */}
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
              <Link href="/bibles/1" asChild>
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
            <Link href="/bibles/1" asChild>
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
            <View
              className="rounded-r border-l-4 py-2 pl-3"
              style={{ borderLeftColor: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.08)' }}
            >
              <Text className="mb-2 text-sm">
              Trust in the LORD with all your heart and lean not on your own understanding.
              </Text>
              <Text className="text-xs font-medium text-muted-foreground">
              Proverbs 3:5
              </Text>
              <Text className="mt-1 text-xs italic text-muted-foreground">
              Note: Remember to rely on God's wisdom, not my own
              </Text>
            </View>
            
            <View
              className="rounded-r border-l-4 py-2 pl-3"
              style={{ borderLeftColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.08)' }}
            >
              <Text className="mb-2 text-sm">
              I can do all things through Christ who strengthens me.
              </Text>
              <Text className="text-xs font-medium text-muted-foreground">
              Philippians 4:13
              </Text>
            </View>
            
            <View
              className="rounded-r border-l-4 py-2 pl-3"
              style={{ borderLeftColor: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.1)' }}
            >
              <Text className="mb-2 text-sm">
              The LORD is my shepherd, I lack nothing.
              </Text>
              <Text className="text-xs font-medium text-muted-foreground">
              Psalms 23:1
              </Text>
            </View>
            
            <Link href="/highlights" asChild>
              <Button variant="outline" className="mt-4 w-full">
          <Text>View All Highlights</Text>
              </Button>
            </Link>
          </CardContent>
        </Card>

      </View>
    </ScrollView>
  );
}
