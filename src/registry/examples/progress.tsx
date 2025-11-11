import { Progress } from '@showcase/components/ui/progress';
import { Text } from '@showcase/components/ui/text';
import * as React from 'react';
import { View } from 'react-native';

export function ProgressPreview() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="w-full max-w-sm native:max-w-md gap-2">
      <Progress value={progress} className="w-full" />
      <Text className="text-sm text-muted-foreground">{progress}%</Text>
    </View>
  );
}
