/**
 * API Client
 * 
 * Axios client configured for Laravel Sanctum authentication.
 * Handles CSRF token management and cookie-based sessions.
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { API_BASE_URL, API_CONFIG, API_ENDPOINTS } from './config';
import { getAuthToken, removeAuthToken } from '../storage/auth-storage';
import { logger } from '../utils/logger';

class ApiClient {
  private client: AxiosInstance;
  private csrfTokenFetched: boolean = false;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_CONFIG.timeout,
      withCredentials: API_CONFIG.withCredentials,
      headers: API_CONFIG.headers,
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await getAuthToken();
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log API requests in development
        logger.debug(`[API] → ${(config.method || 'get').toUpperCase()} ${config.baseURL || ''}${config.url || ''}`);
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`[API] ← ${response.status} ${(response.config?.method || 'get').toUpperCase()} ${response.config?.url || ''}`);
        return response;
      },
      async (error: AxiosError) => {
        const status = error.response?.status;
        const method = (error.config?.method || 'get').toUpperCase();
        const url = error.config?.url || '';
        
        logger.warn(`[API] Error ${status ?? 'NETWORK'} ${method} ${url}`);
        
        // Only clear token for non-GET requests on 401/419
        if (error.response?.status === 401 || error.response?.status === 419) {
          if (method === 'GET') {
            logger.debug('[API] 401/419 on GET – keeping token to avoid unintended logout');
          } else {
            await removeAuthToken();
            this.csrfTokenFetched = false;
            logger.info('[API] Auth cleared due to 401/419 on non-GET request');
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch CSRF token from Laravel backend
   * Required before making any state-changing requests (POST, PUT, DELETE)
   */
  async fetchCsrfToken(): Promise<void> {
    if (this.csrfTokenFetched) {
      return;
    }

    try {
      await this.client.get(API_ENDPOINTS.csrf);
      this.csrfTokenFetched = true;
    } catch (error) {
      logger.error('[API] Failed to fetch CSRF token:', error);
      throw error;
    }
  }

  /**
   * Reset CSRF token state (useful after logout)
   */
  resetCsrfToken(): void {
    this.csrfTokenFetched = false;
  }

  /**
   * Get the axios instance for making requests
   */
  getInstance(): AxiosInstance {
    return this.client;
  }

  /**
   * Make a GET request
   */
  async get<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * Make a POST request (with CSRF token)
   */
  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const shouldFetchCsrf = Platform.OS === 'web' && API_CONFIG.withCredentials && url !== API_ENDPOINTS.login;
    if (shouldFetchCsrf) {
      await this.fetchCsrfToken();
    }
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a PUT request (with CSRF token)
   */
  async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const shouldFetchCsrf = Platform.OS === 'web' && API_CONFIG.withCredentials;
    if (shouldFetchCsrf) {
      await this.fetchCsrfToken();
    }
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request (with CSRF token)
   */
  async delete<T = any>(url: string, config?: any): Promise<T> {
    const shouldFetchCsrf = Platform.OS === 'web' && API_CONFIG.withCredentials;
    if (shouldFetchCsrf) {
      await this.fetchCsrfToken();
    }
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
