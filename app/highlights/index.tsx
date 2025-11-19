import { Text } from '@showcase/components/ui/text';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { 
  BookOpen, 
  Highlighter, 
} from 'lucide-react-native';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { getHighlightedVerses, VerseHighlight } from '@/lib/services/highlights.service';
import { useColorScheme } from 'nativewind';
import { Link } from 'expo-router';
import { Button } from '@showcase/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function HighlightsScreen() {
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();
  const [highlights, setHighlights] = useState<VerseHighlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Theme-aware icon color
  const primaryIconColor = colorScheme === 'dark' ? '#fafafa' : '#18181b';

  // Fetch highlights on mount
  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setLoading(true);
        const data = await getHighlightedVerses();
        setHighlights(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch highlights:', err);
        setError(err.message || t('Failed to load highlights') || 'Failed to load highlights');
        // Use mock data as fallback
        setHighlights([
          {
            id: 1,
            user_id: 1,
            verse_id: 1,
            color: '#fbbf24',
            note: 'Remember to rely on God\'s wisdom, not my own',
            verse: {
              id: 1,
              text: 'Trust in the LORD with all your heart and lean not on your own understanding.',
              reference: 'Proverbs 3:5',
              chapter_number: 3,
              verse_number: 5,
            },
          },
          {
            id: 2,
            user_id: 1,
            verse_id: 2,
            color: '#3b82f6',
            verse: {
              id: 2,
              text: 'I can do all things through Christ who strengthens me.',
              reference: 'Philippians 4:13',
              chapter_number: 4,
              verse_number: 13,
            },
          },
          {
            id: 3,
            user_id: 1,
            verse_id: 3,
            color: '#34d399',
            verse: {
              id: 3,
              text: 'The LORD is my shepherd, I lack nothing.',
              reference: 'Psalms 23:1',
              chapter_number: 23,
              verse_number: 1,
            },
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-6 p-4">
        <Card
                className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10"
            >
            <CardContent className="pt-2">
              
                        <CardTitle className="mb-1 text-sm font-semibold sm:text-base">
                          Make Reading a Habit
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          Set aside time each day to read and reflect on the Word
                        </CardDescription>
                    <BookOpen
                        className="h-6 w-6 mt-2 text-primary/40 sm:h-8 sm:w-8"
                    />
            
            </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-muted-foreground">{t('Loading highlights...') || 'Loading highlights...'}</Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="border-destructive">
            <CardContent className="py-4">
              <Text className="text-destructive text-center">
                {error}
              </Text>
              <Text className="text-muted-foreground text-center text-sm mt-2">
                {t('Showing cached data') || 'Showing cached data'}
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Highlighted Verses */}
        {highlights && highlights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex-row items-center gap-2">
                <Highlighter size={20} color={primaryIconColor} />
                <Text>{t('Your Highlighted Verses') || 'Your Highlighted Verses'}</Text>
              </CardTitle>
              <CardDescription>
                {t("Recent verses you've marked") || "Recent verses you've marked"}
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-3">
              {highlights.map((highlight) =>{
                const bgClass = 
                highlight.color === 'yellow' ? 'bg-yellow-200/20' : 'bg-green-300/25';
                const bgColor = 
                  highlight.color === 'yellow' ? '#FEF08A1F' : '#86EFAC1F'; // 1F hex = 12% opacity

                return (
                <View
                  key={highlight.id}
                  className={`rounded-r border-l-4 py-2 pl-3 ${bgClass}`}
                  style={{ 
                    borderLeftColor: highlight.color, 
                    backgroundColor: bgColor // More transparent tint (hex alpha 20 ≈ 12% opacity)
                  }}
                >
                  <Text className="mb-2 text-sm">
                    {highlight.verse.text}
                  </Text>
                  {/* <Text className="text-xs font-medium tex</View>t-muted-foreground">
                    {highlight.reference}
                  </Text> */}
                  {highlight.note && (
                    <Text className="mt-1 text-xs italic text-muted-foreground">
                      {t('Note')}: {highlight.note}
                    </Text>
                  )}
                </View>
              )})}
          
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && highlights.length === 0 && (
          <Card>
            <CardContent className="items-center justify-center py-12">
              <Highlighter size={48} className="mb-4 text-muted-foreground" />
              <Text className="mb-2 text-lg font-semibold">{t('No highlights yet') || 'No highlights yet'}</Text>
              <Text className="text-center text-sm text-muted-foreground">
                {t('Start highlighting verses to remember your favorite passages') || 'Start highlighting verses to remember your favorite passages'}
              </Text>
            </CardContent>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}
