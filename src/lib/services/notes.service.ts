/**
 * Notes Service
 * 
 * Service layer for verse notes operations with Laravel backend
 */

import { AxiosError } from 'axios';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';

// Type definitions
export interface Note {
  id: number;
  user_id: number;
  verse_id?: number;
  title?: string;
  content: string;
  verse?: {
    id: number;
    text: string;
    reference: string;
    book_title?: string;
    chapter_number: number;
    verse_number: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateNoteData {
  verse_id?: number;
  title?: string;
  content: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
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
 * Get all notes for the current user
 */
export const getNotes = async (): Promise<Note[]> => {
  try {
    const response = await apiClient.get<any>(API_ENDPOINTS.notes);
    const items = (response as any)?.data ?? response;
    return Array.isArray(items) ? items : [];
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get a specific note
 */
export const getNote = async (noteId: number): Promise<Note> => {
  try {
    const response = await apiClient.get<any>(`${API_ENDPOINTS.notes}/${noteId}`);
    return (response as any)?.data ?? response;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Create a new note
 */
export const createNote = async (data: CreateNoteData): Promise<Note> => {
  try {
    const response = await apiClient.post<any>(API_ENDPOINTS.notes, data);
    const note = (response as any)?.data ?? response;
    console.log(note);
    return note;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Update a note
 */
export const updateNote = async (noteId: number, data: UpdateNoteData): Promise<Note> => {
  try {
    const response = await apiClient.put<any>(`${API_ENDPOINTS.notes}/${noteId}`, data);
    return (response as any)?.data ?? response;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Delete a note
 */
export const deleteNote = async (noteId: number): Promise<void> => {
  try {
    await apiClient.delete(`${API_ENDPOINTS.notes}/${noteId}`);
  } catch (error) {
    throw parseApiError(error);
  }
};
