import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { Input } from '@showcase/components/ui/input';
import { Link } from 'expo-router';
import { Library, LibraryBig, Search } from 'lucide-react-native';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { getLessons, Lesson } from '@/src/lib/services/lessons.service';

export default function LessonsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lessons on mount
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const data = await getLessons();
        setLessons(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch lessons:', err);
        setError(err.message || 'Failed to load lessons');
        // Use mock data as fallback
        setLessons([
          {
            id: 1,
            title: 'Introduction to the Gospel',
            description: 'Learn about the good news of Jesus Christ and salvation',
            language: 'English',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            title: 'The Ten Commandments',
            description: 'Study God\'s law and moral guidance for humanity',
            language: 'English',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 3,
            title: 'Prayer and Faith',
            description: 'Understanding how to communicate with God through prayer',
            language: 'English',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 4,
            title: 'The Beatitudes',
            description: 'Jesus\' teachings on the mountain about blessed living',
            language: 'English',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 5,
            title: 'Fruits of the Spirit',
            description: 'Exploring the character traits of a Spirit-filled life',
            language: 'English',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-4 p-4">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <CardTitle className="flex-row items-center gap-2">
                  <Library size={20} className="text-primary" />
                  <Text>Lessons</Text>
                </CardTitle>
                <CardDescription>Available Lessons</CardDescription>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center gap-2 rounded-lg border border-border bg-background px-3">
              <Search size={20} className="text-muted-foreground" />
              <Input
                placeholder="Search lessons..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 border-0"
              />
            </View>
          </CardContent>
          
          {/* Loading State */}
          {loading && (
            <View className="flex-1 items-center justify-center py-12">
              <ActivityIndicator size="large" />
              <Text className="mt-4 text-muted-foreground">Loading lessons...</Text>
            </View>
          )}

          {/* Error State */}
          {error && !loading && (
            <CardContent>
              <View className="rounded-lg border border-destructive bg-destructive/10 p-4">
                <Text className="text-destructive text-center">
                  {error}
                </Text>
                <Text className="text-muted-foreground text-center text-sm mt-2">
                  Showing cached data
                </Text>
              </View>
            </CardContent>
          )}

          {/* Lessons List */}
          {!loading && (
            <View className="gap-3 p-4 pt-0">
              {filteredLessons.length > 0 ? (
                filteredLessons.map((lesson) => (
                  <Link key={lesson.id} href={`/lessons/${lesson.id}`} asChild>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Card className="overflow-hidden">
                        <View className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 active:opacity-100" />
                        <CardContent className="gap-3 py-1">
                          <View className="flex-col items-start">
                            <View className="h-8 w-8 items-center justify-center">
                              <LibraryBig size={28} className="text-primary" />
                            </View>
                            <View className="flex-1 gap-1">
                              <Text className="text-lg font-semibold leading-tight">
                                {lesson.title}
                              </Text>
                              <Text className="text-sm text-muted-foreground">
                                {lesson.description}
                              </Text>
                              <Text className="mt-1 text-xs text-muted-foreground rounded-full px-2 py-1" style={{ backgroundColor: '#333', alignSelf: 'flex-start' }}>
                                {lesson.language}
                              </Text>
                              
                            </View>
                          </View>
                        </CardContent>
                      </Card>
                    </TouchableOpacity>
                  </Link>
                ))
              ) : (
                <Card>
                  <CardContent className="items-center justify-center py-12">
                    <Text className="text-muted-foreground">No lessons found</Text>
                  </CardContent>
                </Card>
              )}
            </View>
          )}
        </Card>
      </View>
    </ScrollView>
  );
}
