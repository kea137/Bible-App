/**
 * Test file for scripture parser
 * Run with: npx ts-node src/lib/utils/__tests__/scripture-parser.test.ts
 */

import { parseScriptureReference, extractReferences, parseTextWithReferences } from '../scripture-parser';

console.log('Testing Scripture Parser...\n');

// Test 1: Parse scripture references
console.log('Test 1: Parse scripture references');
const testRefs = [
  'Romans 3:23',
  'John 3:16',
  '1 John 2:15',
  '2 Corinthians 5:17',
  'Invalid Reference',
  'Genesis 1:1-3',
];

testRefs.forEach(ref => {
  const result = parseScriptureReference(ref);
  console.log(`  "${ref}" ->`, result);
});

// Test 2: Extract references from text
console.log('\nTest 2: Extract references from text');
const sampleText = `The Gospel means "good news." It is the message that God loves us 'John 3:16' and sent His Son Jesus Christ to save us from our sins. Through faith in Jesus 'Romans 5:8', we can have eternal life and a relationship with God. '''Romans 3:23''' tells us all have sinned.`;

const extracted = extractReferences(sampleText);
console.log('  Found references:', extracted);

// Test 3: Parse text with references
console.log('\nTest 3: Parse text with references');
const segments = parseTextWithReferences(sampleText);
console.log('  Segments:');
segments.forEach((seg, i) => {
  console.log(`    ${i}: ${seg.type} - "${seg.content.substring(0, 50)}${seg.content.length > 50 ? '...' : ''}"`);
});

// Test 4: Edge cases
console.log('\nTest 4: Edge cases');
const edgeCases = [
  "No references here",
  "'Romans 3:23'",
  "'''John 3:16'''",
  "Mixed 'Romans 3:23' and '''John 3:16''' references",
  "Invalid 'Not A Reference' should be ignored",
];

edgeCases.forEach(text => {
  const refs = extractReferences(text);
  console.log(`  "${text}" -> ${refs.length} references found`);
});

console.log('\nAll tests completed!');
