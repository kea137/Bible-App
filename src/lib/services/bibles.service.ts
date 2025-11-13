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
  name: string;
  abbreviation: string;
  description: string;
  language: string;
  version: string;
  books_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Book {
  id: number;
  bible_id: number;
  title: string;
  book_number: number;
  chapters_count: number;
  testament?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Verse {
  id: number;
  book_id: number;
  chapter_number: number;
  verse_number: number;
  text: string;
  created_at?: string;
  updated_at?: string;
}

export interface BibleDetail {
  bible: Bible;
  books: Book[];
}

export interface ChapterData {
  bible: Bible;
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
 * Get dashboard data
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await apiClient.get<DashboardData>(API_ENDPOINTS.dashboard);
    console.log('[DashboardService] Fetched dashboard data successfully');
    return response;
  } catch (error) {
    console.error('[DashboardService] Failed to fetch dashboard data:', error);
    throw parseApiError(error);
  }
};

/**
 * Get all bibles
 * Tries to fetch from API, falls back to local storage if offline
 */
export const getBibles = async (): Promise<Bible[]> => {
  // Try to get from local storage first
  const cachedBibles = BibleStorage.getBiblesList();
  
  try {
    const response = await apiClient.get<Bible[]>(API_ENDPOINTS.bibles);
    
    // Save to local storage for offline access
    BibleStorage.saveBiblesList(response);
    
    return response;
  } catch (error) {
    // If API fails, return cached data if available
    if (cachedBibles) {
      console.log('[BIBLES SERVICE] Using cached bibles (offline mode)');
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
    const response = await apiClient.get<BibleDetail>(`${API_ENDPOINTS.bibles}/${bibleId}`);
    
    // Save to local storage for offline access
    BibleStorage.saveBibleDetail(bibleId, response);
    
    return response;
  } catch (error) {
    // If API fails, return cached data if available
    if (cachedDetail) {
      console.log('[BIBLES SERVICE] Using cached bible detail (offline mode)');
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
  chapterNumber: number
): Promise<ChapterData> => {
  // Try to get from local storage first
  const cachedChapter = BibleStorage.getChapterData(bibleId, bookId, chapterNumber);
  
  try {
    const response = await apiClient.get<ChapterData>(
      `${API_ENDPOINTS.bibles}/${bibleId}/books/${bookId}/chapters/${chapterNumber}`
    );
    
    // Save to local storage for offline access
    BibleStorage.saveChapterData(bibleId, bookId, chapterNumber, response);
    
    return response;
  } catch (error) {
    // If API fails, return cached data if available
    if (cachedChapter) {
      console.log('[BIBLES SERVICE] Using cached chapter data (offline mode)');
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
