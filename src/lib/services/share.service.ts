/**
 * Share Service
 * 
 * Service layer for share operations with Laravel backend
 */

import { AxiosError } from 'axios';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';

// Type definitions
export interface ShareVerseData {
  verse: {
    id: number;
    text: string;
    verse_number: number;
    book: {
      id: number;
      title: string;
    };
    chapter: {
      id: number;
      chapter_number: number;
    };
    bible: {
      id: number;
      name: string;
      abbreviation: string;
    };
  };
}

export interface ShareVerseResponse {
  success: boolean;
  data: ShareVerseData;
}

/**
 * Get verse data for sharing
 */
export async function getShareVerseData(verseId: number): Promise<ShareVerseData> {
  try {
    const response = await apiClient.get<ShareVerseResponse>(
      `${API_ENDPOINTS.VERSES}/${verseId}`
    );
    
    if (!response.data?.data) {
      throw new Error('Invalid response format from server');
    }

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error('Verse not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch verse data');
    }
    throw error;
  }
}
