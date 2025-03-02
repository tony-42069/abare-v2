import axios from 'axios';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types';
import { setAuth, clearAuth } from '../utils/auth';

// Types
interface UserResponse {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_admin: boolean;
}

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Auth service
const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
    return response.data;
  },

  // Register new user
  async register(data: RegisterData): Promise<User> {
    const response = await axios.post<User>(`${API_URL}/auth/register`, data);
    return response.data;
  },

  // Get current user profile
  async getProfile(token: string): Promise<User> {
    const response = await axios.get<User>(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Verify token is valid
  async verifyToken(token: string): Promise<boolean> {
    try {
      await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
};

export default authService;

// Login user
export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
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
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, userData);
  const { token, user } = response.data;
  
  // Store authentication data
  setAuth(token, user);
  
  return user;
};

// Logout user
export const logout = async (): Promise<void> => {
  try {
    await axios.post(`${API_URL}/auth/logout`);
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Clear authentication data regardless of API response
    clearAuth();
  }
};

// Get current user profile
export const getCurrentUserProfile = async (): Promise<User> => {
  const response = await axios.get<User>(`${API_URL}/auth/me`);
  return response.data;
}; 