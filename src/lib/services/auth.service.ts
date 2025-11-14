/**
 * Authentication Service
 * 
 * Service layer for authentication operations with Laravel Sanctum backend
 */

import { AxiosError } from 'axios';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';
import { setAuthToken, removeAuthToken, setUserData, removeUserData, clearAuthStorage, getAuthToken } from '../storage/auth-storage';

// Type definitions
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  message?: string;
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
 * Login user
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<any>(API_ENDPOINTS.login, credentials);
    console.log('[AUTH SERVICE] Login raw response:', response);

    // Adjust to your actual shape
    const payload = response.data ?? response; // if apiClient.post returns the whole body
    const user = payload.data?.user ?? payload.user;
    const token = payload.data?.token ?? payload.token;

    console.log('[AUTH SERVICE] Parsed user:', user);
    console.log('[AUTH SERVICE] Parsed token:', token);

    if (token) {
      await setAuthToken(token);
    }
    if (user) {
      await setUserData(user);
    }

    return { user, token };
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Register new user
 */
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<any>(API_ENDPOINTS.register, credentials);
    
    // Extract user and token from nested data structure
    const payload = response.data ?? response; // if apiClient.post returns the whole body
    const user = payload.data?.user ?? payload.user;
    const token = payload.data?.token ?? payload.token;
    
    // Store token if provided
    if (token) {
      await setAuthToken(token);
      console.log('[AUTH SERVICE] Confirm token persisted:', await getAuthToken());
    }
    
    // Store user data
    if (user) {
      await setUserData(user);
    }
    
    return { user, token };
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  console.log('[AUTH SERVICE] logout() called');
  try {
    await apiClient.post(API_ENDPOINTS.logout);
  } catch (error) {
    console.log('[AUTH SERVICE] logout() API failed:', error);
    // Continue with local logout even if API call fails
  } finally {
     console.log('[AUTH SERVICE] Clearing auth storage...');
    // Clear all auth data
    clearAuthStorage();
    apiClient.resetCsrfToken();
  }
};

/**
 * Send password reset link
 */
export const forgotPassword = async (data: ForgotPasswordData): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post<{ message: string }>(API_ENDPOINTS.forgotPassword, data);
    return response;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (data: ResetPasswordData): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post<{ message: string }>(API_ENDPOINTS.resetPassword, data);
    return response;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get authenticated user
 */
export const getUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>(API_ENDPOINTS.user);
    
    // Update stored user data
    setUserData(response);
    
    return response;
  } catch (error) {
    // If we can't get the user, clear auth data
    clearAuthStorage();
    throw parseApiError(error);
  }
};
