import api from './api';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types';
import { setAuth, clearAuth } from '../utils/auth';

// API base URL
const AUTH_ENDPOINT = '/api/auth';

/**
 * Auth service for handling authentication operations
 */
const authService = {
  /**
   * Login user and get access token
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await api.post<AuthResponse>(`${AUTH_ENDPOINT}/login`, credentials);
    const token = response.data.access_token;
    
    // Get user profile with the token
    const user = await this.getProfile(token);
    
    // Store authentication data
    setAuth(token, user);
    
    return { user, token };
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    // Register the user
    await api.post<User>(`${AUTH_ENDPOINT}/register`, data);
    
    // Login after successful registration
    return this.login({ email: data.email, password: data.password });
  },

  /**
   * Get current user profile
   */
  async getProfile(token?: string): Promise<User> {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await api.get<User>(`${AUTH_ENDPOINT}/me`, { headers });
    return response.data;
  },

  /**
   * Verify token is valid
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      await api.get(`${AUTH_ENDPOINT}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Logout user
   */
  logout(): void {
    // Clear authentication data
    clearAuth();
  }
};

export default authService;
