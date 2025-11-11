/**
 * Patch React Native components to filter web-only ARIA props
 * This must be imported before any components are rendered
 */
import { View, Text, TextInput, Pressable, Platform } from 'react-native';

if (Platform.OS !== 'web') {
  const WEB_ONLY_PROPS = ['aria-hidden', 'aria-label', 'aria-labelledby', 'aria-level', 'role'];

  // Patch View
  const OriginalView = View;
  // @ts-ignore
  global.View = function PatchedView(props: any) {
    const filteredProps = { ...props };
    WEB_ONLY_PROPS.forEach(prop => {
      if (prop in filteredProps) {
        delete filteredProps[prop];
      }
    });
    return OriginalView(filteredProps);
  };

  // Patch Text
  const OriginalText = Text;
  // @ts-ignore
  global.Text = function PatchedText(props: any) {
    const filteredProps = { ...props };
    WEB_ONLY_PROPS.forEach(prop => {
      if (prop in filteredProps) {
        delete filteredProps[prop];
      }
    });
    return OriginalText(filteredProps);
  };

  // Patch TextInput
  const OriginalTextInput = TextInput;
  // @ts-ignore
  global.TextInput = function PatchedTextInput(props: any) {
    const filteredProps = { ...props };
    WEB_ONLY_PROPS.forEach(prop => {
      if (prop in filteredProps) {
        delete filteredProps[prop];
      }
    });
    return OriginalTextInput(filteredProps);
  };

  // Patch Pressable
  const OriginalPressable = Pressable;
  // @ts-ignore
  global.Pressable = function PatchedPressable(props: any) {
    const filteredProps = { ...props };
    WEB_ONLY_PROPS.forEach(prop => {
      if (prop in filteredProps) {
        delete filteredProps[prop];
      }
    });
    return OriginalPressable(filteredProps);
  };
}

export {};
