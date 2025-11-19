/**
 * Scripture Parser Utility
 * 
 * Parses paragraph text to identify and extract scripture references:
 * - Single quotes: 'Romans 3:23' -> HoverCard
 * - Triple quotes: '''Romans 3:23''' -> Inline Card
 */

export interface ParsedReference {
  type: 'single' | 'triple';
  reference: string;
  book: string;
  chapter: string;
  verse: string;
  startIndex: number;
  endIndex: number;
}

export interface ParsedText {
  type: 'text' | 'reference';
  content: string;
  reference?: ParsedReference;
}

/**
 * Parse a scripture reference string (e.g., "Romans 3:23", "John 3:16", "1 John 2:15")
 * Returns { book, chapter, verse } or null if invalid
 */
export function parseScriptureReference(ref: string): { book: string; chapter: string; verse: string } | null {
  const raw = ref.trim();

  // Accept patterns like "Gen 1:1", "GEN 1:1", "1 John 2:15", with optional ranges/lists.
  const strict = raw.match(/^((?:\d{1,2}\s)?[A-Za-z]+(?:\s[A-Za-z]+)*\.?)[\s]+(\d+):(\d+(?:[-–]\d+)?(?:\s*,\s*\d+(?:[-–]\d+)?)*)$/i);
  if (strict) {
    try {
      console.log('[SCRIPTURE_PARSER] strict match for ref:', raw, '=>', strict);
    } catch {}
    return {
      book: strict[1].replace(/\.$/, '').trim(),
      chapter: strict[2],
      verse: strict[3].trim(),
    };
  }

  // Fallback: very permissive, e.g. "GEN 1:1" or abbreviations with extra suffix
  const generic = raw.match(/^([^:]+?)\s+(\d+):(\S.+)$/i);
  if (generic) {
    try {
      console.log('[SCRIPTURE_PARSER] generic match for ref:', raw, '=>', generic);
    } catch {}
    return {
      book: generic[1].replace(/\.$/, '').trim(),
      chapter: generic[2],
      verse: generic[3].trim(),
    };
  }

  return null;
}

/**
 * Extract all scripture references from paragraph text
 * Supports both single quotes ('Romans 3:23') and triple quotes ('''Romans 3:23''')
 */
export function extractReferences(text: string): ParsedReference[] {
  const references: ParsedReference[] = [];
  
  // First, find triple-quoted references (they take precedence)
  const tripleQuoteRegex = /'''([^']+?)'''/g;
  let match;
  
  while ((match = tripleQuoteRegex.exec(text)) !== null) {
    const reference = match[1].trim();
    const parsed = parseScriptureReference(reference);
    
    if (parsed) {
      try {
        console.log('[SCRIPTURE_PARSER] triple reference parsed:', reference, '=>', parsed);
      } catch {}
      references.push({
        type: 'triple',
        reference,
        book: parsed.book,
        chapter: parsed.chapter,
        verse: parsed.verse,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }
  
  // Then, find single-quoted references (avoid those within triple quotes)
  // Very permissive: anything between straight single quotes
  const singleQuoteRegex = /'([^']+?)'/g;
  
  while ((match = singleQuoteRegex.exec(text)) !== null) {
    // Check if this single quote is part of a triple quote
    const isPartOfTriple = references.some(
      ref => ref.type === 'triple' && 
             match.index >= ref.startIndex && 
             match.index < ref.endIndex
    );
    
    if (!isPartOfTriple) {
      const reference = match[1].trim();
      const parsed = parseScriptureReference(reference);
      
      if (parsed) {
        try {
          console.log('[SCRIPTURE_PARSER] single reference parsed:', reference, '=>', parsed);
        } catch {}
        references.push({
          type: 'single',
          reference,
          book: parsed.book,
          chapter: parsed.chapter,
          verse: parsed.verse,
          startIndex: match.index,
          endIndex: match.index + match[0].length,
        });
      }
    }
  }
  
  // Sort by start index
  return references.sort((a, b) => a.startIndex - b.startIndex);
}

/**
 * Split paragraph text into segments of plain text and references
 * This allows for easier rendering with React components
 */
export function parseTextWithReferences(text: string): ParsedText[] {
  const references = extractReferences(text);
  
  if (references.length === 0) {
    return [{ type: 'text', content: text }];
  }
  
  const segments: ParsedText[] = [];
  let currentIndex = 0;
  
  for (const ref of references) {
    // Add text before the reference
    if (ref.startIndex > currentIndex) {
      segments.push({
        type: 'text',
        content: text.substring(currentIndex, ref.startIndex),
      });
    }
    
    // Add the reference
    segments.push({
      type: 'reference',
      content: ref.reference,
      reference: ref,
    });
    
    currentIndex = ref.endIndex;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(currentIndex),
    });
  }
  
  return segments;
}
