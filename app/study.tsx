import { Text } from '@showcase/components/ui/text';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { BookOpen, Link2, Share2} from 'lucide-react-native';
import { View, ScrollView } from 'react-native';
import { Button } from '@showcase/components/ui/button';
import { Link } from 'expo-router';
import { Input } from '@showcase/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@showcase/components/ui/alert-dialog';
import { Textarea } from '@showcase/components/ui/textarea';
import * as React from 'react';

export function NotesAlertDialog() {
    const [notes, setNotes] = React.useState('');
    const [tags, setTags] = React.useState('');
    
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='outline'
          className='w-full justify-center'
        >
          <BookOpen className="mr-2 h-4 w-4 text-primary" />
          <Text>Browse Bibles</Text>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center justify-center">
          <AlertDialogTitle className="text-center">Add Note to Verse</AlertDialogTitle>
          <AlertDialogDescription className="text-center mb-4">
            Philippians 4:13
          </AlertDialogDescription>
          <AlertDialogDescription>
            <View className="rounded-lg border bg-muted/50 p-3 items-center">
          <Text className="text-sm italic text-center">"I can do all things through Christ who strengthens me."</Text>
            </View>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <View className="gap-2">
            <Text className="text-sm font-medium">Title (Optional)</Text>
            <Input
                placeholder="Enter a title for your note"
                value={tags}
                onChangeText={setTags}
            />
        </View>

        <View className="gap-2">
            <Text className="text-sm font-medium">Notes</Text>
            <Textarea
                placeholder="Write your thoughts, insights and reflections..."
                value={notes}
                onChangeText={setNotes}
                className="min-h-32"
            />
        </View>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction>
            <Text>Save Note</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function VerseStudyScreen() {

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
              <BookOpen size={20} className="text-primary" />
              <View>
                <Text>Philippians 4:13</Text>
                <CardDescription>AMP 1.0</CardDescription>
              </View>
            </CardTitle>

            <NotesAlertDialog/>

            <Link href="/share" asChild>
              <Button
                variant='secondary'
                className='w-full justify-center'
              >
                <Share2 className="mr-2 h-4 w-4 text-primary" />
                <Text>Share Verse</Text>
              </Button>
            </Link>

            <View
              className="rounded-r border-l-4 py-2 pl-3 mt-4"
              style={{ borderLeftColor: '#e5e7eb', backgroundColor: 'rgba(107, 114, 128, 0.08)' }}
            >
              <Text className="mb-2 text-sm italic">
              "I can do all things through Christ who strengthens me."
              </Text>
            </View>
          </CardHeader>
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

        {/* Cross References */}
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <Link2 size={20} className="text-primary" />
              <Text>Other Translations</Text>
            </CardTitle>
            <CardDescription>Same verse in different versions</CardDescription>
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

        <Link href="/bibles/1" asChild>
          <Button
            variant='outline'
            className='w-full justify-center'
          >
            <BookOpen className="mr-2 h-4 w-4 text-primary" />
            <Text>Return to Bible</Text>
          </Button>
        </Link>
      </View>
    </ScrollView>
  );
}
