import { Alert, AlertDescription, AlertTitle } from '@showcase/components/ui/alert';
import * as React from 'react';
import { Terminal } from 'lucide-react-native';

export function AlertPreview() {
  return (
    <Alert icon={Terminal} className="w-full max-w-sm native:max-w-md">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  );
}
