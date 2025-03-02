import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Auth types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

interface JwtPayload {
  email: string;
  exp: number;
  sub?: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if token is still valid
  const isTokenValid = (token: string): boolean => {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch {
      return false;
    }
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && isTokenValid(storedToken)) {
      setToken(storedToken);
      fetchUserProfile(storedToken);
    } else {
      localStorage.removeItem('token');
      setIsLoading(false);
    }
  }, []);

  // Fetch user profile
  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user profile', err);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      await fetchUserProfile(access_token);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login failed', err);
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
      throw err;
    }
  };

  // Register function
  const register = async (email: string, password: string, fullName: string) => {
    setError(null);
    try {
      await axios.post('/api/auth/register', { email, password, full_name: fullName });
      await login(email, password);
    } catch (err: any) {
      console.error('Registration failed', err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  // Set up axios interceptor to include token in requests
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
          router.push('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 