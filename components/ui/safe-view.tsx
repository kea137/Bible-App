import { Platform, View, type ViewProps } from 'react-native';
import * as React from 'react';

/**
 * A View component that filters out web-only ARIA props on native platforms
 * to prevent "TypeError: expected dynamic type 'boolean', but had type 'string'" errors
 */
export function SafeView({ ...restProps }: ViewProps & React.RefAttributes<View>) {
  // Filter out web-only props on native
  const props = Platform.OS === 'web' ? restProps : Object.fromEntries(
    Object.entries(restProps).filter(([key]) => 
      !['aria-hidden', 'aria-label', 'aria-labelledby', 'aria-level', 'role'].includes(key)
    )
  );
  
  return <View {...props} />;
}
