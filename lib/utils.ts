import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Platform } from 'react-native';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Filters out web-only ARIA attributes that cause errors on native platforms.
 * These props can cause "expected dynamic type 'boolean', but had type 'string'" errors.
 */
export function filterWebProps<T extends Record<string, any>>(props: T): T {
  if (Platform.OS === 'web') {
    return props;
  }

  const filtered = { ...props };
  const webOnlyProps = ['aria-hidden', 'aria-label', 'aria-labelledby', 'aria-level', 'role'];
  
  for (const key of webOnlyProps) {
    if (key in filtered) {
      delete filtered[key];
    }
  }
  
  return filtered;
}
