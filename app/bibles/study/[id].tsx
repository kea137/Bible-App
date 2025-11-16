import { Text } from '@showcase/components/ui/text';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { BookOpen, Link2, Share2, StickyNote} from 'lucide-react-native';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button } from '@showcase/components/ui/button';
import { Link } from 'expo-router';
import { Input } from '@showcase/components/ui/input';
import { useColorScheme } from 'nativewind';
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
import { getVerseWithReferences, References, VerseWithReferences, Translations } from '@showcase/src/lib/services/study.service';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';

export function NotesAlertDialog() {
  const [notes, setNotes] = React.useState('');
  const [tags, setTags] = React.useState(''); 
  const { colorScheme } = useColorScheme();

  // Theme-aware icon color
  const primaryIconColor = colorScheme === 'dark' ? '#fafafa' : '#18181b';

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='outline'
          className='w-full justify-center'
        >
          <StickyNote className="mr-2 h-4 w-4" color={primaryIconColor} />
          <Text>Put Notes on this Verse</Text>
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
  const { colorScheme } = useColorScheme();
  const { id } = useLocalSearchParams();
  const [ Loading, setLoading ] = useState(false);
  const [ verseData, setVerseData ] = useState<VerseWithReferences>();
  const [ error, setError ] = useState('');
  const [ references, setReferences] = useState<References[]>([]);
  const [translations, setTranslations] = useState<Translations[]>([]);
  // Theme-aware icon color
  const primaryIconColor = colorScheme === 'dark' ? '#fafafa' : '#18181b';

  useEffect(()=>{
    const fetchVerseWithReferences = async () =>{
      try {
        setLoading(true);
        const data = await getVerseWithReferences(Number(id));
        console.log(data);
        setVerseData(data);
        setReferences(data.references);
        setTranslations(data.other_translations);
        setError('');
      } catch (error: any) {
        console.error('Failed to fetch highlights:', error);
        setError(error.message || 'Failed to load highlights');
        // Simulate API response structure
        const mockResponse = {
            verse: {
                id: 1,
                text: 'Kwa maana jinsi hii Mungu aliuumba ulimwengu',
                chapter_id: 2,
                book_id: 3,
                chapter_number: 4,
                verse_number: 7,
                bible: {
                    id: 1,
                    name: 'Amplified Bible',
                    version: 'AMP',
                },
                book: {
                    id: 2,
                    title: 'AMP'
                },
                chapter: {
                    id: 1,
                    chapter_number: 2,
                },
            },
            references: [
                {
                    id: 2,
                    parsed: {
                        book: 'EXO',
                        chapter: '2',
                        verse: '7',
                    },
                    reference: 'EXO 2:7',
                    verse: {
                        id: 7,
                        text: "And the daughter of Pharaoh came down to wash herself at the river; and her maidens walked along by the river's side; and when she saw the ark among the flags, she sent her maid to fetch it.",
                    }
                }
            ],
            other_translations: [
                {
                    bible: {
                        id: 2,
                        name: 'King James Version',
                    },
                    id: 'kjv-1',
                    text: 'For in the beginning God created the heaven and the earth.'
                },
                {
                    bible: {
                        id: 3,
                        name: 'New International Version',
                    },
                    id: 'niv-1',
                    text: 'In the beginning God created the heavens and the earth.'
                }
            ],
        };

        setVerseData(mockResponse);
        setReferences(mockResponse.references);
      } finally {
        setLoading(false);
      }
    }
    fetchVerseWithReferences();
  }, []);

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-4 p-4">

        {/* Loading State */}
        {Loading && (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-muted-foreground">Loading...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !Loading && (
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

        {/* Header */}
        {!Loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <BookOpen size={20} color={primaryIconColor} />
              <View>
                <Text>
                  {verseData?.verse.book.title} {verseData?.verse.chapter.chapter_number}:{verseData?.verse.verse_number}
                </Text>
                <CardDescription>{verseData?.verse.bible.name}</CardDescription>
              </View>
            </CardTitle>

            <NotesAlertDialog/>

            <Link href="/share" asChild>
              <Button
                variant='secondary'
                className='w-full justify-center'
              >
                <Share2 className="mr-2 h-4 w-4 text-primary" color={primaryIconColor}/>
                <Text>Share Verse</Text>
              </Button>
            </Link>

            <View
              className="rounded-r border-l-4 py-2 pl-3 mt-4"
              style={{ borderLeftColor: '#e5e7eb', backgroundColor: 'rgba(107, 114, 128, 0.08)' }}
            >
              <Text className="mb-2 text-sm italic">
              "{verseData?.verse.text}"
              </Text>
            </View>
          </CardHeader>
        </Card>
        )}

        {/* Cross References */}
        {references.length > 0 && !Loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <Link2 size={20} className="text-primary" />
              <Text>Cross References</Text>
            </CardTitle>
            <CardDescription>Related verses</CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            <ScrollView showsHorizontalScrollIndicator={false} className=" h-80">
            {references.map((ref) => (
                <Link href={`/bibles/study/${ref.verse.id}`} asChild key={ref.id}>
                <TouchableOpacity className="gap-1 rounded-lg border border-border p-3 my-2">
                  <Text className="text-sm font-semibold text-primary">
                  {ref.reference}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                  {ref.verse.text}
                  </Text>
                </TouchableOpacity>
                </Link>
            ))}
            </ScrollView>
          </CardContent>
        </Card>
        )}

        {/* Other Translations */}
        {translations.length > 0 && !Loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <Link2 size={20} color={primaryIconColor} />
              <Text>Other Translations</Text>
            </CardTitle>
            <CardDescription>Same verse in different versions</CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            {translations.map((translation) => (
              <View key={translation.id} className="gap-1 rounded-lg border border-border p-3">
                <Text className="text-sm font-semibold text-primary">
                  {translation.bible.name}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {translation.text}
                </Text>
              </View>
            ))}
          </CardContent>
        </Card>
        )}

        {/* Return to Bible Button */}
        {!Loading && (
        <Link href={`/bibles/${verseData?.verse.bible.id}`} asChild>
          <Button
            variant='outline'
            className='w-full justify-center'
          >
            <BookOpen className="mr-2 h-4 w-4 text-primary" />
            <Text>Return to Bible</Text>
          </Button>
        </Link>
        )}
      </View>
    </ScrollView>
  );
}
