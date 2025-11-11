/**
 * Safe wrappers for React Native components that filter out web-only ARIA props
 * to prevent "TypeError: expected dynamic type 'boolean', but had type 'string'" errors
 */
import { Platform, View as RNView, Text as RNText, type ViewProps, type TextProps } from 'react-native';
import * as React from 'react';

const WEB_ONLY_PROPS = ['aria-hidden', 'aria-label', 'aria-labelledby', 'aria-level', 'role'];

function filterWebProps<T extends Record<string, any>>(props: T): T {
  if (Platform.OS === 'web') {
    return props;
  }
  
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !WEB_ONLY_PROPS.includes(key))
  ) as T;
}

export function SafeView({ ...props }: ViewProps & React.RefAttributes<RNView>) {
  const filteredProps = filterWebProps(props);
  return <RNView {...filteredProps} />;
}

export function SafeText({ ...props }: TextProps & React.RefAttributes<RNText>) {
  const filteredProps = filterWebProps(props);
  return <RNText {...filteredProps} />;
}

export { filterWebProps };
