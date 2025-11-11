import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { Input } from '@showcase/components/ui/input';
import { Badge } from '@showcase/components/ui/badge';
import { Link } from 'expo-router';
import { Highlighter, Search, Filter } from 'lucide-react-native';
import { View, ScrollView } from 'react-native';
import { useState } from 'react';
import { useColorScheme } from 'nativewind';

export default function HighlightsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { colorScheme } = useColorScheme();

  // Mock highlights data
  const highlights = [
    {
      id: 1,
      verse: 'John 3:16',
      text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
      color: 'yellow',
      bible: 'NIV',
      date: '2024-11-10',
    },
    {
      id: 2,
      verse: 'Psalm 23:1',
      text: 'The Lord is my shepherd, I lack nothing.',
      color: 'blue',
      bible: 'NIV',
      date: '2024-11-09',
    },
    {
      id: 3,
      verse: 'Philippians 4:13',
      text: 'I can do all this through him who gives me strength.',
      color: 'green',
      bible: 'NIV',
      date: '2024-11-08',
    },
    {
      id: 4,
      verse: 'Romans 8:28',
      text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
      color: 'orange',
      bible: 'NIV',
      date: '2024-11-07',
    },
  ];

  const filteredHighlights = highlights.filter(
    (highlight) =>
      highlight.verse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      highlight.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getColorClass = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-yellow-200 dark:bg-yellow-900/30';
      case 'blue':
        return 'bg-blue-200 dark:bg-blue-900/30';
      case 'green':
        return 'bg-green-200 dark:bg-green-900/30';
      case 'orange':
        return 'bg-orange-200 dark:bg-orange-900/30';
      default:
        return 'bg-gray-200 dark:bg-gray-900/30';
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-6 p-4">
        {/* Header */}
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-3xl font-bold">Highlighted Verses</Text>
              <Text className="text-base text-muted-foreground">
                Your marked and bookmarked verses
              </Text>
            </View>
            <Button size="sm" variant="outline" className="gap-2">
              <Filter size={16} className="text-foreground" />
              <Text>Filter</Text>
            </Button>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center gap-2 rounded-lg border border-border bg-card px-3">
          <Search size={20} className="text-muted-foreground" />
          <Input
            placeholder="Search highlights..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 border-0"
          />
        </View>

        {/* Highlights List */}
        {filteredHighlights.length > 0 ? (
          <View className="gap-4">
            {filteredHighlights.map((highlight) => (
              <Card key={highlight.id} className={getColorClass(highlight.color)}>
                <CardHeader>
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 gap-1">
                      <CardTitle className="flex-row items-center gap-2">
                        <Highlighter size={18} className="text-primary" />
                        <Text className="flex-1">{highlight.verse}</Text>
                      </CardTitle>
                      <CardDescription>
                        {highlight.bible} • {highlight.date}
                      </CardDescription>
                    </View>
                  </View>
                </CardHeader>
                <CardContent className="gap-3">
                  <Text className="text-base leading-6">{highlight.text}</Text>
                  <View className="flex-row items-center gap-2">
                    <Badge variant="outline">
                      <Text className="capitalize">{highlight.color}</Text>
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Text>View Context</Text>
                    </Button>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-12">
            <Highlighter size={48} className="mb-4 text-muted-foreground" />
            <Text className="mb-2 text-lg font-semibold">No highlights found</Text>
            <Text className="text-center text-sm text-muted-foreground">
              {searchQuery
                ? 'Try a different search term'
                : 'Start highlighting verses as you read'}
            </Text>
          </View>
        )}

        {/* Quick Links */}
        <View className="gap-3">
          <Text className="text-lg font-semibold">Quick Actions</Text>
          <View className="flex-row gap-3">
            <Link href="/bibles" asChild className="flex-1">
              <Card className="flex-1">
                <CardContent className="items-center justify-center gap-2 py-4">
                  <Text className="text-center text-sm font-medium">Browse Bibles</Text>
                </CardContent>
              </Card>
            </Link>
            <Link href="/notes" asChild className="flex-1">
              <Card className="flex-1">
                <CardContent className="items-center justify-center gap-2 py-4">
                  <Text className="text-center text-sm font-medium">My Notes</Text>
                </CardContent>
              </Card>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
