/**
 * Scripture Text Component
 * 
 * Renders paragraph text with inline scripture references:
 * - Single quotes: 'Romans 3:23' -> HoverCard on hover (inline)
 * - Triple quotes: '''Romans 3:23''' -> Inline Card (breaks text flow)
 */

import React from 'react';
import { View } from 'react-native';
import { Text } from '@showcase/components/ui/text';
import { Card, CardContent } from '@showcase/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@showcase/components/ui/hover-card';
import { parseTextWithReferences, ParsedText, ParsedReference } from '@/lib/utils/scripture-parser';
import { ScriptureReference } from '@/lib/services/lessons.service';
import { PortalHost } from '@rn-primitives/portal';
interface ScriptureTextProps {
  text: string;
  references?: ScriptureReference[];
  className?: string;
}

/**
 * Find the matching verse text from the references array
 */
function findVerseText(
  parsedRef: ParsedReference, 
  references?: ScriptureReference[]
): string | null {
  if (!references || references.length === 0) {
    return null;
  }
  
  // Try to find a matching reference
  const match = references.find(ref => {
    const bookMatches = ref.book_code.toLowerCase().replace(/\s+/g, '') === 
                       parsedRef.book.toLowerCase().replace(/\s+/g, '');
    const chapterMatches = String(ref.chapter) === String(parsedRef.chapter);
    const refVerseStr = String(ref.verse ?? '');
    const verseMatches = refVerseStr === parsedRef.verse || 
                        refVerseStr.startsWith(parsedRef.verse);
    
    return bookMatches && chapterMatches && verseMatches;
  });
  
  return match?.text || null;
}

/**
 * Render a single-quoted reference as a HoverCard (inline)
 */
function RenderSingleQuote({ 
  content, 
  verseText 
}: { 
  content: string; 
  verseText: string | null;
}) {
  if (!verseText) {
    // If no verse text found, just render as plain text with quotes
    return <Text className="text-primary font-medium">'{content}'</Text>;
  }
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Text className="text-primary font-medium underline decoration-dotted cursor-help">
          '{content}'
        </Text>
      </HoverCardTrigger>
      <HoverCardContent>
        <View className="gap-2">
          <Text className="text-sm font-semibold">{content}</Text>
          <Text className="text-sm italic">"{verseText}"</Text>
        </View>
      </HoverCardContent>
    </HoverCard>
  );
}

/**
 * Render a triple-quoted reference as an inline Card
 */
function RenderTripleQuote({ 
  content, 
  verseText 
}: { 
  content: string; 
  verseText: string | null;
}) {
  if (!verseText) {
    // If no verse text found, just render as plain text with quotes
    return <Text className="text-primary font-medium">'''{content}'''</Text>;
  }
  
  return (
    <Card className="my-2 border-primary/20 bg-primary/5">
      <CardContent className="py-3 px-4">
        <Text className="text-sm font-semibold text-primary mb-1">
          {content}
        </Text>
        <Text className="text-sm italic text-foreground">
          "{verseText}"
        </Text>
      </CardContent>
    </Card>
  );
}

/**
 * Group consecutive text segments for better rendering
 */
function groupSegments(segments: ParsedText[]): Array<{ type: 'text-block' | 'triple-card'; segments: ParsedText[] }> {
  const groups: Array<{ type: 'text-block' | 'triple-card'; segments: ParsedText[] }> = [];
  let currentTextBlock: ParsedText[] = [];
  
  for (const segment of segments) {
    if (segment.type === 'reference' && segment.reference?.type === 'triple') {
      // Flush any accumulated text
      if (currentTextBlock.length > 0) {
        groups.push({ type: 'text-block', segments: [...currentTextBlock] });
        currentTextBlock = [];
      }
      // Add triple quote as its own group
      groups.push({ type: 'triple-card', segments: [segment] });
    } else {
      // Accumulate text and single-quote references
      currentTextBlock.push(segment);
    }
  }
  
  // Flush remaining text
  if (currentTextBlock.length > 0) {
    groups.push({ type: 'text-block', segments: currentTextBlock });
  }
  
  return groups;
}

/**
 * Main component that renders paragraph text with inline scripture references
 */
export function ScriptureText({ text, references, className }: ScriptureTextProps) {
  const segments = parseTextWithReferences(text);
  const groups = groupSegments(segments);
  
  return (
    <View className={className}>
      {groups.map((group, groupIndex) => {
        if (group.type === 'triple-card') {
          const segment = group.segments[0];
          const verseText = segment.reference 
            ? findVerseText(segment.reference, references)
            : null;
          
          return (
            <RenderTripleQuote
              key={`group-${groupIndex}`}
              content={segment.content}
              verseText={verseText}
            />
          );
        }
        
        // Render text block with inline single-quote references
        return (
          <Text key={`group-${groupIndex}`} className="text-base leading-7 text-foreground">
            {group.segments.map((segment, segmentIndex) => {
              if (segment.type === 'text') {
                return <Text key={segmentIndex}>{segment.content}</Text>;
              }
              
              // Single-quote reference
              const verseText = segment.reference 
                ? findVerseText(segment.reference, references)
                : null;
              
              return (
                <RenderSingleQuote 
                  key={segmentIndex}
                  content={segment.content}
                  verseText={verseText}
                />
              );
            })}
          </Text>
        );
      })}
    </View>
  );
}
