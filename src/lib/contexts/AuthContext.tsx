/**
 * Auth Context
 * 
 * React context for managing authentication state across the app
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, LoginCredentials, RegisterCredentials, ForgotPasswordData } from '../services/auth.service';
import * as authService from '../services/auth.service';
import { getAuthToken, getUserData } from '../storage/auth-storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<{ message: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize auth state from storage
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getAuthToken();
        const storedUser = await getUserData();
        
        if (token && storedUser) {
          setUser(storedUser);
          
          // Optionally verify token by fetching user data from API
          // This ensures the token is still valid
          try {
            const freshUser = await authService.getUser();
            setUser(freshUser);
          } catch (error) {
            // Token is invalid, clear user state
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login handler
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {

      const response = await authService.login(credentials);

      setUser(response.user);

    } catch (error) {
      console.error('[AUTH CONTEXT] Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register handler
   */
  const register = async (credentials: RegisterCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.register(credentials);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout handler
   */
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Forgot password handler
   */
  const forgotPassword = async (data: ForgotPasswordData): Promise<{ message: string }> => {
    return await authService.forgotPassword(data);
  };

  /**
   * Refresh user data
   */
  const refreshUser = async (): Promise<void> => {
    try {
      const freshUser = await authService.getUser();
      setUser(freshUser);
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
