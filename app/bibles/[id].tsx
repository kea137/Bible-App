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
import { BookOpen, CheckCircle } from 'lucide-react-native';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function BibleDetailScreen() {
  const { id } = useLocalSearchParams();
  const [completed, setCompleted] = useState(false);

  // Mock data
  const bible = {
    id: Number(id),
    name: 'New International Version',
    abbreviation: 'NIV',
    description: 'A modern, easy-to-read translation',
    books: [
      { id: 1, title: 'Genesis', book_number: 1, chapters_count: 50 },
      { id: 2, title: 'Exodus', book_number: 2, chapters_count: 40 },
      { id: 3, title: 'Psalms', book_number: 19, chapters_count: 150 },
      { id: 4, title: 'Matthew', book_number: 40, chapters_count: 28 },
      { id: 5, title: 'John', book_number: 43, chapters_count: 21 },
    ],
  };

  const [selectedBook, setSelectedBook] = useState(bible.books[0]);
  const [selectedChapter, setSelectedChapter] = useState(1);

  // Mock verses
  const verses = Array.from({ length: 31 }, (_, i) => ({
    id: i + 1,
    verse_number: i + 1,
    text: `This is verse ${i + 1} from ${selectedBook.title} chapter ${selectedChapter}. The content would be the actual verse text from the Bible.`,
  }));

  const canGoPrevious = selectedChapter > 1;
  const canGoNext = selectedChapter < selectedBook.chapters_count;

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-4 p-4">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <BookOpen size={20} className="text-primary" />
              <Text>{bible.name}</Text>
            </CardTitle>
            <CardDescription>{bible.description}</CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            {/* Book and Chapter Selector */}
            <View className="gap-3 w-full">
              <View className="w-full">
                <Select
                  className="w-full"
                  value={{ value: selectedBook.id.toString(), label: selectedBook.title }}
                  onValueChange={(option) => {
                    const book = bible.books.find(b => b.id === Number(option?.value));
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
                      {bible.books.map((book) => (
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
                    {Array.from({ length: selectedBook.chapters_count }, (_, i) => i + 1).map((ch) => (
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
                <CheckCircle size={16} />
                <Text className="ml-2">
                  {completed ? 'Completed' : 'Mark as Complete'}
                </Text>
              </Button>
              
              {/* Verses */}
              <View className="mt-4">
                <CardContent className="gap-4 py-4">
                  <Text className="text-base font-bold">
                  {selectedBook.title} {selectedChapter}
                  </Text>
                  {verses.map((verse) => (
                    <TouchableOpacity key={verse.id} activeOpacity={0.7}>
                      <View className="flex-row gap-3">
                        <View className="w-8">
                          <Text className="text-sm font-semibold text-primary">
                            {verse.verse_number}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-base leading-7">{verse.text}</Text>
                        </View>
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
  );
}
