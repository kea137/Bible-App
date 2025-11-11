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
import { SplitSquareHorizontal, BookOpen } from 'lucide-react-native';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function ParallelBiblesScreen() {
  // Mock data
  const bibles = [
    { id: 1, name: 'NIV', abbreviation: 'NIV' },
    { id: 2, name: 'KJV', abbreviation: 'KJV' },
    { id: 3, name: 'ESV', abbreviation: 'ESV' },
  ];

  const books = [
    { id: 1, title: 'Genesis' },
    { id: 2, title: 'Exodus' },
    { id: 3, title: 'John' },
  ];

  const [selectedBible1, setSelectedBible1] = useState(bibles[0]);
  const [selectedBible2, setSelectedBible2] = useState(bibles[1]);
  const [selectedBook, setSelectedBook] = useState(books[2]);
  const [selectedChapter, setSelectedChapter] = useState(3);

  // Mock verses (would be different for each Bible)
  const verses = Array.from({ length: 20 }, (_, i) => ({
    verse_number: i + 1,
    niv_text: `NIV: This is verse ${i + 1} from ${selectedBook.title} chapter ${selectedChapter}. For God so loved the world...`,
    kjv_text: `KJV: This is verse ${i + 1} from ${selectedBook.title} chapter ${selectedChapter}. For God so loved the world...`,
  }));

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-4 p-4">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <SplitSquareHorizontal size={20} className="text-primary" />
              <Text>Parallel Bibles</Text>
            </CardTitle>
            <CardDescription>Compare different Bible translations side by side</CardDescription>
          </CardHeader>
        </Card>

        {/* Bible Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Translations</CardTitle>
          </CardHeader>
          <CardContent className="gap-4">
            <View className="flex-row gap-3">
              <View className="flex-1 gap-2">
                <Text className="text-sm font-medium">Bible 1</Text>
                <Select
                  value={{ value: selectedBible1.id.toString(), label: selectedBible1.abbreviation }}
                  onValueChange={(option) => {
                    const bible = bibles.find(b => b.id === Number(option?.value));
                    if (bible) setSelectedBible1(bible);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Bible" />
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

              <View className="flex-1 gap-2">
                <Text className="text-sm font-medium">Bible 2</Text>
                <Select
                  value={{ value: selectedBible2.id.toString(), label: selectedBible2.abbreviation }}
                  onValueChange={(option) => {
                    const bible = bibles.find(b => b.id === Number(option?.value));
                    if (bible) setSelectedBible2(bible);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Bible" />
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
            </View>

            {/* Book and Chapter Selection */}
            <View className="flex-row gap-3">
              <View className="flex-1 gap-2">
                <Text className="text-sm font-medium">Book</Text>
                <Select
                  value={{ value: selectedBook.id.toString(), label: selectedBook.title }}
                  onValueChange={(option) => {
                    const book = books.find(b => b.id === Number(option?.value));
                    if (book) setSelectedBook(book);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {books.map((book) => (
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

              <View className="w-24 gap-2">
                <Text className="text-sm font-medium">Chapter</Text>
                <Select
                  value={{ value: selectedChapter.toString(), label: selectedChapter.toString() }}
                  onValueChange={(option) => {
                    if (option?.value) setSelectedChapter(Number(option.value));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Array.from({ length: 21 }, (_, i) => i + 1).map((ch) => (
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
            </View>
          </CardContent>
        </Card>

        {/* Chapter Title */}
        <View className="gap-1">
          <Text className="text-2xl font-bold">
            {selectedBook.title} {selectedChapter}
          </Text>
          <Text className="text-sm text-muted-foreground">
            Comparing {selectedBible1.abbreviation} and {selectedBible2.abbreviation}
          </Text>
        </View>

        {/* Parallel Verses */}
        <View className="gap-3">
          {verses.map((verse) => (
            <Card key={verse.verse_number}>
              <CardContent className="gap-4 py-4">
                {/* Verse Number */}
                <Text className="text-sm font-bold text-primary">
                  Verse {verse.verse_number}
                </Text>

                {/* Bible 1 */}
                <View className="gap-2">
                  <Text className="text-xs font-semibold text-muted-foreground">
                    {selectedBible1.abbreviation}
                  </Text>
                  <Text className="text-base leading-7">{verse.niv_text}</Text>
                </View>

                {/* Divider */}
                <View className="h-px bg-border" />

                {/* Bible 2 */}
                <View className="gap-2">
                  <Text className="text-xs font-semibold text-muted-foreground">
                    {selectedBible2.abbreviation}
                  </Text>
                  <Text className="text-base leading-7">{verse.kjv_text}</Text>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
