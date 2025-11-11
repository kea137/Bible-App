import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalSearchParams } from 'expo-router';
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react-native';
import { View, ScrollView } from 'react-native';
import { useState } from 'react';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams();
  const [completed, setCompleted] = useState(false);
  
  // Mock lesson data
  const lesson = {
    id: Number(id),
    title: 'Introduction to the Gospel',
    description: 'Learn about the good news of Jesus Christ and salvation',
    language: 'English',
    paragraphs: [
      {
        id: 1,
        title: 'What is the Gospel?',
        text: 'The Gospel means "good news." It is the message that God loves us and sent His Son Jesus Christ to save us from our sins. Through faith in Jesus, we can have eternal life and a relationship with God.',
      },
      {
        id: 2,
        title: 'The Need for Salvation',
        text: 'All people have sinned and fall short of the glory of God (Romans 3:23). Sin separates us from God and leads to spiritual death. We cannot save ourselves through our own efforts or good works.',
      },
      {
        id: 3,
        title: 'God\'s Love and Grace',
        text: 'But God demonstrates His own love for us in this: While we were still sinners, Christ died for us (Romans 5:8). Jesus Christ, the Son of God, lived a perfect life, died on the cross for our sins, and rose again on the third day.',
      },
      {
        id: 4,
        title: 'Receiving Salvation',
        text: 'Salvation is a gift from God that we receive through faith in Jesus Christ. We must believe that Jesus is Lord, that He died for our sins and rose again, and confess Him as our Savior. This faith transforms our lives and gives us hope for eternity.',
      },
      {
        id: 5,
        title: 'Living as a Believer',
        text: 'Once we accept Christ, we are called to live for Him. This means reading the Bible, praying, fellowshipping with other believers, and sharing the Gospel with others. Our faith should be evident in how we live each day.',
      },
    ],
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-4 p-4">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <BookOpen size={20} className="text-primary" />
              <Text>{lesson.title}</Text>
            </CardTitle>
            <CardDescription>{lesson.description}</CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            <View className="flex-row gap-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled
                className="flex-1"
              >
                <ChevronLeft size={16} />
                <Text className="ml-1">Previous</Text>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled
                className="flex-1"
              >
                <Text className="mr-1">Next</Text>
                <ChevronRight size={16} />
              </Button>
            </View>

            <Button 
              variant={completed ? "default" : "outline"}
              onPress={() => setCompleted(!completed)}
            >
              <CheckCircle size={16} />
              <Text className="ml-2">
                {completed ? 'Completed' : 'Mark as Complete'}
              </Text>
            </Button>
          </CardContent>
        </Card>

        {/* Lesson Content */}
        <View className="gap-4">
          {lesson.paragraphs.map((paragraph) => (
            <Card key={paragraph.id}>
              <CardHeader>
                <CardTitle className="text-lg">{paragraph.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="text-base leading-7 text-foreground">
                  {paragraph.text}
                </Text>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* Footer Actions */}
        <Card>
          <CardContent className="gap-3 py-4">
            <Text className="text-center text-sm text-muted-foreground">
              Lesson {lesson.id} - {lesson.language}
            </Text>
            <Button 
              variant={completed ? "default" : "outline"}
              onPress={() => setCompleted(!completed)}
            >
              <CheckCircle size={16} />
              <Text className="ml-2">
                {completed ? 'Lesson Completed' : 'Mark as Complete'}
              </Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
