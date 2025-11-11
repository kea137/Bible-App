import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { Input } from '@showcase/components/ui/input';
import { Link } from 'expo-router';
import { NotebookPen, Search, Plus } from 'lucide-react-native';
import { View, ScrollView } from 'react-native';
import { useState } from 'react';

export default function NotesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock notes data
  const notes = [
    {
      id: 1,
      title: 'Reflections on John 3:16',
      verse: 'John 3:16',
      content: 'For God so loved the world that he gave his one and only Son...',
      date: '2024-11-10',
    },
    {
      id: 2,
      title: 'Prayer Points from Psalms',
      verse: 'Psalm 23:1-6',
      content: 'The Lord is my shepherd, I lack nothing...',
      date: '2024-11-09',
    },
    {
      id: 3,
      title: 'Faith and Works',
      verse: 'James 2:14-26',
      content: 'Faith without works is dead...',
      date: '2024-11-08',
    },
  ];

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.verse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-6 p-4">
        {/* Header */}
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-3xl font-bold">My Notes</Text>
              <Text className="text-base text-muted-foreground">
                Personal reflections and study notes
              </Text>
            </View>
            <Link href="/notes/modal" asChild>
              <Button size="sm" className="gap-2">
              <Plus size={16} className="text-primary-foreground" />
              <Text>New</Text>
              </Button>
            </Link>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center gap-2 rounded-lg border border-border bg-card px-3">
          <Search size={20} className="text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 border-0"
          />
        </View>

        {/* Notes List */}
        {filteredNotes.length > 0 ? (
          <View className="gap-4">
            {filteredNotes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 gap-1">
                      <CardTitle className="flex-row items-center gap-2">
                        <NotebookPen size={18} className="text-primary" />
                        <Text className="flex-1">{note.title}</Text>
                      </CardTitle>
                      <CardDescription>
                        {note.verse} • {note.date}
                      </CardDescription>
                    </View>
                  </View>
                </CardHeader>
                <CardContent className="gap-3">
                  <Text className="text-base leading-6" numberOfLines={3}>
                    {note.content}
                  </Text>
                  <Button variant="outline" size="sm">
                    <Text>View Full Note</Text>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-12">
            <NotebookPen size={48} className="mb-4 text-muted-foreground" />
            <Text className="mb-2 text-lg font-semibold">No notes found</Text>
            <Text className="text-center text-sm text-muted-foreground">
              {searchQuery
                ? 'Try a different search term'
                : 'Start creating notes to remember your insights'}
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
            <Link href="/highlights" asChild className="flex-1">
              <Card className="flex-1">
                <CardContent className="items-center justify-center gap-2 py-4">
                  <Text className="text-center text-sm font-medium">View Highlights</Text>
                </CardContent>
              </Card>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
