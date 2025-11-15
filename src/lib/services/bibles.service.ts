/**
 * Bibles Service
 * 
 * Service layer for Bible operations with Laravel backend
 * Includes offline storage support for reading without internet
 */

import { AxiosError } from 'axios';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';
import * as BibleStorage from '../storage/bible-storage';

// Type definitions
export interface Bible {
  id: number;
  abbreviation: string;
  description: string;
  language: string;
  name: string;
  version: string;
}
export interface BiblesData {
  data : Bible[];
}

export interface Book {
  id: number;
  bible_id: number;
  title: string;
  book_number: number;
  chapters_count: number;
  chapters: Chapter[];
}

export interface Chapter {
  id: number;
  book_id: number;
  chapter_number: number;
  verses: Verse[];
}

export interface Verse {
  id: number;
  book_id: number;
  chapter_number: number;
  verse_number: number;
  text: string;
}

export interface BibleDetail {
  bible: Bible;
  books: Book[];
  chapters: Chapter[];
  verses: Verse[];
  initialChapter?: {
    id: number;
    book_id: number;
    chapter_number: number;
    book: Book;
    verses: Verse[];
  };
}

export interface ChapterData {
  id?: number;
  bible?: Bible;
  book: Book;
  chapter_number: number;
  verses: Verse[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Parse API error response
 */
const parseApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    
    return {
      message: data?.message || error.message || 'An error occurred',
      errors: data?.errors,
    };
  }
  
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  };
};

/**
 * Get all bibles
 * Tries to fetch from API, falls back to local storage if offline
 */
export const getBibles = async (): Promise<Bible[]> => {
  // Try to get from local storage first
  const cachedBibles = BibleStorage.getBiblesList();
  
  try {
    const response = await apiClient.get<BiblesData>(API_ENDPOINTS.bibles);

    // Save to local storage for offline access
    BibleStorage.saveBiblesList(response.data);
    
    return response.data;
  } catch (error) {
    // If API fails, return cached data if available
    if (cachedBibles) {
      return cachedBibles;
    }
    
    throw parseApiError(error);
  }
};

/**
 * Get bible details with books
 * Tries to fetch from API, falls back to local storage if offline
 */
export const getBibleDetail = async (bibleId: number): Promise<BibleDetail> => {
  // Try to get from local storage first
  const cachedDetail = BibleStorage.getBibleDetail(bibleId);
  
  try {
    const response = await apiClient.get<any>(`${API_ENDPOINTS.bibles}/${bibleId}`);
    
    // The response structure is { bible: {..., books: [...]}, initialChapter: {...} }
    // We need to restructure it to match our BibleDetail interface
    const apiData = response.data.data || response.data;
    
    const bibleDetail: BibleDetail = {
      bible: apiData.bible,
      books: apiData.bible.books || [],
      chapters: apiData.chapters || [],
      verses: apiData.verses || [],
      initialChapter: apiData.initialChapter,
    };
     
    // Save to local storage for offline access
    BibleStorage.saveBibleDetail(bibleId, bibleDetail);
    
    return bibleDetail;
  } catch (error) {
    // If API fails, return cached data if available
    if (cachedDetail) {
      return cachedDetail;
    }
    
    throw parseApiError(error);
  }
};

/**
 * Get chapter data with verses
 * Tries to fetch from API, falls back to local storage if offline
 */
export const getChapterData = async (
  bibleId: number,
  bookId: number,
  chapterId: number
): Promise<ChapterData> => {
  // Try to get from local storage first
  const cachedChapter = BibleStorage.getChapterData(bibleId, bookId, chapterId);
  try {
    // API expects: /bibles/{bible}/books/{book}/chapters/{chapter}
    const response = await apiClient.get<any>(
      `${API_ENDPOINTS.bibles}/${bibleId}/books/${bookId}/chapters/${chapterId}`
    );

    // Check if response is wrapped with {data: ..., success: ...}
    const chapterData = response.data?.data || response.data;

    // Save to local storage for offline access
    BibleStorage.saveChapterData(bibleId, bookId, chapterId, chapterData);
    
    return chapterData;
  } catch (error) {
    // If API fails, return cached data if available
    if (cachedChapter) {
      return cachedChapter;
    }
    
    throw parseApiError(error);
  }
};

/**
 * Get parallel bible data (multiple translations for same passage)
 */
export const getParallelBibles = async (
  bibleIds: number[],
  bookId: number,
  chapterNumber: number
): Promise<ChapterData[]> => {
  try {
    const response = await apiClient.post<ChapterData[]>(
      API_ENDPOINTS.biblesParallel,
      { bible_ids: bibleIds, book_id: bookId, chapter_number: chapterNumber }
    );
    return response;
  } catch (error) {
    throw parseApiError(error);
  }
};
