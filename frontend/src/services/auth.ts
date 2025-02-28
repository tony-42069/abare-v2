import api from './api';
import { AuthResponse, LoginCredentials, User } from '../types';
import { setAuth, clearAuth } from '../utils/auth';

// Login user
export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await api.post<AuthResponse>('/api/auth/login', credentials);
  const { token, user } = response.data;
  
  // Store authentication data
  setAuth(token, user);
  
  return user;
};

// Register user
export const register = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<User> => {
  const response = await api.post<AuthResponse>('/api/auth/register', userData);
  const { token, user } = response.data;
  
  // Store authentication data
  setAuth(token, user);
  
  return user;
};

// Logout user
export const logout = async (): Promise<void> => {
  try {
    await api.post('/api/auth/logout');
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Clear authentication data regardless of API response
    clearAuth();
  }
};

// Get current user profile
export const getCurrentUserProfile = async (): Promise<User> => {
  const response = await api.get<User>('/api/auth/me');
  return response.data;
}; 