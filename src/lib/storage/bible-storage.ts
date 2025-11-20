/**
 * Bible Storage
 * 
 * Utilities for persisting Bible data using AsyncStorage for offline access
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Bible, BibleDetail, ChapterData } from '../services/bibles.service';
import { logger } from '../utils/logger';

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
export const saveBiblesList = async (bibles: Bible[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BIBLES_LIST, JSON.stringify(bibles));
    await AsyncStorage.setItem(`${STORAGE_KEYS.LAST_UPDATED}bibles_list`, Date.now().toString());
  } catch (error) {
    logger.error('[BIBLE STORAGE] Failed to save bibles list');
  }
};

/**
 * Get list of bibles
 */
export const getBiblesList = async (): Promise<Bible[] | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.BIBLES_LIST);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('[BIBLE STORAGE] Failed to get bibles list');
    return null;
  }
};

/**
 * Save bible detail (bible + books)
 */
export const saveBibleDetail = async (bibleId: number, bibleDetail: BibleDetail): Promise<void> => {
  try {
    const key = `${STORAGE_KEYS.BIBLE_DETAIL}${bibleId}`;
    await AsyncStorage.setItem(key, JSON.stringify(bibleDetail));
    await AsyncStorage.setItem(`${STORAGE_KEYS.LAST_UPDATED}bible_${bibleId}`, Date.now().toString());
  } catch (error) {
    logger.error('[BIBLE STORAGE] Failed to save bible detail');
  }
};

/**
 * Get bible detail (bible + books)
 */
export const getBibleDetail = async (bibleId: number): Promise<BibleDetail | null> => {
  try {
    const key = `${STORAGE_KEYS.BIBLE_DETAIL}${bibleId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('[BIBLE STORAGE] Failed to get bible detail');
    return null;
  }
};

/**
 * Save chapter data (verses)
 */
export const saveChapterData = async (
  bibleId: number,
  bookId: number,
  chapterNumber: number,
  chapterData: ChapterData
): Promise<void> => {
  try {
    const key = `${STORAGE_KEYS.CHAPTER_DATA}${bibleId}_${bookId}_${chapterNumber}`;
    await AsyncStorage.setItem(key, JSON.stringify(chapterData));
    await AsyncStorage.setItem(
      `${STORAGE_KEYS.LAST_UPDATED}chapter_${bibleId}_${bookId}_${chapterNumber}`,
      Date.now().toString()
    );
  } catch (error) {
    logger.error('[BIBLE STORAGE] Failed to save chapter data');
  }
};

/**
 * Get chapter data (verses)
 */
export const getChapterData = async (
  bibleId: number,
  bookId: number,
  chapterNumber: number
): Promise<ChapterData | null> => {
  try {
    const key = `${STORAGE_KEYS.CHAPTER_DATA}${bibleId}_${bookId}_${chapterNumber}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('[BIBLE STORAGE] Failed to get chapter data');
    return null;
  }
};

/**
 * Get last updated timestamp for a resource
 */
export const getLastUpdated = async (resourceKey: string): Promise<number | null> => {
  try {
    const timestamp = await AsyncStorage.getItem(`${STORAGE_KEYS.LAST_UPDATED}${resourceKey}`);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    logger.error('[BIBLE STORAGE] Failed to get last updated');
    return null;
  }
};

/**
 * Check if cached data is fresh (less than 24 hours old)
 */
export const isCacheFresh = async (resourceKey: string, maxAgeHours: number = 24): Promise<boolean> => {
  const lastUpdated = await getLastUpdated(resourceKey);
  if (!lastUpdated) return false;
  
  const ageInHours = (Date.now() - lastUpdated) / (1000 * 60 * 60);
  return ageInHours < maxAgeHours;
};

/**
 * Clear all chapter data for a specific bible
 */
export const clearBibleChapters = async (bibleId: number): Promise<void> => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const chapterKeys = allKeys.filter(key => 
      key.startsWith(`${STORAGE_KEYS.CHAPTER_DATA}${bibleId}_`)
    );
    
    await AsyncStorage.multiRemove(chapterKeys);
  } catch (error) {
    logger.error('[BIBLE STORAGE] Failed to clear bible chapters');
  }
};

/**
 * Clear all bible storage
 */
export const clearAllBibleStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    logger.error('[BIBLE STORAGE] Failed to clear all storage');
  }
};

/**
 * Get storage statistics
 */
export const getStorageStats = async (): Promise<{
  totalKeys: number;
  biblesCount: number;
  chaptersCount: number;
}> => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const biblesCount = allKeys.filter(key => key.startsWith(STORAGE_KEYS.BIBLE_DETAIL)).length;
    const chaptersCount = allKeys.filter(key => key.startsWith(STORAGE_KEYS.CHAPTER_DATA)).length;
    
    return {
      totalKeys: allKeys.length,
      biblesCount,
      chaptersCount,
    };
  } catch (error) {
    logger.error('[BIBLE STORAGE] Failed to get storage stats');
    return { totalKeys: 0, biblesCount: 0, chaptersCount: 0 };
  }
};
