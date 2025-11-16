/**
 * Highlights Service
 * 
 * Service layer for verse highlights operations with Laravel backend
 */

import { AxiosError } from 'axios';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';

// Type definitions
export interface VerseHighlight {
  id: number;
  user_id: number;
  verse_id: number;
  color: string;
  note?: string;
  verse?: {
    id: number;
    text: string;
    reference: string;
    book_title?: string;
    chapter_number: number;
    verse_number: number;
  };
}

export interface CreateHighlightData {
  verse_id: number;
  color: string;
  note?: string;
}

export interface UpdateHighlightData {
  color?: string;
  note?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface VerseHighlightData {
  data: VerseHighlight[];
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
 * Get all highlighted verses for the current user
 */
export const getHighlightedVerses = async (): Promise<VerseHighlight[]> => {
  try {
    const response = await apiClient.get<{ data: VerseHighlight[] }>(API_ENDPOINTS.highlightedVerses);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Create a new verse highlight
 */
export const createHighlight = async (data: CreateHighlightData): Promise<VerseHighlight> => {
  try {
    const response = await apiClient.post<VerseHighlight>(API_ENDPOINTS.verseHighlights, data);
    return response;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Update a verse highlight
 */
export const updateHighlight = async (
  highlightId: number,
  data: UpdateHighlightData
): Promise<VerseHighlight> => {
  try {
    const response = await apiClient.put<VerseHighlight>(
      `${API_ENDPOINTS.verseHighlights}/${highlightId}`,
      data
    );
    return response;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Delete a verse highlight
 */
export const deleteHighlight = async (highlightId: number): Promise<void> => {
  try {
    await apiClient.delete(`${API_ENDPOINTS.verseHighlights}/${highlightId}`);
  } catch (error) {
    throw parseApiError(error);
  }
};
