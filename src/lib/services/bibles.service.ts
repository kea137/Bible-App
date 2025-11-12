/**
 * Bibles Service
 * 
 * Service layer for Bible operations with Laravel backend
 */

import { AxiosError } from 'axios';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';

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
 * Get all bibles
 */
export const getBibles = async (): Promise<Bible[]> => {
  try {
    const response = await apiClient.get<Bible[]>(API_ENDPOINTS.bibles);
    return response;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get bible details with books
 */
export const getBibleDetail = async (bibleId: number): Promise<BibleDetail> => {
  try {
    const response = await apiClient.get<BibleDetail>(`${API_ENDPOINTS.bibles}/${bibleId}`);
    return response;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get chapter data with verses
 */
export const getChapterData = async (
  bibleId: number,
  bookId: number,
  chapterNumber: number
): Promise<ChapterData> => {
  try {
    const response = await apiClient.get<ChapterData>(
      `${API_ENDPOINTS.bibles}/${bibleId}/books/${bookId}/chapters/${chapterNumber}`
    );
    return response;
  } catch (error) {
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
