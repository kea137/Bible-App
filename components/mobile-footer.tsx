import { Link, usePathname } from 'expo-router';
import { BookOpen, PencilRuler, Target, BookCopy, LayoutGrid, StickyNote } from 'lucide-react-native';
import { View, Platform, Pressable } from 'react-native';
import { Text } from '@showcase/components/ui/text';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FOOTER_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
  { name: 'Bibles', path: '/bibles', icon: BookOpen },
  { name: 'Parallel', path: '/parallel-bibles', icon: BookCopy },
  { name: 'Lessons', path: '/lessons', icon: PencilRuler },
  { name: 'Notes', path: '/notes', icon: StickyNote },
];

export function MobileFooter() {
  const pathname = usePathname();
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  // Don't show footer on authentication pages, welcome, or index
  const hideFooter = pathname.includes('/auth/') || 
                     pathname === '/welcome' ||
                     pathname === '/';

  console.log('MobileFooter render - pathname:', pathname, 'hideFooter:', hideFooter);

  if (hideFooter) {
    return null;
  }

  return (
    <View 
      className="bg-background border-t border-border"
      style={{ 
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
        paddingTop: 8,
      }}
    >
      <View className="flex-row items-center justify-around px-2">
        {FOOTER_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.path || 
                          (item.path !== '/' && pathname.startsWith(item.path));
          
          return (
            <Link key={item.path} href={item.path} asChild>
              <Pressable className="items-center justify-center p-2 flex-1">
                <View className="items-center gap-1">
                  <IconComponent
                    size={24}
                    color={isActive 
                      ? (colorScheme === 'dark' ? '#FFFFFF' : '#000000')
                      : (colorScheme === 'dark' ? '#A1A09A' : '#706f6c')
                    }
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  <Text 
                    className={`text-xs ${isActive 
                      ? 'text-foreground font-semibold' 
                      : 'text-muted-foreground'
                    }`}
                  >
                    {item.name}
                  </Text>
                </View>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}
