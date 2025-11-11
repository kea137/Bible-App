import { Tabs, TabsContent, TabsList, TabsTrigger } from '@showcase/components/ui/tabs';
import { Text } from '@showcase/components/ui/text';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@showcase/components/ui/card';
import { Button } from '@showcase/components/ui/button';
import * as React from 'react';

export function TabsPreview() {
  const [value, setValue] = React.useState('account');

  return (
    <Tabs value={value} onValueChange={setValue} className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">
          <Text>Account</Text>
        </TabsTrigger>
        <TabsTrigger value="password">
          <Text>Password</Text>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-4">
            <Text>Account content goes here</Text>
          </CardContent>
          <CardFooter>
            <Button>
              <Text>Save changes</Text>
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-4">
            <Text>Password content goes here</Text>
          </CardContent>
          <CardFooter>
            <Button>
              <Text>Save password</Text>
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
