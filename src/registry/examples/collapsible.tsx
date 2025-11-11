import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@showcase/components/ui/collapsible';
import { Button } from '@showcase/components/ui/button';
import { Text } from '@showcase/components/ui/text';
import * as React from 'react';
import { View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

export function CollapsiblePreview() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full max-w-sm native:max-w-md gap-2"
    >
      <View className="flex-row items-center justify-between gap-4">
        <Text className="text-sm font-semibold">@peduarte starred 3 repositories</Text>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronDown className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
      </View>
      <View className="bg-muted border-border rounded-md border px-4 py-3">
        <Text className="text-sm font-mono">@radix-ui/primitives</Text>
      </View>
      <CollapsibleContent className="gap-2">
        <View className="bg-muted border-border rounded-md border px-4 py-3">
          <Text className="text-sm font-mono">@radix-ui/colors</Text>
        </View>
        <View className="bg-muted border-border rounded-md border px-4 py-3">
          <Text className="text-sm font-mono">@stitches/react</Text>
        </View>
      </CollapsibleContent>
    </Collapsible>
  );
}
