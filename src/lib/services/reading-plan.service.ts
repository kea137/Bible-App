/**
 * Reading Plan Service
 * 
 * Service layer for reading plan operations with Laravel backend
 */

import { AxiosError } from 'axios';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';

// Type definitions matching web app API
export interface Bible {
  id: number;
  name: string;
  language: string;
}

export interface Lesson {
  id: number;
  title: string;
  series_id?: number;
  episode_number?: number;
  series?: {
    id: number;
    title: string;
  };
}

export interface CompletedLesson {
  id: number;
  completed: boolean;
  completed_at: string;
  lesson: Lesson;
}

export interface ReadingPlanData {
  totalChapters: number;
  completedChapters: number;
  progressPercentage: number;
  chaptersReadToday: number;
  selectedBible: Bible;
  allBibles: Bible[];
  completedLessons?: CompletedLesson[];
  lessonsReadToday?: number;
}

export interface ReadingPlanResponse {
  success: boolean;
  data: ReadingPlanData;
}

// Legacy types for backward compatibility
export interface ReadingPlan {
  id: number;
  title: string;
  description: string;
  duration_days: number;
  current_day?: number;
  created_at: string;
  updated_at: string;
}

export interface DailyReading {
  day: number;
  date: string;
  readings: Reading[];
  completed: boolean;
}

export interface Reading {
  book: string;
  chapter: string;
  book_id?: number;
  chapter_number?: number;
}

export interface ReadingProgress {
  id: number;
  user_id: number;
  reading_plan_id: number;
  day: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReadingPlanWithProgress {
  plan: ReadingPlan;
  daily_readings: DailyReading[];
  progress: ReadingProgress[];
  completed_days: number;
}

export interface MarkProgressData {
  reading_plan_id: number;
  day: number;
  completed: boolean;
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
 * Get reading plan statistics for the current user
 */
export const getReadingPlan = async (bibleId?: number): Promise<ReadingPlanData> => {
  try {
    const url = bibleId 
      ? `${API_ENDPOINTS.readingPlan}?bible_id=${bibleId}`
      : API_ENDPOINTS.readingPlan;
    const response = await apiClient.get<ReadingPlanResponse>(url);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Legacy function for backward compatibility
 * This converts the new API response to the old format with mock data
 */
export const getReadingPlanLegacy = async (): Promise<ReadingPlanWithProgress> => {
  try {
    const data = await getReadingPlan();
    
    // Convert new format to legacy format with mock daily readings
    return {
      plan: {
        id: 1,
        title: 'Bible Reading Progress',
        description: `Track your progress through ${data.selectedBible.name}`,
        duration_days: data.totalChapters,
        current_day: data.completedChapters + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      daily_readings: [],
      progress: [],
      completed_days: data.completedChapters,
    };
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Mark a day as complete/incomplete
 */
export const markReadingProgress = async (data: MarkProgressData): Promise<ReadingProgress> => {
  try {
    const response = await apiClient.post<ReadingProgress>(API_ENDPOINTS.readingProgress, data);
    return response;
  } catch (error) {
    throw parseApiError(error);
  }
};
