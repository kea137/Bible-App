import { Text } from '@showcase/components/ui/text';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { BookOpen, Link2, Share2, StickyNote} from 'lucide-react-native';
import { View, ScrollView, ActivityIndicator, TouchableOpacity, KeyboardAvoidingViewComponent } from 'react-native';
import { Button } from '@showcase/components/ui/button';
import { Link, useNavigation } from 'expo-router';
import { Input } from '@showcase/components/ui/input';
import { useColorScheme } from 'nativewind';
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
import * as React from 'react';
import { getVerseWithReferences, References, VerseWithReferences, Translations } from '@showcase/src/lib/services/study.service';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { createNote, CreateNoteData } from '@/lib/services/notes.service';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTranslation } from 'react-i18next';

export function NotesAlertDialog({
  verseRef,
  text,
  isOpen,
  onOpenChange,
  verseId,
  onSaveSuccess,
}: {
  verseRef: string;
  text: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  verseId: number;
  onSaveSuccess: () => void;
}) {
  const [notes, setNotes] = React.useState('');
  const [title, settitle] = React.useState(''); 
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();

  // Theme-aware icon color
  const primaryIconColor = colorScheme === 'dark' ? '#fafafa' : '#18181b';

  const handleSave = async () => {
    // Here you would save the note, then call onSaveSuccess
    try {
      const noteData: CreateNoteData = {
        title: title || undefined,
        content: notes,
        verse_id: verseId,
      };
      await createNote(noteData);
      settitle('');
      setNotes('');
      onSaveSuccess();
      console.log('Note saved successfully');
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {

    }

    onSaveSuccess();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant='outline'
          className='w-full justify-center'
          onPress={() => onOpenChange(true)}
        >
          <StickyNote className="mr-2 h-4 w-4" color={primaryIconColor} />
          <Text>{t('Put Notes on this Verse')}</Text>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent portalHost='root'>
        <KeyboardAwareScrollView>
        <AlertDialogHeader className="items-center justify-center">
          <AlertDialogTitle className="text-center">{t('Add Note to Verse')}</AlertDialogTitle>
          <AlertDialogDescription className="text-center mb-4">
            {verseRef}
          </AlertDialogDescription>
          <AlertDialogDescription>
            <View className="rounded-lg border bg-muted/50 p-3 items-center">
              <Text className="text-sm italic text-center">{`"${text}"`}</Text>
            </View>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <View className="gap-2">
            <Text className="text-sm font-medium">{t('Title (Optional)')}</Text>
            <Input
                placeholder={t('Enter a title for your note')}
                value={title}
                onChangeText={settitle}
            />
        </View>

        <View className="gap-2">
            <Text className="text-sm font-medium">{t('Notes')}</Text>
            <Textarea
                placeholder={t('Write your thoughts, insights and reflections...')}
                value={notes}
                onChangeText={setNotes}
                className="min-h-32"
            />
        </View>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>{t('Cancel')}</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={handleSave}>
            <Text>{t('Save Note')}</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
        </KeyboardAwareScrollView>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AlertSuccess({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent portalHost="root">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primary">{t('Success')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('Your note was saved successfully!')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>{t('OK')}</Text>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function VerseStudyScreen() {
  const { colorScheme } = useColorScheme();
  const { id } = useLocalSearchParams();
  const [ Loading, setLoading ] = useState(false);
  const [ verseData, setVerseData ] = useState<VerseWithReferences>();
  const [ error, setError ] = useState('');
  const [ references, setReferences] = useState<References[]>([]);
  const [translations, setTranslations] = useState<Translations[]>([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const verseRef = `${verseData?.verse.book.title} ${verseData?.verse.chapter.chapter_number}:${verseData?.verse.verse_number}`;
  const text = verseData?.verse.text || '';
  const verseId = verseData?.verse.id || 0;
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleNoteSaveSuccess = () => {
    setShowSuccessAlert(true);
  };

  // Theme-aware icon color
  const primaryIconColor = colorScheme === 'dark' ? '#fafafa' : '#18181b';

  useEffect(()=>{

    navigation.setOptions({
      headerTitle: t('Verse Study')
    })

    const fetchVerseWithReferences = async () =>{
      try {
        setLoading(true);
        const data = await getVerseWithReferences(Number(id));
        console.log(data);
        setVerseData(data);
        setReferences(data.references);
        setTranslations(data.other_translations);
        setError('');
      } catch (error: any) {
        console.error('Failed to fetch highlights:', error);
        setError(error.message || 'Failed to load highlights');
      } finally {
        setLoading(false);
      }
    }
    fetchVerseWithReferences();
  }, []);

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-4 p-4">

        {/* Loading State */}
        {Loading && (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-muted-foreground">{t('Loading...')}</Text>
          </View>
        )}

        {/* Error State */}
        {error && !Loading && (
          <Card className="border-destructive">
            <CardContent className="py-4">
              <Text className="text-destructive text-center">
                {error}
              </Text>
              <Text className="text-muted-foreground text-center text-sm mt-2">
                {t('Showing cached data')}
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        {!Loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <BookOpen size={20} color={primaryIconColor} />
              <View>
                <Text>
                  {verseData?.verse.book.title} {verseData?.verse.chapter.chapter_number}:{verseData?.verse.verse_number}
                </Text>
                <CardDescription>{verseData?.verse.bible.name}</CardDescription>
              </View>
            </CardTitle>

            <NotesAlertDialog verseRef={verseRef} text={text} isOpen={isNotesOpen} onOpenChange={setIsNotesOpen} verseId={verseId} onSaveSuccess={handleNoteSaveSuccess} />
            <AlertSuccess open={showSuccessAlert} onOpenChange={setShowSuccessAlert} />

            <Link href={`/bibles/share/${verseId}`} asChild>
              <Button
                variant='secondary'
                className='w-full justify-center'
              >
                <Share2 className="mr-2 h-4 w-4 text-primary" color={primaryIconColor}/>
                <Text>{t('Share Verse')}</Text>
              </Button>
            </Link>

            <View
              className="rounded-r border-l-4 py-2 pl-3 mt-4"
              style={{ borderLeftColor: '#e5e7eb', backgroundColor: 'rgba(107, 114, 128, 0.08)' }}
            >
              <Text className="mb-2 text-sm italic">
              "{verseData?.verse.text}"
              </Text>
            </View>
          </CardHeader>
        </Card>
        )}

        {/* Cross References */}
        {references.length > 0 && !Loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <Link2 size={20} className="text-primary" />
              <Text>{t('Cross References')}</Text>
            </CardTitle>
            <CardDescription>{t('Related verses')}</CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            <ScrollView showsHorizontalScrollIndicator={false} className=" h-80">
            {references.map((ref) => (
                <Link href={`/bibles/study/${ref.verse.id}`} asChild key={ref.id}>
                <TouchableOpacity className="gap-1 rounded-lg border border-border p-3 my-2">
                  <Text className="text-sm font-semibold text-primary">
                  {ref.reference}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                  {ref.verse.text}
                  </Text>
                </TouchableOpacity>
                </Link>
            ))}
            </ScrollView>
          </CardContent>
        </Card>
        )}

        {/* Other Translations */}
        {translations.length > 0 && !Loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <Link2 size={20} color={primaryIconColor} />
              <Text>{t('Other Translations')}</Text>
            </CardTitle>
            <CardDescription>{t('Same verse in different versions')}</CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            {translations.map((translation) => (
              <View key={translation.id} className="gap-1 rounded-lg border border-border p-3">
                <Text className="text-sm font-semibold text-primary">
                  {translation.bible.name}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {translation.text}
                </Text>
              </View>
            ))}
          </CardContent>
        </Card>
        )}

        {/* Return to Bible Button */}
        {!Loading && verseData && (
        <Link href={`/bibles/${verseData.verse.bible.id}?chapter_id=${verseData.verse.chapter_id}`} asChild>
          <Button
            variant='outline'
            className='w-full justify-center'
          >
            <BookOpen className="mr-2 h-4 w-4 text-primary" />
            <Text>{t('Return to Bible')}</Text>
          </Button>
        </Link>
        )}
      </View>
    </ScrollView>
  );
}
