import { Text } from '@showcase/components/ui/text';
import { useColorScheme } from 'nativewind';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { Input } from '@showcase/components/ui/input';
import { Link, useNavigation } from 'expo-router';
import { BookOpen, Search } from 'lucide-react-native';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { getBibles, Bible } from '@/lib/services/bibles.service';
import { useTranslation } from 'react-i18next';

export default function BiblesScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [bibles, setBibles] = useState<Bible[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  // Theme-aware icon color
  const primaryIconColor = colorScheme === 'dark' ? '#fafafa' : '#18181b';

  // Fetch bibles on mount
  useEffect(() => {

    navigation.setOptions({
      headerTitle: t('Bibles') || 'Bibles'
    })

    const fetchBibles = async () => {
      try {
        setLoading(true);
        const data = await getBibles();
        setBibles(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch bibles:', err);
        setError(err.message || t('Failed to load bibles') || 'Failed to load bibles');
      } finally {
        setLoading(false);
      }
    };

    fetchBibles();
  }, []);

  const filteredBibles = Array.isArray(bibles) ? bibles.filter((bible) =>
    bible.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bible.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bible.language.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-4 p-4">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <CardTitle className="flex-row items-center gap-2">
                  <BookOpen size={20} color={primaryIconColor} />
                  <Text>{t('Bibles') || 'Bibles'}</Text>
                </CardTitle>
                <CardDescription>{t('Available Bible translations') || 'Available Bible translations'}</CardDescription>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center gap-2 rounded-lg border border-border bg-background px-3">
              <Search size={20} color={primaryIconColor} />
              <Input
                placeholder={t('Search bibles...') || 'Search bibles...'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 border-0"
              />
            </View>
          </CardContent>

          {/* Loading State */}
          {loading && (
            <View className="flex-1 items-center justify-center py-12">
              <ActivityIndicator size="large" />
              <Text className="mt-4 text-muted-foreground">{t('Loading bibles...') || 'Loading bibles...'}</Text>
            </View>
          )}

          {/* Error State */}
          {error && !loading && (
            <CardContent>
              <View className="rounded-lg border border-destructive bg-destructive/10 p-4">
                <Text className="text-destructive text-center">
                  {error}
                </Text>
                <Text className="text-muted-foreground text-center text-sm mt-2">
                  {t('Showing cached data') || 'Showing cached data'}
                </Text>
              </View>
            </CardContent>
          )}

          {/* Bible List */}
          {!loading && (
            <View className="gap-2 mx-2">
              {filteredBibles.length > 0 ? (
                filteredBibles.map((bible) => (
                  <Link key={bible.id} href={`/bibles/${bible.id}`} asChild>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Card className="overflow-hidden">
                        <View className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 active:opacity-100" />
                        <CardContent className="gap-2 py-1">
                          <View className="flex-row items-start justify-between">
                            <View className="flex-1 gap-1">
                              <Text className="text-lg font-semibold">
                                {bible.name}
                              </Text>
                            </View>
                            <View className="rounded-full bg-primary/10 px-3 py-1">
                              <Text className="text-xs font-semibold text-primary">
                                {bible.abbreviation}
                              </Text>
                            </View>
                          </View>
                          <View className="flex-row gap-4">
                            <Text className="text-xs text-muted-foreground">
                              {bible.language} . v{bible.version}
                            </Text>
                          </View>
                        </CardContent>
                      </Card>
                    </TouchableOpacity>
                  </Link>
                ))
              ) : (
                <Card>
                  <CardContent className="items-center justify-center py-12">
                    <Text className="text-muted-foreground">{t('No bibles found') || 'No bibles found'}</Text>
                  </CardContent>
                </Card>
              )}
            </View>
          )}
        </Card>
      </View>
    </ScrollView>
  );
}
