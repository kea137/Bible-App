import { Text } from '@showcase/components/ui/text';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@showcase/components/ui/select';
import { SplitSquareHorizontal, BookOpen, CheckCircle } from 'lucide-react-native';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getBibles, getBibleDetail, getChapterData, Bible, ChapterData, BibleDetail } from '@/lib/services/bibles.service';
import { useColorScheme } from 'nativewind';
import { PortalHost } from '@rn-primitives/portal';
import { useTranslation } from 'react-i18next';

export default function ParallelBiblesScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const [completed, setCompleted] = useState(false);
  const [bibles, setBibles] = useState<Bible[]>([]);
  const [selectedBible1, setSelectedBible1] = useState<Bible | null>(null);
  const [selectedBible2, setSelectedBible2] = useState<Bible | null>(null);
  const [bibleData1, setBibleData1] = useState<BibleDetail | null>(null);
  const [bibleData2, setBibleData2] = useState<BibleDetail | null>(null);
  const [chapter1Data, setChapter1Data] = useState<ChapterData | null>(null);
  const [chapter2Data, setChapter2Data] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingBibleDetails, setLoadingBibleDetails] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  
  // Theme-aware icon color
  const primaryIconColor = colorScheme === 'dark' ? '#fafafa' : '#18181b';

  // Fetch all bibles on mount
  useEffect(() => {
    const fetchBibles = async () => {
      try {
        setLoading(true);
        const data = await getBibles();
        setBibles(data);
        if (data.length >= 2) {
          setSelectedBible1(data[0]);
          setSelectedBible2(data[1]);
        }
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch bibles:', err);
        setError(err.message || 'Failed to load bibles');
      } finally {
        setLoading(false);
      }
    };

    fetchBibles();
  }, []);

  // Fetch Bible details when selected bibles change
  useEffect(() => {
    const fetchBibleDetails = async () => {
      if (!selectedBible1 || !selectedBible2) return;

      try {
        setLoadingBibleDetails(true);
        const [data1, data2] = await Promise.all([
          getBibleDetail(selectedBible1.id),
          getBibleDetail(selectedBible2.id),
        ]);
        setBibleData1(data1);
        setBibleData2(data2);
        
        // Initialize with first book and chapter from bible1
        if (data1.books && data1.books.length > 0) {
          const firstBook = data1.books[0];
          setSelectedBook(firstBook);
          setSelectedChapter(1);
          // Find chapter 1's ID from the book's chapters array
          const firstChapter = firstBook.chapters?.find(ch => ch.chapter_number === 1);
          setSelectedChapterId(firstChapter?.id || null);
        }
      } catch (err: any) {
        console.error('Failed to fetch bible details:', err);
        setError(err.message || 'Failed to load bible details');
      } finally {
        setLoadingBibleDetails(false);
      }
    };

    fetchBibleDetails();
  }, [selectedBible1, selectedBible2]);

  // Fetch chapter data when bible or chapter selection changes
  useEffect(() => {
    const fetchChapterData = async () => {
      if (!selectedBible1 || !selectedBible2 || !selectedBook || !selectedChapterId || !bibleData1 || !bibleData2) return;

      try {
        setLoadingChapters(true);
        
        // Find the corresponding book in Bible 2 based on book_number
        const book2 = bibleData2.books.find(b => b.book_number === selectedBook.book_number);
        if (!book2) {
          console.error('Book not found in Bible 2:', selectedBook.book_number);
          setError('Selected book not available in second translation');
          setLoadingChapters(false);
          return;
        }
        
        // Find the corresponding chapter in Bible 2 based on chapter_number
        const chapter2 = book2.chapters?.find(ch => ch.chapter_number === selectedChapter);
        if (!chapter2) {
          console.error('Chapter not found in Bible 2:', selectedChapter);
          setError('Selected chapter not available in second translation');
          setLoadingChapters(false);
          return;
        }
        
        const [data1, data2] = await Promise.all([
          getChapterData(selectedBible1.id, selectedBook.id, selectedChapterId),
          getChapterData(selectedBible2.id, book2.id, chapter2.id),
        ]);
        setChapter1Data(data1);
        setChapter2Data(data2);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch chapter data:', err);
        setError(err.message || 'Failed to load chapter data');
      } finally {
        setLoadingChapters(false);
      }
    };

    fetchChapterData();
  }, [selectedBible1, selectedBible2, selectedBook, selectedChapterId, bibleData1, bibleData2, selectedChapter]);

  // Initialize with mock book data
  useEffect(() => {
    if (bibles.length > 0 && !selectedBook) {
      // Wait for bible details to be loaded
      // Book will be set in the fetchBibleDetails effect
    }
  }, [bibles]);

  const canGoPrevious = selectedChapter > 1;
  const canGoNext = selectedBook && selectedChapter < selectedBook.chapters_count;

  if (loading || loadingBibleDetails) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted-foreground">Loading bibles...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <PortalHost name="root" />
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

        {/* Header Card with Bible and Chapter Selectors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <SplitSquareHorizontal size={20} color={primaryIconColor} />
              <Text>Parallel Bibles</Text>
            </CardTitle>
            <CardDescription>Compare two Bible translations side by side</CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            {/* First Translation Selector */}
            <View className="w-full">
              <Select
                value={selectedBible1 ? { value: selectedBible1.id.toString(), label: selectedBible1.abbreviation } : undefined}
                onValueChange={(option) => {
                  const bible = bibles.find(b => b.id === Number(option?.value));
                  if (bible) {
                    setSelectedBible1(bible);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="First Translation" />
                </SelectTrigger>
                <SelectContent portalHost="root">
                   <SelectGroup className="h-80 w-[320px]">
                    {bibles.map((bible) => (
                      <SelectItem 
                        key={bible.id} 
                        value={bible.id.toString()}
                        label={bible.abbreviation}
                      >
                        {bible.abbreviation}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>

            {/* Second Translation Selector */}
            <View className="w-full">
              <Select
                value={selectedBible2 ? { value: selectedBible2.id.toString(), label: selectedBible2.abbreviation } : undefined}
                onValueChange={(option) => {
                  const bible = bibles.find(b => b.id === Number(option?.value));
                  if (bible) {
                    setSelectedBible2(bible);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Second Translation" />
                </SelectTrigger>
                <SelectContent portalHost="root">
                   <SelectGroup className="h-80 w-[320px]">
                    {bibles.map((bible) => (
                      <SelectItem 
                        key={bible.id} 
                        value={bible.id.toString()}
                        label={bible.abbreviation}
                      >
                        {bible.abbreviation}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>

            {/* Book Selector */}
            <View className="w-full">
              <Select
                className="w-full"
                value={selectedBook ? { value: String(selectedBook.id), label: selectedBook.title } : undefined}
                onValueChange={(option) => {
                  const v = (option as any)?.value as string | undefined;
                  if (!v || !bibleData1) return;
                  const book = bibleData1.books.find(b => b.id === Number(v));
                  if (book) {
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
                <SelectContent portalHost="root">
                   <SelectGroup className="h-80 w-[320px]">
                    {bibleData1?.books && bibleData1.books.map((book) => (
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

            {/* Chapter Selector */}
            <View className="w-full">
              <Select
                value={{ value: selectedChapter.toString(), label: `Chapter ${selectedChapter}` }}
                onValueChange={(option) => {
                  const v = (option as any)?.value as string | undefined;
                  if (v && selectedBook) {
                    const chapterNum = Number(v);
                    setSelectedChapter(chapterNum);
                    // Find the chapter ID from the book's chapters array
                    const chapter = selectedBook.chapters?.find(ch => ch.chapter_number === chapterNum);
                    setSelectedChapterId(chapter?.id || null);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chapter" />
                </SelectTrigger>
                <SelectContent portalHost="root">
                  <SelectGroup className="h-80 w-[320px]">
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
                          label={`Chapter ${ch}`}
                        >
                          Chapter {ch}
                        </SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>

          </CardContent>
        </Card>

        {/* Loading State */}
        {loadingChapters && (
          <View className="flex-1 items-center justify-center py-8">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-muted-foreground">Loading verses...</Text>
          </View>
        )}

        {/* Parallel Verses Display */}
        {!loadingChapters && chapter1Data && chapter2Data && (
          <Card>
            <CardContent className="gap-3 py-4">
              {selectedBook && (
                <Text className="text-base font-bold">
                  {selectedBook.title} {selectedChapter}
                </Text>
              )}
              
              {chapter1Data.verses.map((verse, index) => {
                const verse2 = chapter2Data.verses[index];
                if (!verse2) return null;
                
                return (
                  <TouchableOpacity key={verse.id} activeOpacity={0.7}>
                    <View className="flex-row gap-3">
                      <View className="wr-4 mt-1">
                        <Text className="text-sm text-primary">
                          {verse.verse_number}
                        </Text>
                      </View>
                      <View className="flex-1 gap-2">
                        <Text className="text-base leading-7">{verse.text}</Text>
                        <Text className="text-base leading-7" style={{ fontFamily: 'Times New Roman' }}>{verse2.text}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </CardContent>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}
