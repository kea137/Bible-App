import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@showcase/components/ui/select';
import * as React from 'react';

export function SelectPreview() {
  const [value, setValue] = React.useState<{ value: string; label: string }>();

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem label="Apple" value="apple">
            Apple
          </SelectItem>
          <SelectItem label="Banana" value="banana">
            Banana
          </SelectItem>
          <SelectItem label="Blueberry" value="blueberry">
            Blueberry
          </SelectItem>
          <SelectItem label="Grapes" value="grapes">
            Grapes
          </SelectItem>
          <SelectItem label="Pineapple" value="pineapple">
            Pineapple
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function ScrollableSelectPreview() {
  const [value, setValue] = React.useState<{ value: string; label: string }>();

  const fruits = [
    'Apple', 'Apricot', 'Banana', 'Blackberry', 'Blueberry', 'Cherry', 
    'Cranberry', 'Dragonfruit', 'Fig', 'Grape', 'Grapefruit', 'Kiwi',
    'Lemon', 'Lime', 'Mango', 'Orange', 'Papaya', 'Peach', 'Pear',
    'Pineapple', 'Plum', 'Raspberry', 'Strawberry', 'Watermelon'
  ];

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {fruits.map((fruit) => (
            <SelectItem key={fruit} label={fruit} value={fruit.toLowerCase()}>
              {fruit}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
