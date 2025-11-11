import { Platform, View } from 'react-native';
import Animated from 'react-native-reanimated';

/**
 * This component is used to wrap animated views that should only be animated on native.
 * @param props - The props for the animated view.
 * @returns The animated view if the platform is native, otherwise the children.
 * @example
 * <NativeOnlyAnimatedView entering={FadeIn} exiting={FadeOut}>
 *   <Text>I am only animated on native</Text>
 * </NativeOnlyAnimatedView>
 */
function NativeOnlyAnimatedView(
  props: React.ComponentProps<typeof Animated.View> & React.RefAttributes<Animated.View>
) {
  if (Platform.OS === 'web') {
    return <>{props.children as React.ReactNode}</>;
  }

  const { children, className, ...rest } = props as any;
  // Filter out web-only props to avoid passing them to native Animated.View
  const { role, ...cleaned } = rest;
  const cleanedWithoutAria = Object.fromEntries(
    Object.entries(cleaned).filter(([key]) => !key.startsWith('aria-') && !key.startsWith('data-'))
  ) as React.ComponentProps<typeof Animated.View>;

  return (
    <View className={className as string | undefined}>
      <Animated.View {...cleanedWithoutAria}>{children as React.ReactNode}</Animated.View>
    </View>
  );
}

export { NativeOnlyAnimatedView };
