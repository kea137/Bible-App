/**
 * Bible Storage
 * 
 * Utilities for persisting Bible data using react-native-mmkv for offline access
 */

import { MMKV } from 'react-native-mmkv';
import { Platform } from 'react-native';
import type { Bible, BibleDetail, ChapterData } from '../services/bibles.service';

// Initialize MMKV storage for bible data
const storage = new MMKV({
  id: 'bible-storage',
  // Only use encryption on native platforms; web doesn't support it
  ...(Platform.OS !== 'web' && { encryptionKey: 'bible-app-data-key' }),
});

// Storage keys
const STORAGE_KEYS = {
  BIBLES_LIST: 'bibles_list',
  BIBLE_DETAIL: 'bible_detail_',
  CHAPTER_DATA: 'chapter_data_',
  LAST_UPDATED: 'last_updated_',
} as const;

/**
 * Save list of bibles
 */
export const saveBiblesList = (bibles: Bible[]): void => {
  try {
    storage.set(STORAGE_KEYS.BIBLES_LIST, JSON.stringify(bibles));
    storage.set(`${STORAGE_KEYS.LAST_UPDATED}bibles_list`, Date.now());
  } catch (error) {
    console.error('[BIBLE STORAGE] Failed to save bibles list:', error);
  }
};

/**
 * Get list of bibles
 */
export const getBiblesList = (): Bible[] | null => {
  try {
    const data = storage.getString(STORAGE_KEYS.BIBLES_LIST);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('[BIBLE STORAGE] Failed to get bibles list:', error);
    return null;
  }
};

/**
 * Save bible detail (bible + books)
 */
export const saveBibleDetail = (bibleId: number, bibleDetail: BibleDetail): void => {
  try {
    const key = `${STORAGE_KEYS.BIBLE_DETAIL}${bibleId}`;
    storage.set(key, JSON.stringify(bibleDetail));
    storage.set(`${STORAGE_KEYS.LAST_UPDATED}bible_${bibleId}`, Date.now());
  } catch (error) {
    console.error('[BIBLE STORAGE] Failed to save bible detail:', error);
  }
};

/**
 * Get bible detail (bible + books)
 */
export const getBibleDetail = (bibleId: number): BibleDetail | null => {
  try {
    const key = `${STORAGE_KEYS.BIBLE_DETAIL}${bibleId}`;
    const data = storage.getString(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('[BIBLE STORAGE] Failed to get bible detail:', error);
    return null;
  }
};

/**
 * Save chapter data (verses)
 */
export const saveChapterData = (
  bibleId: number,
  bookId: number,
  chapterNumber: number,
  chapterData: ChapterData
): void => {
  try {
    const key = `${STORAGE_KEYS.CHAPTER_DATA}${bibleId}_${bookId}_${chapterNumber}`;
    storage.set(key, JSON.stringify(chapterData));
    storage.set(`${STORAGE_KEYS.LAST_UPDATED}chapter_${bibleId}_${bookId}_${chapterNumber}`, Date.now());
  } catch (error) {
    console.error('[BIBLE STORAGE] Failed to save chapter data:', error);
  }
};

/**
 * Get chapter data (verses)
 */
export const getChapterData = (
  bibleId: number,
  bookId: number,
  chapterNumber: number
): ChapterData | null => {
  try {
    const key = `${STORAGE_KEYS.CHAPTER_DATA}${bibleId}_${bookId}_${chapterNumber}`;
    const data = storage.getString(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('[BIBLE STORAGE] Failed to get chapter data:', error);
    return null;
  }
};

/**
 * Get last updated timestamp for a resource
 */
export const getLastUpdated = (resourceKey: string): number | null => {
  try {
    const timestamp = storage.getNumber(`${STORAGE_KEYS.LAST_UPDATED}${resourceKey}`);
    return timestamp || null;
  } catch (error) {
    console.error('[BIBLE STORAGE] Failed to get last updated:', error);
    return null;
  }
};

/**
 * Check if cached data is fresh (less than 24 hours old)
 */
export const isCacheFresh = (resourceKey: string, maxAgeHours: number = 24): boolean => {
  const lastUpdated = getLastUpdated(resourceKey);
  if (!lastUpdated) return false;
  
  const ageInHours = (Date.now() - lastUpdated) / (1000 * 60 * 60);
  return ageInHours < maxAgeHours;
};

/**
 * Clear all chapter data for a specific bible
 */
export const clearBibleChapters = (bibleId: number): void => {
  try {
    const allKeys = storage.getAllKeys();
    const chapterKeys = allKeys.filter(key => 
      key.startsWith(`${STORAGE_KEYS.CHAPTER_DATA}${bibleId}_`)
    );
    
    chapterKeys.forEach(key => {
      storage.delete(key);
    });
  } catch (error) {
    console.error('[BIBLE STORAGE] Failed to clear bible chapters:', error);
  }
};

/**
 * Clear all bible storage
 */
export const clearAllBibleStorage = (): void => {
  try {
    storage.clearAll();
  } catch (error) {
    console.error('[BIBLE STORAGE] Failed to clear all storage:', error);
  }
};

/**
 * Get storage statistics
 */
export const getStorageStats = (): {
  totalKeys: number;
  biblesCount: number;
  chaptersCount: number;
} => {
  try {
    const allKeys = storage.getAllKeys();
    const biblesCount = allKeys.filter(key => key.startsWith(STORAGE_KEYS.BIBLE_DETAIL)).length;
    const chaptersCount = allKeys.filter(key => key.startsWith(STORAGE_KEYS.CHAPTER_DATA)).length;
    
    return {
      totalKeys: allKeys.length,
      biblesCount,
      chaptersCount,
    };
  } catch (error) {
    console.error('[BIBLE STORAGE] Failed to get storage stats:', error);
    return { totalKeys: 0, biblesCount: 0, chaptersCount: 0 };
  }
};
