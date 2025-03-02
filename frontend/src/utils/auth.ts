import { User } from '../types';

/**
 * Set authentication data in localStorage
 */
export const setAuth = (token: string, user: User): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get authentication token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

/**
 * Get user data from localStorage
 */
export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('Error parsing user data from localStorage', error);
    return null;
  }
};

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const token = localStorage.getItem('token');
  return !!token;
};

// Get the current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return null;
  }
  
  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
}; 