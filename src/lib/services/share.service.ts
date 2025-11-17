/**
 * Share Service
 * 
 * Service layer for share operations with Laravel backend
 */

import { AxiosError } from 'axios';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';

// Type definitions matching the Laravel API response
export interface BackgroundImage {
  id: number;
  url: string;
  thumbnail: string;
  photographer: string;
  photographer_url: string;
  alt: string;
}

export interface ShareData {
  verseReference: string;
  verseText: string;
  verseId: number | null;
  backgroundImages: BackgroundImage[];
  bible: number | null;
  book: number | null;
  chapter: number | null;
}

export interface ShareResponse {
  success: boolean;
  data: ShareData;
}

/**
 * Get verse data for sharing
 * Uses the /api/mobile/share endpoint with verseId as query parameter
 */
export async function getShareVerseData(verseId: number): Promise<ShareData> {
  try {
    const response = await apiClient.get<ShareResponse>(
      API_ENDPOINTS.share,
      {
        params: {
          verseId: verseId
        }
      }
    );
    
    // if (!response.data || !response.data.data) {
    //   throw new Error('Invalid response format from server');
    // }

    return response.data;
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
