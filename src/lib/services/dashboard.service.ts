/**
 * Dashboard Service
 * 
 * Service layer for dashboard operations with Laravel backend
 */

import { AxiosError } from 'axios';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';

// Type definitions
export interface VerseOfTheDay {
  id: number;
  text: string;
  verse_number: number;
  bible: {
    id: number;
    name: string;
  };
  book: {
    id: number;
    title: string;
  };
  chapter: {
    id: number;
    chapter_number: number;
  };
}

export interface ReadingStats {
  total_bibles: number;
  verses_read_today: number;
  chapters_completed: number;
}

export interface LastReading {
  bible_id: number;
  bible_name: string;
  book_id: number;
  book_title: string;
  chapter_number: number;
}

export interface HighlightedVerse {
  id: number;
  color: string;
  user_id: number;
  note?: string | null;
  verse_id: number;
  verse: {
    id: number;
    text: string;
    verse_number: number;
    bible_id: number;
    book_id: number;
    chapter_id: number;
    book: object; // Replace 'object' with a more specific type if available
    chapter: object; // Replace 'object' with a more specific type if available
  };
}

export interface DashboardData {
  userName?: string;
  verseOfTheDay: VerseOfTheDay;
  readingStats: ReadingStats;
  lastReading: LastReading | null;
  highlightedVerses: HighlightedVerse[];
}

export interface DashData {
  data: DashboardData;
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
export const getDashboardData = async (): Promise<DashData> => {
  try {
    const response = await apiClient.get<DashData>(API_ENDPOINTS.dashboard);
    return { data: response.data };
  } catch (error) {
    console.error('[DashboardService] Failed to fetch dashboard data:', error);
    throw parseApiError(error);
  }
};
