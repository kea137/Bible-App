import { cn } from '@/lib/utils';
import { Button } from '@showcase/components/ui/button';
import { Icon } from '@showcase/components/ui/icon';
import { Input } from '@showcase/components/ui/input';
import { Text } from '@showcase/components/ui/text';
import { useScrollToTop } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { COMPONENTS } from '@showcase/lib/constants';
import { Link } from 'expo-router';
import { 
  ChevronRight, 
  BookOpen, 
  Library, 
  Share2, 
  PenTool, 
  Calendar, 
  SplitSquareHorizontal,
  LogIn,
  UserPlus,
  Home,
  LayoutDashboard,
  NotebookPen,
  Highlighter
} from 'lucide-react-native';
import { cssInterop, useColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform, View } from 'react-native';

cssInterop(FlashList, { className: 'style', contentContainerClassName: 'contentContainerStyle' });

const PAGES = [
  { name: 'Welcome', slug: 'welcome', icon: Home },
  { name: 'Login', slug: 'auth/login', icon: LogIn },
  { name: 'Register', slug: 'auth/register', icon: UserPlus },
  { name: 'Dashboard', slug: 'dashboard', icon: LayoutDashboard },
  { name: 'Bibles', slug: 'bibles', icon: BookOpen },
  { name: 'Lessons', slug: 'lessons', icon: Library },
  { name: 'Notes', slug: 'notes', icon: NotebookPen },
  { name: 'Highlights', slug: 'highlights', icon: Highlighter },
  { name: 'Share', slug: 'share', icon: Share2 },
  { name: 'Verse Study', slug: 'verse-study', icon: PenTool },
  { name: 'Reading Plan', slug: 'reading-plan', icon: Calendar },
  { name: 'Parallel Bibles', slug: 'parallel-bibles', icon: SplitSquareHorizontal },
];

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const [search, setSearch] = React.useState('');
  const [isAtTop, setIsAtTop] = React.useState(true);
  const isAtTopRef = React.useRef(true);
  const flashListRef = React.useRef(null);
  useScrollToTop(flashListRef);

  const data = !search
    ? PAGES
    : PAGES.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View
      className={cn(
        'web:p-4 mx-auto w-full my-20 max-w-lg flex-1',
        Platform.select({ android: cn('border-border/0 border-t', !isAtTop && 'border-border') })
      )}>
      <FlashList
        ref={flashListRef}
        data={data}
        onScroll={Platform.select({
          android: ({ nativeEvent }) => {
            const isScrollAtTop = nativeEvent.contentOffset.y <= 0;
            if (isScrollAtTop !== isAtTopRef.current) {
              isAtTopRef.current = isScrollAtTop;
              setIsAtTop(isScrollAtTop);
            }
          },
        })}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="px-4 pb-2"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={Platform.select({
          native: (
            <View className="pb-4">
              <Input
                placeholder="Search pages"
                clearButtonMode="always"
                onChangeText={setSearch}
                autoCorrect={false}
              />
            </View>
          ),
        })}
        renderItem={({ item, index }) => (
          <Link href={`/${item.slug}`} asChild>
            <Link.Trigger>
              <Button
                variant="outline"
                size="lg"
                unstable_pressDelay={100}
                className={cn(
                  'dark:bg-background border-border flex-row justify-between rounded-none border-b-0 pl-4 pr-3.5',
                  index === 0 && 'rounded-t-lg',
                  index === data.length - 1 && 'rounded-b-lg border-b'
                )}>
                <View className="flex-row items-center gap-3">
                  <Icon as={item.icon} className="text-primary size-5 stroke-[1.5px]" />
                  <Text className="text-base font-normal">{item.name}</Text>
                </View>

                <Icon as={ChevronRight} className="text-muted-foreground size-4 stroke-[1.5px]" />
              </Button>
            </Link.Trigger>
            <Link.Preview style={{ backgroundColor: colorScheme === 'dark' ? 'black' : 'white' }} />
          </Link>
        )}
        ListFooterComponent={<View className="android:pb-safe" />}
      />
    </View>
  );
}
