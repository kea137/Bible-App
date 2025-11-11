import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { Input } from '@showcase/components/ui/input';
import { Textarea } from '@showcase/components/ui/textarea';
import { PenTool, BookOpen, Highlighter, Link2, Save } from 'lucide-react-native';
import { View, ScrollView } from 'react-native';
import { useState } from 'react';

export default function VerseStudyScreen() {
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');

  // Mock verse data
  const verse = {
    id: 1,
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    reference: 'John 3:16',
    bible: 'NIV',
    book: 'John',
    chapter: 3,
    verse_number: 16,
  };

  // Mock cross-references
  const crossReferences = [
    { reference: 'Romans 5:8', text: 'But God demonstrates his own love for us...' },
    { reference: '1 John 4:9', text: 'This is how God showed his love among us...' },
    { reference: 'John 1:12', text: 'Yet to all who did receive him...' },
  ];

  // Mock commentary
  const commentary = {
    title: 'Understanding John 3:16',
    content: 'This verse is often called the "Gospel in a nutshell" because it summarizes the central message of Christianity. It reveals God\'s love, the gift of His Son, the requirement of faith, and the promise of eternal life.',
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-4 p-4">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <PenTool size={20} className="text-primary" />
              <Text>Verse Study</Text>
            </CardTitle>
            <CardDescription>Deep dive into God's Word</CardDescription>
          </CardHeader>
        </Card>

        {/* Verse Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <BookOpen size={20} className="text-primary" />
              <Text>Current Verse</Text>
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-3">
            <Text className="text-lg leading-7">{verse.text}</Text>
            <Text className="text-sm font-semibold text-primary">
              {verse.reference} ({verse.bible})
            </Text>
          </CardContent>
        </Card>

        {/* Cross References */}
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <Link2 size={20} className="text-primary" />
              <Text>Cross References</Text>
            </CardTitle>
            <CardDescription>Related verses</CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            {crossReferences.map((ref, index) => (
              <View key={index} className="gap-1 rounded-lg border border-border p-3">
                <Text className="text-sm font-semibold text-primary">
                  {ref.reference}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {ref.text}
                </Text>
              </View>
            ))}
          </CardContent>
        </Card>

        {/* Commentary */}
        <Card>
          <CardHeader>
            <CardTitle>{commentary.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-base leading-7">{commentary.content}</Text>
          </CardContent>
        </Card>

        {/* Personal Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <Highlighter size={20} className="text-primary" />
              <Text>Personal Notes</Text>
            </CardTitle>
            <CardDescription>Add your thoughts and insights</CardDescription>
          </CardHeader>
          <CardContent className="gap-4">
            <View className="gap-2">
              <Text className="text-sm font-medium">Notes</Text>
              <Textarea
                placeholder="Write your thoughts about this verse..."
                value={notes}
                onChangeText={setNotes}
                className="min-h-32"
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium">Tags</Text>
              <Input
                placeholder="Add tags (comma separated)"
                value={tags}
                onChangeText={setTags}
              />
            </View>

            <Button>
              <Save size={16} />
              <Text className="ml-2">Save Notes</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
