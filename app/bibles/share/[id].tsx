import { Text } from '@showcase/components/ui/text';
import { Button } from '@showcase/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@showcase/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@showcase/components/ui/select';
import { Share2, Download, Palette, Type, Image as ImageIcon, BookMarked, Check } from 'lucide-react-native';
import { View, ScrollView, ActivityIndicator, Platform, Alert, Image } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getShareVerseData, ShareData } from '@/lib/services/share.service';
import { useColorScheme } from 'nativewind';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { PortalHost } from '@rn-primitives/portal';
import { Label } from '@showcase/components/ui/label';
import { Switch } from '@showcase/components/ui/switch';
import { LinearGradient } from 'expo-linear-gradient';

export default function ShareScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const viewShotRef = useRef<ViewShot>(null);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Customization states
  const [selectedFont, setSelectedFont] = useState('Georgia');
  const [selectedFontSize, setSelectedFontSize] = useState(48);
  const [isBoldText, setIsBoldText] = useState(false);
  const [backgroundType, setBackgroundType] = useState<'gradient' | 'image'>('gradient');
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [useCustomColors, setUseCustomColors] = useState(false);
  const [customColor1, setCustomColor1] = useState('#667eea');
  const [customColor2, setCustomColor2] = useState('#764ba2');
  const [customColor3, setCustomColor3] = useState('#f093fb');

  const primaryIconColor = colorScheme === 'dark' ? '#fafafa' : '#18181b';

  // Font options matching web app
  const fonts = [
    { value: 'monospace', label: 'Monospace (Clean)' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS' },
    { value: 'Tahoma', label: 'Tahoma' },
  ];

  // Font size options matching web app
  const fontSizeOptions = [
    { value: 32, label: 'Medium (32px)' },
    { value: 40, label: 'Large (40px)' },
    { value: 48, label: 'Extra Large (48px)' },
    { value: 56, label: 'Huge (56px)' },
    { value: 64, label: 'Massive (64px)' },
  ];

  // Beautiful background gradients matching web app
  const backgrounds = [
    { name: 'Divine Purple', colors: ['#3a2e5d', '#4b326e', '#2d1b3a'] },
    { name: 'Heavenly Blue', colors: ['#1a2a6c', '#1e3c72', '#2a5298'] },
    { name: 'Grace Pink', colors: ['#6a0572', '#ab2187', '#430a5d'] },
    { name: 'Soft Heaven', colors: ['#232526', '#414345', '#2c3e50'] },
    { name: 'Peaceful Dawn', colors: ['#3a6186', '#89253e', '#1f1c2c'] },
    { name: 'Serenity', colors: ['#232526', '#414345', '#434343'] },
    { name: 'Rose Garden', colors: ['#42275a', '#734b6d', '#2b5876'] },
    { name: 'Ocean Breeze', colors: ['#16222a', '#3a6073', '#1a2980'] },
    { name: 'Sunset Glory', colors: ['#2c3e50', '#fd746c', '#1a1a1a'] },
    { name: 'Cosmic Purple', colors: ['#41295a', '#2F0743', '#1e1e2f'] },
    { name: 'Sky Blue', colors: ['#232526', '#1a2980', '#283e51'] },
    { name: 'Coral Sunset', colors: ['#ff5858', '#6a0572', '#2c3e50'] },
    { name: 'Fresh Green', colors: ['#134E5E', '#71B280', '#0f2027'] },
    { name: 'Fiery Love', colors: ['#cb2d3e', '#ef473a', '#232526'] },
    { name: 'Royal Purple', colors: ['#4a00e0', '#8e2de2', '#2c3e50'] },
  ];

  const currentBackground = useCustomColors 
    ? { name: 'Custom', colors: [customColor1, customColor2, customColor3] }
    : backgrounds[currentBackgroundIndex];

  // Fetch verse data on mount
  useEffect(() => {
    const fetchVerseData = async () => {
      if (!id) {
        setError('No verse ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching verse data for ID:', Number(id));
        const data = await getShareVerseData(Number(id));
        setShareData(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch verse data:', err);
        setError(err.message || 'Failed to load verse data');
      } finally {
        setLoading(false);
      }
    };

    fetchVerseData();
  }, [id]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Share Verse',
    });
  }, []);

  const handleChangeBackground = () => {
    setCurrentBackgroundIndex((currentBackgroundIndex + 1) % backgrounds.length);
  };

  const handleChangeImage = () => {
    if (shareData?.backgroundImages && shareData.backgroundImages.length > 0) {
      setCurrentImageIndex((currentImageIndex + 1) % shareData.backgroundImages.length);
    }
  };

  const captureAndShare = async () => {
    if (!viewShotRef.current) {
      Alert.alert('Error', 'Image generation failed. Please try again.');
      return;
    }

    try {
      setIsGenerating(true);
      
      // Capture the view as image
      const uri = await viewShotRef.current.capture();
      
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        setIsGenerating(false);
        return;
      }

      // Share the image
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: shareData?.verseReference || 'Bible Verse',
      });
    } catch (error: any) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share image: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!viewShotRef.current) {
      Alert.alert('Error', 'Image generation failed. Please try again.');
      return;
    }

    try {
      setIsGenerating(true);
      
      // Capture the view as image
      const uri = await viewShotRef.current.capture();
      
      // For web platform, download directly
      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.download = `verse_${shareData?.verseReference?.replace(/[^a-z0-9]/gi, '_')}.png`;
        link.href = uri;
        link.click();
      } else {
        // For mobile, use sharing as download
        const isAvailable = await Sharing.isAvailableAsync();
        
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Download Image',
          });
        } else {
          Alert.alert('Info', 'Image saved. You can find it in your gallery.');
        }
      }
    } catch (error: any) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download image: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted-foreground">Loading verse...</Text>
      </View>
    );
  }

  if (error || !shareData) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-destructive mb-4 text-center">{error || 'Failed to load verse'}</Text>
        <Button onPress={() => router.back()}>
          <Text>Go Back</Text>
        </Button>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <PortalHost name="root" />
      <View className="flex-1 gap-4 p-4">{/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex-row items-center gap-2">
              <Share2 size={20} color={primaryIconColor} />
              <Text>Share Verse</Text>
            </CardTitle>
            <CardDescription>Create a beautiful verse image to share</CardDescription>
          </CardHeader>
          
          {/* Preview Card */}
          <View className="mx-4 my-4">
            <ViewShot
              ref={viewShotRef}
              options={{
                format: 'png',
                quality: 1.0,
                width: 1080,
                height: 1080,
              }}
            >
              <View 
                style={{
                  width: '100%',
                  aspectRatio: 1,
                  borderRadius: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Background - Gradient or Image */}
                {backgroundType === 'image' && shareData?.backgroundImages && shareData.backgroundImages.length > 0 ? (
                  <Image
                    source={{ uri: shareData.backgroundImages[currentImageIndex].url }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <LinearGradient
                    colors={currentBackground.colors as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  />
                )}
                
                {/* Content */}
                <View 
                  style={{ 
                    flex: 1, 
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 60,
                    paddingVertical: 80,
                  }}
                >
                  <View style={{ flex: 1, justifyContent: 'center', width: '100%', gap: 40 }}>
                    {/* Verse Text */}
                    <Text 
                      className="text-center text-white"
                      style={{
                        fontFamily: selectedFont,
                        fontSize: selectedFontSize, // Full size for actual image
                        fontWeight: isBoldText ? 'bold' : 'normal',
                        lineHeight: selectedFontSize * 1.4,
                        textShadowColor: 'rgba(0, 0, 0, 0.3)',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 4,
                      }}
                    >
                      {shareData.verseText}
                    </Text>
                    
                    {/* Reference with decorative line */}
                    <View style={{ alignItems: 'center', gap: 12 }}>
                      <Text 
                        className="text-center text-white"
                        style={{
                          fontFamily: selectedFont,
                          fontSize: selectedFontSize * 0.65,
                          fontWeight: 'bold',
                          letterSpacing: 1,
                          textShadowColor: 'rgba(0, 0, 0, 0.3)',
                          textShadowOffset: { width: 1, height: 1 },
                          textShadowRadius: 4,
                        }}
                      >
                        {shareData.verseReference}
                      </Text>
                      {/* Decorative line */}
                      <View 
                        style={{
                          width: 200,
                          height: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        }}
                      />
                    </View>
                  </View>
                  
                  {/* Logo/Icon in bottom right corner */}
                  <View 
                    style={{
                      position: 'absolute',
                      bottom: 30,
                      right: 30,
                      width: 60,
                      height: 60,
                      borderRadius: 15,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 6,
                      overflow: 'hidden',
                    }}
                  >
                    <Image 
                      source={require('@/assets/images/icon.png')}
                      style={{
                        width: 48,
                        height: 48,
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                </View>
              </View>
            </ViewShot>
          </View>

          {/* Background Selection */}
          <Card className="mx-4 my-4 rounded-lg border p-4">
            <View className="mb-3 flex flex-row items-center gap-2">
              <ImageIcon color={primaryIconColor} size={24}/>
              <Text className="font-semibold">Background Type</Text>
            </View>
            
            {/* Background Type Toggle */}
            <View className="mb-4 flex-row gap-2">
              <Button
                onPress={() => setBackgroundType('gradient')}
                variant={backgroundType === 'gradient' ? 'default' : 'outline'}
                className="flex-1"
              >
                <Palette size={16} color={backgroundType === 'gradient' ? '#fff' : primaryIconColor} />
                <Text className="ml-2">Gradient</Text>
              </Button>
              <Button
                onPress={() => setBackgroundType('image')}
                variant={backgroundType === 'image' ? 'default' : 'outline'}
                className="flex-1"
                disabled={!shareData?.backgroundImages || shareData.backgroundImages.length === 0}
              >
                <ImageIcon size={16} color={backgroundType === 'image' ? '#fff' : primaryIconColor} />
                <Text className="ml-2">Image</Text>
              </Button>
            </View>

            {backgroundType === 'gradient' ? (
              <>
                <Text className="mb-2 text-sm text-muted-foreground">
                  Current Style: <Text className="font-semibold">{currentBackground.name}</Text>
                </Text>
                
                <Button 
                  variant="outline" 
                  className="mt-2 w-full justify-center"
                  onPress={handleChangeBackground}
                  disabled={isGenerating || useCustomColors}
                >
                  <Text>Change Background Style</Text>
                </Button>

                {/* Custom Colors Toggle */}
                <View className="mt-4 flex-row items-center justify-between">
                  <Label>Use custom colors</Label>
                  <Switch
                    checked={useCustomColors}
                    onCheckedChange={setUseCustomColors}
                  />
                </View>
              </>
            ) : (
              <>
                {shareData?.backgroundImages && shareData.backgroundImages.length > 0 ? (
                  <>
                    <Text className="mb-2 text-sm text-muted-foreground">
                      Image by <Text className="font-semibold">{shareData.backgroundImages[currentImageIndex]?.photographer}</Text> on Pexels
                    </Text>
                    
                    <Button 
                      variant="outline" 
                      className="mt-2 w-full justify-center"
                      onPress={handleChangeImage}
                      disabled={isGenerating}
                    >
                      <Text>Change Image</Text>
                    </Button>
                  </>
                ) : (
                  <Text className="text-sm text-yellow-600 dark:text-yellow-400">
                    No background images available
                  </Text>
                )}
              </>
            )}
          </Card>

          {/* Text Style Selection */}
          <Card className="mx-4 my-4 rounded-lg border p-4">
            <View className="mb-3 flex-row items-center gap-2">
              <Type color={primaryIconColor} size={24}/>
              <Text className="font-semibold">Text Style</Text>
            </View>
            
            {/* Font Selection */}
            <View className="mb-4 gap-2">
              <Label className="text-sm">Font Family</Label>
              <Select
                value={{ value: selectedFont, label: fonts.find(f => f.value === selectedFont)?.label || '' }}
                onValueChange={(option) => {
                  if (option?.value) {
                    setSelectedFont(option.value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent portalHost="root">
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
            <View className="mb-4 gap-2">
              <Label className="text-sm">Font Size</Label>
              <Select
                value={{ value: selectedFontSize.toString(), label: fontSizeOptions.find(f => f.value === selectedFontSize)?.label || '' }}
                onValueChange={(option) => {
                  if (option?.value) {
                    setSelectedFontSize(parseInt(option.value, 10));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent portalHost="root">
                  <SelectGroup>
                    {fontSizeOptions.map((size) => (
                      <SelectItem key={size.value} value={size.value.toString()} label={size.label}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>

            {/* Bold Toggle */}
            <View className="flex-row items-center justify-between">
              <Label>Use bold text</Label>
              <Switch
                checked={isBoldText}
                onCheckedChange={setIsBoldText}
              />
            </View>
          </Card>
        </Card>

        {/* Action Buttons */}
        <View className="gap-3">
          <Button onPress={captureAndShare} disabled={isGenerating}>
            {isGenerating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Share2 size={16} color="#fff" />
                <Text className="ml-2">Share Image</Text>
              </>
            )}
          </Button>
          
          <Button variant="outline" onPress={downloadImage} disabled={isGenerating}>
            {isGenerating ? (
              <ActivityIndicator size="small" />
            ) : (
              <>
                <Download size={16} color={primaryIconColor} />
                <Text className="ml-2">Download Image</Text>
              </>
            )}
          </Button>

          <Button 
            variant="outline" 
            onPress={() => {
              if (shareData.bible && shareData.book && shareData.chapter) {
                router.push(`/bibles/${shareData.bible}?book=${shareData.book}&chapter=${shareData.chapter}`);
              } else {
                router.back();
              }
            }}
          >
            <BookMarked size={16} color={primaryIconColor} />
            <Text className="ml-2">Back to Bible</Text>
          </Button>
        </View>

        {/* Verse Details */}
        <Card>
          <CardHeader>
            <CardTitle>Verse Details</CardTitle>
          </CardHeader>
          <CardContent className="gap-2">
            <View>
              <Text className="font-semibold">Reference:</Text>
              <Text className="text-muted-foreground">{shareData.verseReference}</Text>
            </View>
            <View>
              <Text className="font-semibold">Text:</Text>
              <Text className="text-muted-foreground italic">{shareData.verseText}</Text>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
