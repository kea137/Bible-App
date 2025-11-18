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
import { SplitSquareHorizontal, BookOpen, CheckCircle } from 'lucide-react-native';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getBibles, getChapterData, Bible, ChapterData } from '@/lib/services/bibles.service';
import { useColorScheme } from 'nativewind';

export default function ParallelBiblesScreen() {
  const { id } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const [completed, setCompleted] = useState(false);
  const [bibles, setBibles] = useState<Bible[]>([]);
  const [selectedBible1, setSelectedBible1] = useState<Bible | null>(null);
  const [selectedBible2, setSelectedBible2] = useState<Bible | null>(null);
  const [chapter1Data, setChapter1Data] = useState<ChapterData | null>(null);
  const [chapter2Data, setChapter2Data] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState(1);
  
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
        // Use mock data as fallback
        const mockBibles: Bible[] = [
          {
            id: 1,
            name: 'New International Version',
            abbreviation: 'NIV',
            description: 'A modern, easy-to-read translation',
            language: 'English',
            version: '2011',
          },
          {
            id: 2,
            name: 'King James Version',
            abbreviation: 'KJV',
            description: 'Classic translation with traditional language',
            language: 'English',
            version: '1611',
          },
        ];
        setBibles(mockBibles);
        setSelectedBible1(mockBibles[0]);
        setSelectedBible2(mockBibles[1]);
      } finally {
        setLoading(false);
      }
    };

    fetchBibles();
  }, []);

  // Fetch chapter data when bible or chapter selection changes
  useEffect(() => {
    const fetchChapterData = async () => {
      if (!selectedBible1 || !selectedBible2 || !selectedBook) return;

      try {
        setLoadingChapters(true);
        const [data1, data2] = await Promise.all([
          getChapterData(selectedBible1.id, selectedBook.id, selectedChapter),
          getChapterData(selectedBible2.id, selectedBook.id, selectedChapter),
        ]);
        setChapter1Data(data1);
        setChapter2Data(data2);
      } catch (err: any) {
        console.error('Failed to fetch chapter data:', err);
        // Use mock data as fallback
        const mockVerses = Array.from({ length: 31 }, (_, i) => ({
          id: i + 1,
          book_id: selectedBook.id,
          chapter_number: selectedChapter,
          verse_number: i + 1,
          text: `This is verse ${i + 1} from ${selectedBook.title} chapter ${selectedChapter}. The content would be the actual verse text from the Bible.`,
          highlight: { id: 0, color: '' }
        }));
        
        if (selectedBible1) {
          setChapter1Data({
            bible: selectedBible1,
            book: selectedBook,
            chapter_number: selectedChapter,
            verses: mockVerses,
          });
        }
        
        if (selectedBible2) {
          setChapter2Data({
            bible: selectedBible2,
            book: selectedBook,
            chapter_number: selectedChapter,
            verses: mockVerses.map(v => ({ ...v, text: `${v.text} (Translation 2)` })),
          });
        }
      } finally {
        setLoadingChapters(false);
      }
    };

    fetchChapterData();
  }, [selectedBible1, selectedBible2, selectedBook, selectedChapter]);

  // Initialize with mock book data
  useEffect(() => {
    if (bibles.length > 0 && !selectedBook) {
      setSelectedBook({
        id: 1,
        title: 'Genesis',
        book_number: 1,
        chapters_count: 50,
      });
    }
  }, [bibles]);

  // Mock bible data structure for book selection
  const mockBooks = [
    { id: 1, title: 'Genesis', book_number: 1, chapters_count: 50 },
    { id: 2, title: 'Exodus', book_number: 2, chapters_count: 40 },
    { id: 3, title: 'Psalms', book_number: 19, chapters_count: 150 },
    { id: 4, title: 'Matthew', book_number: 40, chapters_count: 28 },
    { id: 5, title: 'John', book_number: 43, chapters_count: 21 },
  ];

  const canGoPrevious = selectedChapter > 1;
  const canGoNext = selectedBook && selectedChapter < selectedBook.chapters_count;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted-foreground">Loading bibles...</Text>
      </View>
    );
  }

  return (
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
                <SelectContent>
                  <SelectGroup>
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
                <SelectContent>
                  <SelectGroup>
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
                value={{ value: selectedBook?.id.toString() || '', label: selectedBook?.title || '' }}
                onValueChange={(option) => {
                  const book = mockBooks.find(b => b.id === Number(option?.value));
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
                    {mockBooks.map((book) => (
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

            {/* Mark as Complete */}
            <Button 
              variant={completed ? "default" : "outline"}
              onPress={() => setCompleted(!completed)}
            >
              <CheckCircle size={16} color={primaryIconColor} />
              <Text className="ml-2">
                {completed ? 'Completed' : 'Mark as Complete'}
              </Text>
            </Button>
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
                      <View className="w-8">
                        <Text className="text-sm font-semibold text-primary">
                          {verse.verse_number}
                        </Text>
                      </View>
                      <View className="flex-1 gap-2">
                        <Text className="text-base leading-7">{verse.text}</Text>
                        <Text className="text-base leading-7 italic">{verse2.text}</Text>
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
