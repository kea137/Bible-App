import { Button } from '@showcase/components/ui/button';
import { Text } from '@showcase/components/ui/text';
import * as React from 'react';
import { Loader2, Mail } from 'lucide-react-native';
import { ActivityIndicator } from 'react-native';

export function ButtonPreview() {
  return (
    <Button>
      <Text>Button</Text>
    </Button>
  );
}

export function ButtonSecondaryPreview() {
  return (
    <Button variant="secondary">
      <Text>Secondary</Text>
    </Button>
  );
}

export function ButtonDestructivePreview() {
  return (
    <Button variant="destructive">
      <Text>Destructive</Text>
    </Button>
  );
}

export function ButtonOutlinePreview() {
  return (
    <Button variant="outline">
      <Text>Outline</Text>
    </Button>
  );
}

export function ButtonGhostPreview() {
  return (
    <Button variant="ghost">
      <Text>Ghost</Text>
    </Button>
  );
}

export function ButtonLinkPreview() {
  return (
    <Button variant="link">
      <Text>Link</Text>
    </Button>
  );
}

export function ButtonWithIconPreview() {
  return (
    <Button>
      <Mail className="size-4" />
      <Text>Login with Email</Text>
    </Button>
  );
}

export function ButtonIconPreview() {
  return (
    <Button variant="outline" size="icon">
      <Mail className="size-4" />
    </Button>
  );
}

export function ButtonLoadingPreview() {
  return (
    <Button disabled>
      <ActivityIndicator size="small" />
      <Text>Please wait</Text>
    </Button>
  );
}
