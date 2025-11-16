/**
 * Highlights Service
 * 
 * Service layer for verse highlights operations with Laravel backend
 */

import { AxiosError } from 'axios';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';



// Type definitions
export interface VerseWithReferences {
    verse: {
        id: number;
        text: string;
        chapter_id: number;
        book_id?: number;
        chapter_number: number;
        verse_number: number;
        bible: {
            id: number;
            name: string;
            version: string;
        };
        book: {
            id: number;
            title: string;
        };
        chapter: {
            id: number;
            chapter_number: number;
        };
    };
    references: References[];
    other_translations: Translations[];
}


export interface References {
    id: number;
    parsed: {
        book: string;
        chapter: string;
        verse: string;
    }
    reference: string;
    verse: {
        id: number;
        text: string;
    }
}

export interface Translations {
    bible: {
        id: number;
        name: string;
    };
    id: string;
    text: string;
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
 * Get verses with References for the current user
 */
export const getVerseWithReferences = async (VerseId: number): Promise<VerseWithReferences> => {
  try {
    const response = await apiClient.get<VerseWithReferences>(`${API_ENDPOINTS.VerseWithReferences}/${VerseId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};
