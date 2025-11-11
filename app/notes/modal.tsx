import { View } from 'react-native';
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { Text } from '@showcase/components/ui/text';
import { Textarea } from '@showcase/components/ui/textarea';
import { Input } from '@showcase/components/ui/input';
import { Button } from '@showcase/components/ui/button';
import { Highlighter, Save } from 'lucide-react-native';

function NotesModal() {
  const [notes, setNotes] = React.useState('');
  const [tags, setTags] = React.useState('');

    return (
        <View>
            {/* Personal Notes */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex-row items-center gap-2">
                        <Highlighter size={20} className="text-primary" />
                        <Text>Personal Notes</Text>
                    </CardTitle>
                    <CardDescription>Add your thoughts and insights</CardDescription>
                </CardHeader>
                <CardContent className="gap-4">

                    <View className="gap-2">
                        <Text className="text-sm font-medium">Title (Optional)</Text>
                        <Input
                            placeholder="Add tags (comma separated)"
                            value={tags}
                            onChangeText={setTags}
                        />
                    </View>

                    <View className="gap-2">
                        <Text className="text-sm font-medium">Notes</Text>
                        <Textarea
                            placeholder="Write your thoughts about this verse..."
                            value={notes}
                            onChangeText={setNotes}
                            className="min-h-32"
                        />
                    </View>

                    <Button>
                        <Save size={16} />
                        <Text className="ml-2">Save Notes</Text>
                    </Button>
                </CardContent>
            </Card>
        </View>
    );
}

export default NotesModal;