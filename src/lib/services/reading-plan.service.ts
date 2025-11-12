/**
 * Reading Plan Service
 * 
 * Service layer for reading plan operations with Laravel backend
 */

import { AxiosError } from 'axios';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';

// Type definitions
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
 * Get reading plan for the current user
 */
export const getReadingPlan = async (): Promise<ReadingPlanWithProgress> => {
  try {
    const response = await apiClient.get<ReadingPlanWithProgress>(API_ENDPOINTS.readingPlan);
    return response;
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
