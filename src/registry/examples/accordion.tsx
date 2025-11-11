import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@showcase/components/ui/accordion';
import { Text } from '@showcase/components/ui/text';
import * as React from 'react';

export function AccordionPreview() {
  const [value, setValue] = React.useState<string | undefined>(undefined);

  return (
    <Accordion
      type="single"
      collapsible
      value={value}
      onValueChange={setValue}
      className="w-full max-w-sm native:max-w-md"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <Text>Is it accessible?</Text>
        </AccordionTrigger>
        <AccordionContent>
          <Text>Yes. It adheres to the WAI-ARIA design pattern.</Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          <Text>Is it styled?</Text>
        </AccordionTrigger>
        <AccordionContent>
          <Text>
            Yes. It comes with default styles that matches the other components&apos; aesthetic.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          <Text>Is it animated?</Text>
        </AccordionTrigger>
        <AccordionContent>
          <Text>Yes. It&apos;s animated by default, but you can disable it if you prefer.</Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
