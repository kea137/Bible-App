import { Text } from '@showcase/components/ui/text';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { 
  BookOpen, 
  Highlighter, 
} from 'lucide-react-native';
import { View, ScrollView } from 'react-native';

export default function DashboardScreen() {

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

        {/* Highlighted Verses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <Highlighter size={20} className="text-primary" />
              <Text>Your Highlighted Verses</Text>
            </CardTitle>
            <CardDescription>
              Recent verses you've marked
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            <View
              className="rounded-r border-l-4 py-2 pl-3"
              style={{ borderLeftColor: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.08)' }}
            >
              <Text className="mb-2 text-sm">
              Trust in the LORD with all your heart and lean not on your own understanding.
              </Text>
              <Text className="text-xs font-medium text-muted-foreground">
              Proverbs 3:5
              </Text>
              <Text className="mt-1 text-xs italic text-muted-foreground">
              Note: Remember to rely on God's wisdom, not my own
              </Text>
            </View>
            
            <View
              className="rounded-r border-l-4 py-2 pl-3"
              style={{ borderLeftColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.08)' }}
            >
              <Text className="mb-2 text-sm">
              I can do all things through Christ who strengthens me.
              </Text>
              <Text className="text-xs font-medium text-muted-foreground">
              Philippians 4:13
              </Text>
            </View>
            
            <View
              className="rounded-r border-l-4 py-2 pl-3"
              style={{ borderLeftColor: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.1)' }}
            >
              <Text className="mb-2 text-sm">
              The LORD is my shepherd, I lack nothing.
              </Text>
              <Text className="text-xs font-medium text-muted-foreground">
              Psalms 23:1
              </Text>
            </View>

          </CardContent>
        </Card>

      </View>
    </ScrollView>
  );
}
