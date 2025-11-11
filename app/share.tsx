import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Share2, Download, Palette, Type, Image as ImageIcon } from 'lucide-react-native';
import { View, ScrollView } from 'react-native';
import { useState } from 'react';

export default function ShareScreen() {
  const [selectedFont, setSelectedFont] = useState('serif');
  const [selectedBackground, setSelectedBackground] = useState('gradient');
  const [fontSize, setFontSize] = useState('medium');

  // Mock verse data
  const verse = {
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    reference: 'John 3:16',
    bible: 'NIV',
  };

  const fonts = [
    { value: 'serif', label: 'Serif' },
    { value: 'sans', label: 'Sans Serif' },
    { value: 'mono', label: 'Monospace' },
  ];

  const backgrounds = [
    { value: 'gradient', label: 'Gradient' },
    { value: 'solid', label: 'Solid Color' },
    { value: 'image', label: 'Background Image' },
  ];

  const fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 gap-4 p-4">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <Share2 size={20} className="text-primary" />
              <Text>Share Verse</Text>
            </CardTitle>
            <CardDescription>Create a beautiful verse image to share</CardDescription>
          </CardHeader>
        </Card>

        {/* Preview Card */}
        <Card className="overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600">
          <CardContent className="items-center justify-center gap-4 py-12">
            <View className="gap-3 px-4">
              <Text className="text-center text-xl font-semibold leading-8 text-white">
                "{verse.text}"
              </Text>
              <Text className="text-center text-base font-medium text-white/90">
                {verse.reference} ({verse.bible})
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Customization Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <Palette size={20} className="text-primary" />
              <Text>Customize</Text>
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-4">
            {/* Font Selection */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Type size={16} className="text-muted-foreground" />
                <Text className="text-sm font-medium">Font</Text>
              </View>
              <Select
                value={{ value: selectedFont, label: fonts.find(f => f.value === selectedFont)?.label || '' }}
                onValueChange={(option) => option && setSelectedFont(option.value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {fonts.map((font) => (
                      <SelectItem key={font.value} value={font.value} label={font.label}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>

            {/* Font Size Selection */}
            <View className="gap-2">
              <Text className="text-sm font-medium">Font Size</Text>
              <Select
                value={{ value: fontSize, label: fontSizes.find(f => f.value === fontSize)?.label || '' }}
                onValueChange={(option) => option && setFontSize(option.value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {fontSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value} label={size.label}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>

            {/* Background Selection */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <ImageIcon size={16} className="text-muted-foreground" />
                <Text className="text-sm font-medium">Background</Text>
              </View>
              <Select
                value={{ value: selectedBackground, label: backgrounds.find(b => b.value === selectedBackground)?.label || '' }}
                onValueChange={(option) => option && setSelectedBackground(option.value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select background" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {backgrounds.map((bg) => (
                      <SelectItem key={bg.value} value={bg.value} label={bg.label}>
                        {bg.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <View className="gap-3">
          <Button>
            <Share2 size={16} />
            <Text className="ml-2">Share Image</Text>
          </Button>
          <Button variant="outline">
            <Download size={16} />
            <Text className="ml-2">Download Image</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
