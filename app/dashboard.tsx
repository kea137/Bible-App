import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'expo-router';
import { 
  BookOpen, 
  Highlighter, 
  Library, 
  PenTool, 
  Quote, 
  Search, 
  TrendingUp 
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

        {/* Quick Actions */}
        <View className="gap-3">
          <Text className="text-lg font-semibold">Quick Actions</Text>
          
          <View className="flex-row gap-3">
            <Link href="/bibles" asChild className="flex-1">
              <Card className="flex-1">
                <CardContent className="items-center justify-center gap-2 py-6">
                  <BookOpen size={32} className="text-primary" />
                  <Text className="text-center text-sm font-medium">Explore Bibles</Text>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/lessons" asChild className="flex-1">
              <Card className="flex-1">
                <CardContent className="items-center justify-center gap-2 py-6">
                  <Library size={32} className="text-primary" />
                  <Text className="text-center text-sm font-medium">Lessons</Text>
                </CardContent>
              </Card>
            </Link>
          </View>

          <View className="flex-row gap-3">
            <Link href="/verse-study" asChild className="flex-1">
              <Card className="flex-1">
                <CardContent className="items-center justify-center gap-2 py-6">
                  <PenTool size={32} className="text-primary" />
                  <Text className="text-center text-sm font-medium">Verse Study</Text>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/reading-plan" asChild className="flex-1">
              <Card className="flex-1">
                <CardContent className="items-center justify-center gap-2 py-6">
                  <Highlighter size={32} className="text-primary" />
                  <Text className="text-center text-sm font-medium">Reading Plan</Text>
                </CardContent>
              </Card>
            </Link>
          </View>
        </View>

        {/* Continue Reading */}
        {lastReading && (
          <Card>
            <CardHeader>
              <CardTitle>Continue Reading</CardTitle>
              <CardDescription>
                Pick up where you left off
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-3">
              <Text className="text-base">
                <Text className="font-semibold">{lastReading.bible_name}</Text>
                {' - '}
                {lastReading.book_title} Chapter {lastReading.chapter_number}
              </Text>
              <Link href="/bibles/1" asChild>
                <Button>
                  <Text>Continue Reading</Text>
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}
