import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { Input } from '@showcase/components/ui/input';
import { Link } from 'expo-router';
import { NotebookPen, Search, Plus } from 'lucide-react-native';
import { View, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
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
import * as React from 'react';
import { Textarea } from '@showcase/components/ui/textarea';
import { getNotes, Note, updateNote } from '@/lib/services/notes.service';

export function NoteDetailAlertDialog({ 
  note, 
  isOpen, 
  onOpenChange,
  onUpdate 
}: { 
  note: Note | null; 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}) {
  const [noteContent, setNoteContent] = React.useState('');
  const [noteTitle, setNoteTitle] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  // Update local state when note changes
  React.useEffect(() => {
    if (note) {
      setNoteContent(note.content);
      setNoteTitle(note.title || '');
      setIsEditing(false);
    }
  }, [note]);

  const handleSaveNote = async () => {
    if (!note || !noteContent.trim()) {
      console.warn('Note content is empty');
      return;
    }

    try {
      setSaving(true);
      await updateNote(note.id, {
        title: noteTitle || undefined,
        content: noteContent,
      });
      console.log('Note updated successfully');
      setIsEditing(false);
      setSaving(false);
      onUpdate?.();
      // Close dialog after a brief delay
      setTimeout(() => {
        onOpenChange(false);
      }, 100);
    } catch (error) {
      console.error('Failed to update note:', error);
      setSaving(false);
    }
  };

  if (!note) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <AlertDialogHeader className="items-center justify-center">
            <AlertDialogTitle className="text-center">Note Details</AlertDialogTitle>
            <AlertDialogDescription className="text-center mb-4">
              {note.verse?.reference || 'Note'}
            </AlertDialogDescription>
            {note.verse && (
              <AlertDialogDescription>
                <View className="rounded-lg border bg-muted/50 p-3 items-center">
                  <Text className="text-sm italic text-center">{note.verse.text}</Text>
                </View>
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>

          <View className="gap-2">
            <Text className="text-sm font-medium">Title (Optional)</Text>
            <Input
              placeholder="Enter a title for your note"
              value={noteTitle}
              onChangeText={setNoteTitle}
              editable={isEditing}
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium">Notes</Text>
            <Textarea
              placeholder="Write your thoughts, insights and reflections..."
              value={noteContent}
              onChangeText={setNoteContent}
              className="min-h-32"
              editable={isEditing}
            />
          </View>

          <AlertDialogFooter>
            {!isEditing ? (
              <>
                <AlertDialogCancel>
                  <Text>Close</Text>
                </AlertDialogCancel>
                <AlertDialogAction onPress={() => setIsEditing(true)}>
                  <Text>Edit</Text>
                </AlertDialogAction>
              </>
            ) : (
              <>
                <AlertDialogCancel onPress={() => {
                  setIsEditing(false);
                  setNoteContent(note.content);
                  setNoteTitle(note.title || '');
                }}>
                  <Text>Cancel</Text>
                </AlertDialogCancel>
                <AlertDialogAction onPress={handleSaveNote} disabled={saving}>
                  <Text>{saving ? 'Saving...' : 'Save'}</Text>
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </KeyboardAvoidingView>
      </AlertDialogContent>
    </AlertDialog>
  );
}


export default function NotesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await getNotes();
      setNotes(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch notes:', err);
      setError(err.message || 'Failed to load notes');
      // Use mock data as fallback
      setNotes([
        {
          id: 1,
          user_id: 1,
          verse_id: 1,
          title: 'Reflections on John 3:16',
          content: 'For God so loved the world that he gave his one and only Son...',
          verse: {
            id: 1,
            text: 'For God so loved the world...',
            reference: 'John 3:16',
            chapter_number: 3,
            verse_number: 16,
          },
          created_at: '2024-11-10',
          updated_at: '2024-11-10',
        },
        {
          id: 2,
          user_id: 1,
          verse_id: 2,
          title: 'Prayer Points from Psalms',
          content: 'The Lord is my shepherd, I lack nothing...',
          verse: {
            id: 2,
            text: 'The Lord is my shepherd...',
            reference: 'Psalm 23:1-6',
            chapter_number: 23,
            verse_number: 1,
          },
          created_at: '2024-11-09',
          updated_at: '2024-11-09',
        },
        {
          id: 3,
          user_id: 1,
          title: 'Faith and Works',
          content: 'Faith without works is dead...',
          verse: {
            id: 3,
            text: 'Faith without works is dead...',
            reference: 'James 2:14-26',
            chapter_number: 2,
            verse_number: 14,
          },
          created_at: '2024-11-08',
          updated_at: '2024-11-08',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setIsDetailDialogOpen(true);
  };

  const handleNoteUpdate = () => {
    // Refresh notes list after update
    fetchNotes();
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.verse?.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-6 p-4">
        {/* Header */}
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-3xl font-bold">My Notes</Text>
              <Text className="text-base text-muted-foreground">
                Personal reflections and study notes
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center gap-2 rounded-lg border border-border bg-card px-3">
          <Search size={20} className="text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 border-0"
          />
        </View>

        {/* Loading State */}
        {loading && (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-muted-foreground">Loading notes...</Text>
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
                Showing cached data
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Notes List */}
        {!loading && filteredNotes.length > 0 ? (
          <View className="gap-4">
            {filteredNotes.map((note) => (
              <TouchableOpacity 
                key={note.id}
                activeOpacity={0.7}
                onPress={() => handleNoteClick(note)}
              >
                <Card>
                  <CardHeader>
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 gap-1">
                        <CardTitle className="flex-row items-center gap-2">
                          <NotebookPen size={18} className="text-primary" />
                          <Text className="flex-1">{note.title || 'Untitled Note'}</Text>
                        </CardTitle>
                        <CardDescription>
                          {note.verse?.reference} • {new Date(note.created_at).toLocaleDateString()}
                        </CardDescription>
                      </View>
                    </View>
                  </CardHeader>
                  <CardContent className="gap-3">
                    <Text className="text-base leading-6" numberOfLines={3}>
                      {note.content}
                    </Text>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        ) : !loading ? (
          <View className="flex-1 items-center justify-center py-12">
            <NotebookPen size={48} className="mb-4 text-muted-foreground" />
            <Text className="mb-2 text-lg font-semibold">No notes found</Text>
            <Text className="text-center text-sm text-muted-foreground">
              {searchQuery
                ? 'Try a different search term'
                : 'Start creating notes to remember your insights'}
            </Text>
          </View>
        ) : null}

        {/* Note Detail Dialog */}
        <NoteDetailAlertDialog
          note={selectedNote}
          isOpen={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          onUpdate={handleNoteUpdate}
        />

        {/* Quick Links */}
        <View className="gap-3">
          <Text className="text-lg font-semibold">Quick Actions</Text>
          <View className="flex-row gap-3">
            <Link href="/bibles" asChild className="flex-1">
              <Card className="flex-1">
                <CardContent className="items-center justify-center gap-2 py-4">
                  <Text className="text-center text-sm font-medium">Browse Bibles</Text>
                </CardContent>
              </Card>
            </Link>
            <Link href="/highlights" asChild className="flex-1">
              <Card className="flex-1">
                <CardContent className="items-center justify-center gap-2 py-4">
                  <Text className="text-center text-sm font-medium">View Highlights</Text>
                </CardContent>
              </Card>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

