import { User } from '../types';

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

// Set authentication data
export const setAuth = (token: string, user: User): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Clear authentication data
export const clearAuth = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}; 