# Scripture References - Usage Guide

## Overview
This feature allows lesson paragraphs to include inline scripture references that are displayed interactively to users.

## How to Use

### Single-Quoted References (HoverCard)
Use single quotes around a scripture reference to create a hoverable link:

```
'John 3:16'
```

**Example:**
```
The Gospel means "good news." It is the message that God loves us as shown in 'John 3:16' and sent His Son Jesus Christ to save us.
```

**Result:**
- The reference appears as underlined text in the paragraph
- When users hover over it (or tap on mobile), a card appears showing the verse text
- The text flow is not interrupted

### Triple-Quoted References (Inline Card)
Use triple quotes around a scripture reference to create an inline card:

```
'''Romans 3:23'''
```

**Example:**
```
All people have sinned and fall short of the glory of God. '''Romans 3:23''' teaches us this truth clearly.
```

**Result:**
- The reference is replaced with a card showing the verse text
- The card appears inline within the paragraph
- This breaks the text flow to emphasize the verse

## Supported Reference Formats
The parser supports standard scripture references:
- `Romans 3:23`
- `John 3:16`
- `1 John 2:15`
- `2 Corinthians 5:17`
- `Genesis 1:1-3` (verse ranges)

## How It Works

### Backend Requirements
The paragraph data should include:
1. `text`: The paragraph text with quoted references
2. `references`: Array of scripture reference objects with:
   - `book_code`: Book name (e.g., "Romans", "John")
   - `chapter`: Chapter number (e.g., "3")
   - `verse`: Verse number or range (e.g., "23", "16-17")
   - `text`: The actual verse text

### Example Data Structure
```json
{
  "id": 1,
  "title": "The Need for Salvation",
  "text": "All people have sinned. '''Romans 3:23''' teaches us this truth.",
  "references": [
    {
      "book_code": "Romans",
      "chapter": "3",
      "verse": "23",
      "text": "For all have sinned and fall short of the glory of God."
    }
  ]
}
```

### Frontend Processing
1. The `ScriptureText` component parses the paragraph text
2. It identifies quoted references using regex patterns
3. It matches them with the provided reference data
4. It renders them as HoverCards (single quotes) or Cards (triple quotes)

## Migration from Old Format
Previously, references were shown in parentheses like `(Romans 3:23)` with a separate section below the paragraph listing all verses.

To migrate:
1. Replace parentheses with quotes: `(Romans 3:23)` → `'Romans 3:23'`
2. Use triple quotes for emphasis: `'''Romans 3:23'''`
3. Ensure reference data is provided in the API response
4. The old "Scripture References" section is automatically hidden when using the new component

## Troubleshooting

### Reference Not Showing as HoverCard/Card
- Check that the reference format matches the supported patterns
- Verify that the reference data includes matching book_code, chapter, and verse
- Book names are matched case-insensitively with spaces removed

### Verse Text Not Appearing
- Ensure the `references` array includes the verse text
- Check that book_code, chapter, and verse match exactly
- If verse data is missing, the reference will display as plain text with quotes
