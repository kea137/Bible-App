/**
 * API Client
 * 
 * Axios client configured for Laravel Sanctum authentication.
 * Handles CSRF token management and cookie-based sessions.
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_CONFIG, API_ENDPOINTS } from './config';
import { getAuthToken, removeAuthToken } from '../storage/auth-storage';

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
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // If we get a 401 or 419 (CSRF token mismatch), clear the auth token
        if (error.response?.status === 401 || error.response?.status === 419) {
          await removeAuthToken();
          this.csrfTokenFetched = false;
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
      console.error('Failed to fetch CSRF token:', error);
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
    alert(JSON.stringify(data));
    await this.fetchCsrfToken();
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a PUT request (with CSRF token)
   */
  async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    await this.fetchCsrfToken();
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request (with CSRF token)
   */
  async delete<T = any>(url: string, config?: any): Promise<T> {
    await this.fetchCsrfToken();
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
