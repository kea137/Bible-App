import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@showcase/components/ui/select';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { BookOpen, CheckCircle, Share2 } from 'lucide-react-native';
import { View, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { Gesture, GestureDetector, GestureHandlerRootView, Directions } from 'react-native-gesture-handler';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@showcase/components/ui/hover-card';
import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@showcase/components/ui/dropdown-menu';
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
import { getBibleDetail, getChapterData, BibleDetail, ChapterData } from '@/lib/services/bibles.service';

export function NotesAlertDialog() {
    const [notes, setNotes] = React.useState('');
    const [tags, setTags] = React.useState('');
    
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="p-0 m-0 min-h-0 h-auto">
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

export function VerseDropdownMenu({text, verseId, verseReference, onHighlight, onRemoveHighlight, currentHighlight}:{
  text: string;
  verseId: number;
  verseReference: string;
  onHighlight?: (verseId: number, color: string) => void;
  onRemoveHighlight?: (verseId: number) => void;
  currentHighlight?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={true}>
          <Text className="text-base leading-relaxed flex-1" style={{ flexShrink: 1 }}>
            {text}
          </Text>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <Text>Highlight</Text>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onPress={() => onHighlight?.(verseId, 'yellow')}>
            <View className="flex-row items-center gap-2">
              <View className="h-4 w-4 rounded bg-yellow-300" />
              <Text>Highlight - Yellow</Text>
            </View>
          </DropdownMenuItem>
          <DropdownMenuItem onPress={() => onHighlight?.(verseId, 'green')}>
            <View className="flex-row items-center gap-2">
              <View className="h-4 w-4 rounded bg-green-300" />
              <Text>Highlight - Green</Text>
            </View>
          </DropdownMenuItem>
          {currentHighlight && (
            <DropdownMenuItem onPress={() => onRemoveHighlight?.(verseId)}>
              <Text>Remove Highlight</Text>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuLabel>
          <Text>Learn More</Text>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link 
              href={{
                pathname: '/study',
                params: { 
                  verseId, 
                  text,
                  reference: verseReference
                }
              }}
            >
              <Text>Study this Verse</Text>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <NotesAlertDialog />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuLabel>
          <Text>Share</Text>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link 
              href={{
                pathname: '/share',
                params: { verseId, text, reference: verseReference }
              }}
            >
              <View className="flex-row items-center">
                <Share2 className="text-primary mr-2" size={16} />
                <Text>Share this Verse</Text>
              </View>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function VerseHoverCard({ text, reference }: { text: string; reference?: string }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild={true}>
        <Button variant="link" className="p-0 min-h-0">
          <Text className="text-base font-semibold text-primary">{text}</Text>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <View className="gap-2">
          <Text className="text-sm font-semibold">{reference || `Verse ${text}`}</Text>
          <Text className="text-xs text-muted-foreground">
            Click on the verse text to highlight, study, or share this verse.
          </Text>
        </View>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function BibleDetailScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [completed, setCompleted] = useState(false);
  const [bibleData, setBibleData] = useState<BibleDetail | null>(null);
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Highlighting state: Map of verse IDs to highlight colors
  const [highlights, setHighlights] = useState<Record<number, string>>({});

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState(1);
  // Track Select open state to avoid gesture conflicts on native
  const [bookSelectOpen, setBookSelectOpen] = useState(false);
  const [chapterSelectOpen, setChapterSelectOpen] = useState(false);
  const isAnySelectOpen = bookSelectOpen || chapterSelectOpen;
  
  // Highlighting functions
  const handleHighlight = (verseId: number, color: string) => {
    setHighlights(prev => ({
      ...prev,
      [verseId]: color,
    }));
  };
  
  const handleRemoveHighlight = (verseId: number) => {
    setHighlights(prev => {
      const newHighlights = { ...prev };
      delete newHighlights[verseId];
      return newHighlights;
    });
  };

  // Fetch Bible detail on mount
  useEffect(() => {
    const fetchBibleDetail = async () => {
      try {
        setLoading(true);
        const data = await getBibleDetail(Number(id));
        setBibleData(data);
        
        // If initialChapter is provided, use it
        if (data.initialChapter) {
          setSelectedBook(data.initialChapter.book);
          setSelectedChapter(data.initialChapter.chapter_number);
          setChapterData({
            book: data.initialChapter.book,
            chapter_number: data.initialChapter.chapter_number,
            verses: data.initialChapter.verses,
            bible: data.bible,
          });
          setLoadingChapter(false);
        } else if (data.books && data.books.length > 0) {
          setSelectedBook(data.books[0]);
        }
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load bible');
        // Use mock data as fallback
        const mockBible: BibleDetail = {
          bible: {
            id: Number(id),
            name: 'New International Version',
            abbreviation: 'NIV',
            description: 'A modern, easy-to-read translation',
            language: 'English',
            version: '2011',
          },
          books: [
            { id: 1, bible_id: Number(id), title: 'Genesis', book_number: 1, chapters_count: 50 },
            { id: 2, bible_id: Number(id), title: 'Exodus', book_number: 2, chapters_count: 40 },
            { id: 3, bible_id: Number(id), title: 'Psalms', book_number: 19, chapters_count: 150 },
            { id: 4, bible_id: Number(id), title: 'Matthew', book_number: 40, chapters_count: 28 },
            { id: 5, bible_id: Number(id), title: 'John', book_number: 43, chapters_count: 21 },
          ],
        };
        setBibleData(mockBible);
        setSelectedBook(mockBible.books[0]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBibleDetail();
    }
  }, [id]);

  // Fetch chapter data when book or chapter changes
  useEffect(() => {
    const fetchChapterData = async () => {
      if (!selectedBook || !bibleData) return;

      // Check if we already have this chapter data loaded (from initial load)
      if (chapterData && 
          chapterData.book.id === selectedBook.id && 
          chapterData.chapter_number === selectedChapter) {
        return;
      }

      try {
        setLoadingChapter(true);
        const data = await getChapterData(Number(id), selectedBook.id, selectedChapter);
        setChapterData(data);
      } catch (err: any) {
        // Use mock verses as fallback
        const mockChapter: ChapterData = {
          bible: bibleData.bible,
          book: selectedBook,
          chapter_number: selectedChapter,
          verses: Array.from({ length: 31 }, (_, i) => ({
            id: i + 1,
            book_id: selectedBook.id,
            chapter_number: selectedChapter,
            verse_number: i + 1,
            text: `This is verse ${i + 1} from ${selectedBook.title} chapter ${selectedChapter}. The content would be the actual verse text from the Bible.`,
          })),
        };
        setChapterData(mockChapter);
      } finally {
        setLoadingChapter(false);
      }
    };

    fetchChapterData();
  }, [selectedBook, selectedChapter, id, bibleData]);

  // Update header title with Bible version
  useEffect(() => {
    if (bibleData) {
      navigation.setOptions({
        headerTitle: bibleData.bible.abbreviation,
      });
    }
  }, [navigation, bibleData]);

  const canGoPrevious = selectedChapter > 1;
  const canGoNext = selectedBook && selectedChapter < selectedBook.chapters_count;

  // Swipe gesture handler
  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && canGoNext) {
      // Swipe left (right-to-left) = next chapter
      setSelectedChapter(selectedChapter + 1);
    } else if (direction === 'right' && canGoPrevious) {
      // Swipe right (left-to-right) = previous chapter
      setSelectedChapter(selectedChapter - 1);
    }
  };

  // Use explicit Directions for clarity
  const swipeRightGesture = Gesture.Fling()
    .direction(Directions.RIGHT) // left-to-right swipe -> previous chapter
    .onEnd(() => {
      handleSwipe('right');
    })
    .runOnJS(true)
    .enabled(!isAnySelectOpen);

  const swipeLeftGesture = Gesture.Fling()
    .direction(Directions.LEFT) // right-to-left swipe -> next chapter
    .onEnd(() => {
      handleSwipe('left');
    })
    .runOnJS(true)
    .enabled(!isAnySelectOpen);

  const composedGesture = Gesture.Exclusive(swipeRightGesture, swipeLeftGesture);

  if (!bibleData || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted-foreground text-center">Loading Bible...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <GestureDetector gesture={composedGesture}>
        <ScrollView className="flex-1 bg-background">
          <View className="flex-1 gap-4 p-4">
          {/* Error State */}
          {error && (
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

          {/* Header Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <BookOpen size={20} className="text-primary" />
              <Text>{bibleData.bible.name}</Text>
            </CardTitle>
            <CardDescription>{bibleData.bible.description}</CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            {/* Book and Chapter Selector */}
            <View className="gap-3 w-full">
              <View className="w-full">
                <Select
                  className="w-full"
                  value={selectedBook ? { value: String(selectedBook.id), label: selectedBook.title } : undefined}
                  onOpenChange={(open) => {
                    setBookSelectOpen(!!open);
                  }}
                  onValueChange={(option) => {
                    const v = (option as any)?.value as string | undefined;
                    if (!v) return;
                    const book = bibleData.books.find(b => b.id === Number(v));
                    if (book) {
                      setSelectedBook(book);
                      setSelectedChapter(1);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {bibleData.books && Array.isArray(bibleData.books) && bibleData.books.map((book: BibleDetail['books'][number]) => (
                        <SelectItem 
                          key={book.id} 
                          value={book.id.toString()}
                          label={book.title}
                        >
                          {book.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </View>
            </View>

            <View className="w-full">
              <Select
                value={{ value: String(selectedChapter), label: String(selectedChapter) }}
                onOpenChange={(open) => {
                  setChapterSelectOpen(!!open);
                }}
                onValueChange={(option) => {
                  const v = (option as any)?.value as string | undefined;
                  if (v) {
                    setSelectedChapter(Number(v));
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chapter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {selectedBook && Array.from({ length: selectedBook.chapters_count }, (_, i) => i + 1).map((ch) => (
                      <SelectItem 
                        key={ch} 
                        value={ch.toString()}
                        label={ch.toString()}
                      >
                        {ch}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>

            {/* Navigation Buttons */}
            <View className="flex-col gap-2">
              <Button 
                variant={completed ? "default" : "outline"}
                onPress={() => setCompleted(!completed)}
              >
                <CheckCircle size={16} className={completed ? "text-secondary" : "text-primary"}/>
                <Text className="ml-2">
                  {completed ? 'Completed' : 'Mark as Complete'}
                </Text>
              </Button>
              
              {/* Verses */}
              <View className="mt-2">
                <CardContent className="gap-2 mx-auto">
                  {selectedBook && (
                    <Text className="text-base font-bold text-center">
                      {selectedBook.title} {selectedChapter}
                    </Text>
                  )}
                  
                  {/* Loading Chapter State */}
                  {loadingChapter && (
                    <View className="flex-1 items-center justify-center py-8">
                      <ActivityIndicator />
                      <Text className="mt-2 text-muted-foreground text-sm">Loading chapter...</Text>
                    </View>
                  )}
                  
                  {/* Verses */}
                  {!loadingChapter && chapterData && chapterData.verses && Array.isArray(chapterData.verses) && chapterData.verses.map((verse) => {
                    const highlightColor = highlights[verse.id];
                    const highlightStyle = highlightColor 
                      ? highlightColor === 'yellow' 
                        ? { backgroundColor: '#fef08a' }
                        : { backgroundColor: '#86efac' }
                      : undefined;
                    const verseReference = `${selectedBook?.title} ${selectedChapter}:${verse.verse_number}`;
                    
                    return (
                      <View 
                        key={verse.id} 
                        style={highlightStyle}
                        className="rounded px-1 py-0.5"
                      >
                        <View className="flex-row items-start gap-2">
                          <View className="pt-0.5">
                            <VerseHoverCard 
                              text={verse.verse_number.toString()} 
                              reference={verseReference}
                            />
                          </View>
                          <View className="flex-1" style={{ flex: 1, flexShrink: 1 }}>
                            <VerseDropdownMenu 
                              text={verse.text}
                              verseId={verse.id}
                              verseReference={verseReference}
                              onHighlight={handleHighlight}
                              onRemoveHighlight={handleRemoveHighlight}
                              currentHighlight={highlightColor}
                            />
                          </View>
                        </View>
                      </View>
                    );
                  })}
                  
                  {/* Debug info */}
                  {!loadingChapter && !chapterData && (
                    <Text className="text-muted-foreground text-center">No chapter data</Text>
                  )}
                  {!loadingChapter && chapterData && (!chapterData.verses || !Array.isArray(chapterData.verses) || chapterData.verses.length === 0) && (
                    <Text className="text-muted-foreground text-center">No verses found</Text>
                  )}
                </CardContent>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
      </ScrollView>
    </GestureDetector>
    </GestureHandlerRootView>
  );
}
