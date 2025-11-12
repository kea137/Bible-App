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
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@showcase/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@showcase/components/ui/avatar';
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
import { getBibleDetail, getChapterData, BibleDetail, ChapterData } from '@/src/lib/services/bibles.service';

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

export function VerseDropdownMenu({text}:{text: string}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={true}>
          <Text variant="p">{text}</Text>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <Text>Highlight</Text>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span
                className="flex items-center gap-2"
            >
                <span
                    className="h-4 w-4 rounded bg-yellow-300"
                ></span>
            <Text>Highlight - Yellow</Text>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span
                className="flex items-center gap-2"
            >
                <span
                    className="h-4 w-4 rounded bg-green-300"
                ></span>
            <Text>Highlight - Green</Text>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Text>Remove Highlight</Text>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuLabel>
          <Text>Learn More</Text>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link key={'/study'} href={'/study'}>
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
            <Link key={'/share'} href={'/share'}>
            <Text className="flex flex-row"> <Share2 className="text-primary mr-4" size={16} /> Share this Verse
            </Text>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function VerseHoverCard({ text }: { text: string }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild={true}>
        <Button variant="link">
          <Text>{text}.</Text>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 ml-8">
        <View className="flex-row justify-between gap-4">
          <Avatar alt="Vercel avatar" className="h-12 w-12">
            <AvatarImage source={{ uri: 'https://github.com/vercel.png' }} />
            <AvatarFallback>
              <Text>VC</Text>
            </AvatarFallback>
          </Avatar>
          <View className="flex-1 gap-1">
            <Text className="text-sm font-semibold">@nextjs</Text>
            <Text className="text-sm">The React Framework – created and maintained by @vercel.</Text>
            <View className="flex-row items-center pt-2">
              <Text className="text-muted-foreground text-xs">Joined December 2021</Text>
            </View>
          </View>
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

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState(1);

  // Fetch Bible detail on mount
  useEffect(() => {
    const fetchBibleDetail = async () => {
      try {
        setLoading(true);
        const data = await getBibleDetail(Number(id));
        setBibleData(data);
        if (data.books && data.books.length > 0) {
          setSelectedBook(data.books[0]);
        }
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch bible detail:', err);
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

      try {
        setLoadingChapter(true);
        const data = await getChapterData(Number(id), selectedBook.id, selectedChapter);
        setChapterData(data);
      } catch (err: any) {
        console.error('Failed to fetch chapter data:', err);
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
    if (direction === 'right' && canGoNext) {
      // Swipe left = next chapter
      setSelectedChapter(selectedChapter + 1);
    } else if (direction === 'left' && canGoPrevious) {
      // Swipe right = previous chapter
      setSelectedChapter(selectedChapter - 1);
    }
  };

  const swipeGesture = Gesture.Fling()
    .direction(1) // right to left
    .onEnd(() => {
      handleSwipe('left');
    })
    .runOnJS(true);

  const swipeLeftGesture = Gesture.Fling()
    .direction(2) // left to right
    .onEnd(() => {
      handleSwipe('right');
    })
    .runOnJS(true);

  const composedGesture = Gesture.Exclusive(swipeGesture, swipeLeftGesture);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted-foreground">Loading bible...</Text>
      </View>
    );
  }

  if (!bibleData) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-destructive text-center">Failed to load bible</Text>
      </View>
    );
  }

  return (
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
                  value={{ value: selectedBook?.id.toString() || '', label: selectedBook?.title || '' }}
                  onValueChange={(option) => {
                    const book = bibleData.books.find(b => b.id === Number(option?.value));
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
                      {bibleData.books.map((book) => (
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
                value={{ value: selectedChapter.toString(), label: selectedChapter.toString() }}
                onValueChange={(option) => {
                  if (option?.value) {
                    setSelectedChapter(Number(option.value));
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
                  {!loadingChapter && chapterData && chapterData.verses.map((verse) => (
                    <TouchableOpacity key={verse.id} activeOpacity={0.7}>
                      <View className="flex-row items-start gap-1">
                        <Text className="font-semibold text-base" numberOfLines={1}>
                          <VerseHoverCard text={verse.verse_number.toString()} />
                        </Text>
                        <Text className="flex-1" numberOfLines={3}>
                          <VerseDropdownMenu text={verse.text} />
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </CardContent>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
      </ScrollView>
    </GestureDetector>
  );
}
