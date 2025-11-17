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
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Platform, ScrollViewComponent } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { Gesture, GestureDetector, GestureHandlerRootView, Directions } from 'react-native-gesture-handler';
import { useColorScheme } from 'nativewind';
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
import { createNote, CreateNoteData } from '@/lib/services/notes.service';
import { createHighlight, deleteHighlight } from '@/lib/services/highlights.service';
import { PortalHost } from '@rn-primitives/portal';

export function NotesAlertDialog({text, verseRef, isOpen, onOpenChange, verseId, onSaveSuccess}: {text: string, verseRef: string, isOpen: boolean, onOpenChange: (open: boolean) => void, verseId: number, onSaveSuccess?: () => void}) {
  const [notes, setNotes] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const handleSaveNote = async () => {
    if (!notes.trim()) {
      console.warn('Note content is empty');
      return;
    }

    try {
      setSaving(true);
      const noteData: CreateNoteData = {
        title: title || undefined,
        content: notes,
        verse_id: verseId,
      };
      await createNote(noteData);
      console.log('Note saved successfully');
      // Reset form and close dialog in batched updates
      setNotes('');
      setTitle('');
      setSaving(false);
      // Call success callback
      onSaveSuccess?.();
      // Defer closing the dialog slightly to avoid hook order issues
      setTimeout(() => {
        onOpenChange(false);
      }, 100);
    } catch (error) {
      console.error('Failed to save note:', error);
      setSaving(false);
    }
  };
    
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <TouchableOpacity onPress={() => onOpenChange(true)}>
        </TouchableOpacity>
      </AlertDialogTrigger>
      <AlertDialogContent portalHost="root">
        <AlertDialogHeader className="items-center justify-center">
          <AlertDialogTitle className="text-center">Add Note to Verse</AlertDialogTitle>
          <AlertDialogDescription className="text-center mb-4">
            {verseRef}
          </AlertDialogDescription>
          <AlertDialogDescription>
            <View className="rounded-lg border bg-muted/50 p-3 items-center">
          <Text className="text-sm italic text-center">{text}</Text>
            </View>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <View className="gap-2">
            <Text className="text-sm font-medium">Title (Optional)</Text>
            <Input
                placeholder="Enter a title for your note"
                value={title}
                onChangeText={setTitle}
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
          <AlertDialogAction onPress={handleSaveNote} disabled={saving}>
            <Text>{saving ? 'Saving...' : 'Save Note'}</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function VerseDropdownMenu({text, verse, verseId, verseRef, highlight}: {text: string, verse: string, verseId: number, verseRef: string, highlight?: string}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNotesOpen, setIsNotesOpen] = React.useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
  const bgClass = highlight === 'yellow' ? 'bg-yellow-200/20' : 'bg-green-300/25';
  const bgColor = highlight === 'yellow' ? '#FEF08A1F' : '#86EFAC1F'; 
  const { colorScheme } = useColorScheme();

  // Theme-aware icon color
  const primaryIconColor = colorScheme === 'dark' ? '#fafafa' : '#18181b';

  const handleNoteSaveSuccess = () => {
    setShowSuccessAlert(true);
    // Auto-hide success alert after 3 seconds
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };

  const highlightColor = async (color: string) => {
    try {
      await createHighlight({ 
        verse_id: verseId, 
        color: color,
      });
    } catch (error) {
      console.log('Failed to create highlight:', error);
    } finally {
        router.push(pathname);
    }
  };
  
  const removeHighlight = async (id: number) => {
    try {
      await deleteHighlight(id);
    } catch (error) {
      console.log('Failed to remove highlight:', error);
    } finally {
        router.push(pathname);
    }
  };

  return (
    <>
      <DropdownMenu>
        {
          (highlight != null && highlight !== '') ? (
            <DropdownMenuTrigger asChild={true} className={`rounded-r py-2 pl-3 ${bgClass}`}
              style={{  
                backgroundColor: bgColor // More transparent tint (hex alpha 20 ≈ 12% opacity)
              }}>
              <Text variant="p" className="flex-1">{verse}. {text}</Text>
            </DropdownMenuTrigger>
          ) : (
            <DropdownMenuTrigger asChild={true}>
              <Text variant="p" className="flex-1">{verse}. {text}</Text>
            </DropdownMenuTrigger>
          )
        }
        
        <DropdownMenuContent className="w-60" portalHost="root">
          <DropdownMenuLabel>
            <Text>Highlight</Text>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onPress={()=>{
              highlightColor('yellow');
            }}>
              <View className="flex-row items-center gap-2">
                <View className="h-4 w-4 rounded bg-yellow-300" />
                <Text>Highlight - Yellow</Text>
              </View>
            </DropdownMenuItem>
            <DropdownMenuItem onPress={()=>{
              highlightColor('green');
            }}>
              <View className="flex-row items-center gap-2">
                <View className="h-4 w-4 rounded bg-green-300" />
                <Text>Highlight - Green</Text>
              </View>
            </DropdownMenuItem>
            <DropdownMenuItem onPress={()=>{
              removeHighlight(verseId);
            }}>
              <Text>Remove Highlight</Text>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuLabel>
            <Text>Learn More</Text>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onPress={() => router.push(`bibles/study/${verseId}`)}>
              <Text>Study this Verse</Text>
            </DropdownMenuItem>
            <DropdownMenuItem onPress={() => setIsNotesOpen(true)}>
              <Text>Put Notes on this Verse</Text>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuLabel>
            <Text>Share</Text>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onPress={() => router.push('/share')}>
              <View className="flex-row items-center gap-2">
                <Share2 color={primaryIconColor} size={16} />
                <Text>Share this Verse</Text>
              </View>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <NotesAlertDialog verseRef={verseRef} text={text} isOpen={isNotesOpen} onOpenChange={setIsNotesOpen} verseId={verseId} onSaveSuccess={handleNoteSaveSuccess} />
      <AlertSuccess open={showSuccessAlert} onOpenChange={setShowSuccessAlert} />
    </>
  );
}

export function AlertSuccess({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent portalHost="root">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primary">Success</AlertDialogTitle>
          <AlertDialogDescription>
            Your note was saved successfully!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>Cancel</Text>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [bookSelectOpen, setBookSelectOpen] = useState(false);
  const [chapterSelectOpen, setChapterSelectOpen] = useState(false);
  const isAnySelectOpen = bookSelectOpen || chapterSelectOpen;
  const { colorScheme } = useColorScheme();
  const [ alertSuccess, setAlertSuccess] = useState(false);

  // Theme-aware icon color
  const primaryIconColor = colorScheme === 'dark' ? '#fafafa' : '#18181b';

  // Fetch Bible detail on mount
  useEffect(() => {
    const fetchBibleDetail = async () => {
      try {
        setLoading(true);
        const data = await getBibleDetail(Number(id));
        setBibleData(data);
        
        // If initialChapter is provided, use it
        if (data.initialChapter) {
          // Find the full book object from data.books which has the chapters array
          const fullBook = data.books?.find(b => b.id === data.initialChapter.book.id) || data.initialChapter.book;
          setSelectedBook(fullBook);
          setSelectedChapter(data.initialChapter.chapter_number);
          setSelectedChapterId(data.initialChapter.id);
          setChapterData({
            id: data.initialChapter.id,
            book: fullBook,
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
            { id: 1, bible_id: Number(id), title: 'Genesis', book_number: 1, chapters_count: 50, chapters: [] },
            { id: 2, bible_id: Number(id), title: 'Exodus', book_number: 2, chapters_count: 40, chapters: [] },
            { id: 3, bible_id: Number(id), title: 'Psalms', book_number: 19, chapters_count: 150, chapters: [] },
          ],
          chapters: [
            {id: 1, book_id: 1, chapter_number: 1, verses: []},
            {id: 2, book_id: 1, chapter_number: 2, verses: []},
            {id: 3, book_id: 1, chapter_number: 3, verses: []},
          ],
          verses: [
            {id: 1, book_id: 1, chapter_number: 1, verse_number: 1, text: 'In the beginning God created the heavens and the earth.', highlight: { id: 0, color: 'yellow' }},
            {id: 2, book_id: 1, chapter_number: 1, verse_number: 2, text: 'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.', highlight: { id: 0, color: 'yellow' }},
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
      if (!selectedBook || !bibleData) {
        console.log('[CHAPTER FETCH] Skipped - no book or bible data');
        return;
      }

      if (!selectedChapterId) {
        console.log('[CHAPTER FETCH] Skipped - no chapter ID yet');
        return;
      }

      // Check if we already have this chapter data loaded
      if (chapterData && 
          chapterData.id === selectedChapterId) {
        console.log('[CHAPTER] Using existing chapter data for chapter ID:', selectedChapterId);
        return;
      }

      try {
        setLoadingChapter(true);
        console.log(`[CHAPTER] Fetching bible ${id}, book ${selectedBook.id} (${selectedBook.title}), chapter ${selectedChapter}, chapterId ${selectedChapterId}`);
        const data = await getChapterData(Number(id), selectedBook.id, selectedChapterId);
        console.log('[CHAPTER] Received data:', {
          hasBook: !!data.book,
          versesCount: data.verses?.length,
          chapterNumber: data.chapter_number,
          chapterId: data.id
        });
        // Ensure the chapter data has the id field
        setChapterData({
          ...data,
          id: selectedChapterId
        });
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
            highlight: { id: 0, color: 'yellow' }
          })),
        };
        setChapterData(mockChapter);
      } finally {
        setLoadingChapter(false);
      }
    };

    fetchChapterData();
  }, [selectedBook, selectedChapter, selectedChapterId, id, bibleData]);

  // Update header title with Bible version
  useEffect(() => {
    if (bibleData) {
      navigation.setOptions({
        headerTitle: bibleData.bible.abbreviation,
      });
    }
  }, [navigation, bibleData]);

  console.log('[CHAPTER AND BOOK DATA]', selectedChapter);
  // Swipe gesture handler
  const handleSwipe = (direction: 'left' | 'right') => {
    console.log('[SWIPE] Direction:', direction, 'Current chapter:', selectedChapter);
    if (direction === 'left' &&  (selectedChapter < selectedBook.chapters_count)) {
      // Swipe left = next chapter
      const nextChapterNum = selectedChapter + 1;
      const nextChapter = selectedBook?.chapters?.find(ch => ch.chapter_number === nextChapterNum);
      console.log('[SWIPE] Next chapter:', {
        chapterNum: nextChapterNum,
        chapterId: nextChapter?.id,
        found: !!nextChapter
      });
      setSelectedChapter(nextChapterNum);
      setSelectedChapterId(nextChapter?.id || null);
    } else if (direction === 'right' && (selectedChapter > 1)) {
      // Swipe right = previous chapter
      const prevChapterNum = selectedChapter - 1;
      const prevChapter = selectedBook?.chapters?.find(ch => ch.chapter_number === prevChapterNum);
      console.log('[SWIPE] Previous chapter:', {
        chapterNum: prevChapterNum,
        chapterId: prevChapter?.id,
        found: !!prevChapter
      });
      setSelectedChapter(prevChapterNum);
      setSelectedChapterId(prevChapter?.id || null);
    }
  };

  // Use explicit Directions for clarity
  const swipeRightGesture = Gesture.Fling()
    .direction(Directions.RIGHT) // left-to-right swipe -> next chapter
    .onEnd(() => {
      handleSwipe('right');
    })
    .runOnJS(true)
    .enabled(!isAnySelectOpen);

  const swipeLeftGesture = Gesture.Fling()
    .direction(Directions.LEFT) // right-to-left swipe -> previous chapter
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
      <PortalHost name="root" />
      {/* <AlertSuccess open={alertSuccess} onOpenChange={setAlertSuccess}/> */}
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
              <BookOpen size={20} color={primaryIconColor} />
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
                  onValueChange={(option) => {

                    const v = (option as any)?.value as string | undefined;
                    if (!v) return;
                    const book = bibleData.books.find(b => b.id === Number(v));
                    if (book) {
                      console.log('[BOOK SELECT] Setting book:', book);
                      setSelectedBook(book);
                      setSelectedChapter(1);
                      // Find chapter 1's ID from the book's chapters array
                      const firstChapter = book.chapters?.find(ch => ch.chapter_number === 1);
                      setSelectedChapterId(firstChapter?.id || null);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent portalHost="root" className="h-100">
                    <SelectGroup className='h-80 w-[320px]'>
                      <ScrollView className="h-100 w-full">  
                      {bibleData.books && Array.isArray(bibleData.books) && bibleData.books.map((book: BibleDetail['books'][number]) => {
                        
                        return (
                        <SelectItem
                          key={book.id}
                          value={book.id.toString()}
                          label={book.title}
                        >
                          {book.title}
                        </SelectItem>
                      )})}
                      </ScrollView>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </View>
            </View>

            <View className="w-full">
              <Select
                value={{ value: String(selectedChapter), label: `Chapter ${selectedChapter}` }}
                onOpenChange={(open) => {
                  console.log('[CHAPTER SELECT] Open changed:', open);
                  setChapterSelectOpen(!!open);
                }}
                onValueChange={(option) => {
                  console.log('[CHAPTER SELECT] Value change:', option);
                  const v = (option as any)?.value as string | undefined;
                  if (v) {
                    const chapterNum = Number(v);
                    console.log('[CHAPTER SELECT] Setting chapter:', chapterNum);
                    setSelectedChapter(chapterNum);
                    // Find the chapter ID from the book's chapters array
                    const chapter = selectedBook?.chapters?.find(ch => ch.chapter_number === chapterNum);
                    setSelectedChapterId(chapter?.id || null);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chapter" />
                </SelectTrigger>
                <SelectContent portalHost="root">
                  <SelectGroup className='h-80 w-[320px]'>
                    <ScrollView>
                    {selectedBook?.chapters && selectedBook.chapters.length > 0 ? (
                      selectedBook.chapters.map((chapter) => (
                        <SelectItem 
                          key={chapter.id} 
                          value={chapter.chapter_number.toString()}
                          label={`Chapter ${chapter.chapter_number}`}
                        >
                          Chapter {chapter.chapter_number}
                        </SelectItem>
                      ))
                    ) : (
                      // Fallback to chapters_count if chapters array not available
                      selectedBook && Array.from({ length: selectedBook.chapters_count }, (_, i) => i + 1).map((ch) => (
                        <SelectItem 
                          key={ch} 
                          value={ch.toString()}
                          label={ch.toString()}
                        >
                          {ch}
                        </SelectItem>
                      ))
                    )}
                    </ScrollView>
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
                <CheckCircle size={16} color={primaryIconColor} />
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
                  {!loadingChapter && chapterData && chapterData.verses && Array.isArray(chapterData.verses) && chapterData.verses.map((verse) => (
                    <TouchableOpacity key={verse.id} activeOpacity={0.7}>
                      <View className="flex-row w-80 items-start pr-4">
                        <View className="flex-1 w-full">
                          <VerseDropdownMenu text={verse.text} verseId={verse.id} highlight={verse.highlight?.color} verse={verse.verse_number.toString()} verseRef={`${selectedBook?.title} ${selectedChapter}:${verse.verse_number}`}/>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                  
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
