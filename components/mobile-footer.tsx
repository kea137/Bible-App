import { Link, usePathname } from 'expo-router';
import { Home, BookOpen, NotebookPen, Highlighter, LayoutDashboard } from 'lucide-react-native';
import { View, Platform } from 'react-native';
import { Text } from '@showcase/components/ui/text';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FOOTER_ITEMS = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Bibles', path: '/bibles', icon: BookOpen },
  { name: 'Notes', path: '/notes', icon: NotebookPen },
  { name: 'Highlights', path: '/highlights', icon: Highlighter },
];

export function MobileFooter() {
  const pathname = usePathname();
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  // Don't show footer on certain pages
  const hideFooter = pathname.includes('/auth/') || 
                     pathname === '/welcome' || 
                     pathname.includes('/showcase');

  if (hideFooter) {
    return null;
  }

  return (
    <View 
      className="border-t border-border bg-card"
      style={{ paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8 }}
    >
      <View className="flex-row items-center justify-around px-2 py-2">
        {FOOTER_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.path || 
                          (item.path !== '/' && pathname.startsWith(item.path));
          
          return (
            <Link key={item.path} href={item.path} asChild>
              <View className="items-center justify-center p-2 flex-1">
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
              </View>
            </Link>
          );
        })}
      </View>
    </View>
  );
}
