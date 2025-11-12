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
  text: string;
  reference: string;
  bible: string;
  book?: string;
  chapter?: number;
  verse_number?: number;
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
  text: string;
  reference: string;
  color: string;
  note?: string;
  created_at: string;
}

export interface DashboardData {
  verse_of_the_day: VerseOfTheDay;
  reading_stats: ReadingStats;
  last_reading: LastReading | null;
  recent_highlights: HighlightedVerse[];
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
    return response;
  } catch (error) {
    throw parseApiError(error);
  }
};
