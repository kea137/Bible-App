/**
 * Lessons Service
 * 
 * Service layer for lessons operations with Laravel backend
 */

import { AxiosError } from 'axios';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';

// Type definitions
export interface Lesson {
  id: number;
  title: string;
  description: string;
  language: string;
  order?: number;
  created_at: string;
  updated_at: string;
  series_id?: number;
  series?: {
    id: number;
    title: string;
    description?: string;
  };
}

export interface LessonParagraph {
  id: number;
  lesson_id: number;
  title: string;
  text: string;
  created_at?: string;
  updated_at?: string;
}

export interface LessonDetail {
  lesson: Lesson;
  paragraphs: LessonParagraph[];
  completed?: boolean;
  next_lesson?: {
    id: number;
    title: string;
  };
  previous_lesson?: {
    id: number;
    title: string;
  };
}

export interface LessonProgress {
  id: number;
  user_id: number;
  lesson_id: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MarkLessonProgressData {
  lesson_id: number;
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
 * Get all lessons
 */
export const getLessons = async (): Promise<Lesson[]> => {
  try {
    const response = await apiClient.get<{ data: Lesson[] }>(API_ENDPOINTS.lessons);
    // Handle both wrapped and unwrapped response formats
    const lessons = (response as any)?.data || response;
    return Array.isArray(lessons) ? lessons : [];
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get lesson detail with paragraphs
 */
export const getLessonDetail = async (lessonId: number): Promise<LessonDetail> => {
  try {
    const response = await apiClient.get<{ data: LessonDetail }>(`${API_ENDPOINTS.lessons}/${lessonId}`);
    // Handle both wrapped and unwrapped response formats
    return (response as any)?.data || response;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Mark lesson as complete/incomplete
 */
export const markLessonProgress = async (data: MarkLessonProgressData): Promise<LessonProgress> => {
  try {
    const response = await apiClient.post<LessonProgress>(API_ENDPOINTS.lessonProgress, data);
    return response;
  } catch (error) {
    throw parseApiError(error);
  }
};
