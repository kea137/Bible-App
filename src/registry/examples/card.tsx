import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { Button } from '@showcase/components/ui/button';
import { Text } from '@showcase/components/ui/text';
import * as React from 'react';

export function CardPreview() {
  return (
    <Card className="w-full max-w-sm native:max-w-md">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Text>Card Content</Text>
      </CardContent>
      <CardFooter>
        <Button>
          <Text>Footer button</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
