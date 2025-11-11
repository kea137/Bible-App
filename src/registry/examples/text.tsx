import { Text, TextClassContext } from '@showcase/components/ui/text';
import * as React from 'react';
import { View } from 'react-native';

export function TextPreview() {
  return (
    <View className="gap-4">
      <Text>Default text</Text>
      <Text variant="large">Large text</Text>
      <Text variant="small">Small text</Text>
      <Text variant="muted">Muted text</Text>
    </View>
  );
}

export function TextTypographyPreview() {
  return (
    <View className="gap-6 max-w-2xl">
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="h4">Heading 4</Text>
      <Text variant="p">
        This is a paragraph of text. It demonstrates the paragraph variant with proper spacing and
        line height for comfortable reading.
      </Text>
      <Text variant="blockquote">
        "This is a blockquote. It's typically used for quotes or callouts that need visual
        distinction from regular text."
      </Text>
      <Text variant="lead">
        This is a lead text variant, typically used for introductory paragraphs or emphasized
        content.
      </Text>
      <Text variant="code">const example = 'inline code';</Text>
    </View>
  );
}

export function TextCascadePreview() {
  return (
    <TextClassContext.Provider value="text-lg font-semibold text-primary">
      <View className="gap-4">
        <Text>This text inherits the cascaded styles</Text>
        <Text className="text-sm">This text overrides some cascaded styles</Text>
        <View>
          <Text>Nested text also inherits the context</Text>
        </View>
      </View>
    </TextClassContext.Provider>
  );
}
