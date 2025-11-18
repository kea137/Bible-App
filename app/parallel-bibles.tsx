import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { SplitSquareHorizontal, BookOpen, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react-native';
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

        {/* Header Card with Bible Selectors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <SplitSquareHorizontal size={20} color={primaryIconColor} />
              <Text>Parallel Bibles</Text>
            </CardTitle>
            <CardDescription>Compare two Bible translations side by side</CardDescription>
          </CardHeader>
          <CardContent className="gap-4">
            {/* Bible 1 Selector */}
            <View className="gap-2">
              <Text className="text-sm font-semibold">First Translation</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                {bibles.map((bible) => (
                  <Button
                    key={bible.id}
                    variant={selectedBible1?.id === bible.id ? "default" : "outline"}
                    size="sm"
                    onPress={() => setSelectedBible1(bible)}
                  >
                    <Text>{bible.abbreviation}</Text>
                  </Button>
                ))}
              </ScrollView>
            </View>

            {/* Bible 2 Selector */}
            <View className="gap-2">
              <Text className="text-sm font-semibold">Second Translation</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                {bibles.map((bible) => (
                  <Button
                    key={bible.id}
                    variant={selectedBible2?.id === bible.id ? "default" : "outline"}
                    size="sm"
                    onPress={() => setSelectedBible2(bible)}
                  >
                    <Text>{bible.abbreviation}</Text>
                  </Button>
                ))}
              </ScrollView>
            </View>

            {/* Book Selector */}
            <View className="gap-2">
              <Text className="text-sm font-semibold">Book</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                {mockBooks.map((book) => (
                  <Button
                    key={book.id}
                    variant={selectedBook?.id === book.id ? "default" : "outline"}
                    size="sm"
                    onPress={() => {
                      setSelectedBook(book);
                      setSelectedChapter(1);
                    }}
                  >
                    <Text>{book.title}</Text>
                  </Button>
                ))}
              </ScrollView>
            </View>

            {/* Chapter Navigation */}
            <View className="gap-2">
              <Text className="text-sm font-semibold">Chapter {selectedChapter}</Text>
              <View className="flex-row items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={selectedChapter <= 1}
                  onPress={() => setSelectedChapter(prev => Math.max(1, prev - 1))}
                >
                  <ChevronLeft size={20} color={primaryIconColor} />
                </Button>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1 flex-row gap-2">
                  {selectedBook && Array.from({ length: selectedBook.chapters_count }, (_, i) => i + 1).map((ch) => (
                    <Button
                      key={ch}
                      variant={selectedChapter === ch ? "default" : "outline"}
                      size="sm"
                      onPress={() => setSelectedChapter(ch)}
                    >
                      <Text>{ch}</Text>
                    </Button>
                  ))}
                </ScrollView>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!selectedBook || selectedChapter >= selectedBook.chapters_count}
                  onPress={() => setSelectedChapter(prev => selectedBook ? Math.min(selectedBook.chapters_count, prev + 1) : prev)}
                >
                  <ChevronRight size={20} color={primaryIconColor} />
                </Button>
              </View>
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
            <CardHeader>
              <CardTitle className="text-center">
                {selectedBook?.title} {selectedChapter}
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              {chapter1Data.verses.map((verse, index) => {
                const verse2 = chapter2Data.verses[index];
                if (!verse2) return null;
                
                return (
                  <View key={verse.id} className="gap-3 border-b border-border pb-4 last:border-b-0">
                    {/* Verse Number */}
                    <Text className="text-sm font-bold text-primary text-center">
                      Verse {verse.verse_number}
                    </Text>
                    
                    {/* Bible 1 */}
                    <View className="gap-2">
                      <Text className="text-xs font-semibold text-muted-foreground">
                        {selectedBible1?.abbreviation}
                      </Text>
                      <Text className="text-base leading-7">{verse.text}</Text>
                    </View>
                    
                    {/* Bible 2 */}
                    <View className="gap-2">
                      <Text className="text-xs font-semibold text-muted-foreground">
                        {selectedBible2?.abbreviation}
                      </Text>
                      <Text className="text-base leading-7">{verse2.text}</Text>
                    </View>
                  </View>
                );
              })}
            </CardContent>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}
