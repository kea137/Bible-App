import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { Input } from '@showcase/components/ui/input';
import { Link } from 'expo-router';
import { BookOpen, Search } from 'lucide-react-native';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function BiblesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock bible data
  const bibles = [
    {
      id: 1,
      name: 'New International Version',
      abbreviation: 'NIV',
      description: 'A modern, easy-to-read translation',
      language: 'English',
      version: '2011',
      books_count: 66,
    },
    {
      id: 2,
      name: 'King James Version',
      abbreviation: 'KJV',
      description: 'Classic translation with traditional language',
      language: 'English',
      version: '1611',
      books_count: 66,
    },
    {
      id: 3,
      name: 'English Standard Version',
      abbreviation: 'ESV',
      description: 'Literal translation for study',
      language: 'English',
      version: '2001',
      books_count: 66,
    },
    {
      id: 4,
      name: 'New Living Translation',
      abbreviation: 'NLT',
      description: 'Dynamic equivalence translation',
      language: 'English',
      version: '1996',
      books_count: 66,
    },
    {
      id: 5,
      name: 'The Message',
      abbreviation: 'MSG',
      description: 'Contemporary paraphrase',
      language: 'English',
      version: '2002',
      books_count: 66,
    },
  ];

  const filteredBibles = bibles.filter((bible) =>
    bible.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bible.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bible.language.toLowerCase().includes(searchQuery.toLowerCase())
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
                  <BookOpen size={20} className="text-primary" />
                  <Text>Bibles</Text>
                </CardTitle>
                <CardDescription>Available Bible translations</CardDescription>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center gap-2 rounded-lg border border-border bg-background px-3">
              <Search size={20} className="text-muted-foreground" />
              <Input
                placeholder="Search bibles..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 border-0"
              />
            </View>
          </CardContent>
        </Card>

        {/* Bible List */}
        <View className="gap-3">
          {filteredBibles.length > 0 ? (
            filteredBibles.map((bible) => (
              <Link key={bible.id} href={`/bibles/${bible.id}`} asChild>
                <TouchableOpacity activeOpacity={0.7}>
                  <Card className="overflow-hidden">
                    <View className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 active:opacity-100" />
                    <CardContent className="gap-2 py-4">
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1 gap-1">
                          <Text className="text-lg font-semibold">
                            {bible.name}
                          </Text>
                          <Text className="text-sm text-muted-foreground">
                            {bible.description}
                          </Text>
                        </View>
                        <View className="rounded-full bg-primary/10 px-3 py-1">
                          <Text className="text-xs font-semibold text-primary">
                            {bible.abbreviation}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row gap-4">
                        <Text className="text-xs text-muted-foreground">
                          {bible.language}
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          {bible.books_count} books
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          v{bible.version}
                        </Text>
                      </View>
                    </CardContent>
                  </Card>
                </TouchableOpacity>
              </Link>
            ))
          ) : (
            <Card>
              <CardContent className="items-center justify-center py-12">
                <Text className="text-muted-foreground">No bibles found</Text>
              </CardContent>
            </Card>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
