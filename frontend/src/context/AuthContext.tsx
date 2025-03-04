import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import jwtDecode from 'jwt-decode';
import { User } from '../types';
import authService from '../services/auth';
import { getToken, getUser } from '../utils/auth';

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
    const storedToken = getToken();
    const storedUser = getUser();
    
    if (storedToken && isTokenValid(storedToken)) {
      setToken(storedToken);
      setUser(storedUser);
      
      // Verify token with backend and refresh user data
      authService.verifyToken(storedToken)
        .then(isValid => {
          if (isValid) {
            authService.getProfile()
              .then(userData => {
                setUser(userData);
              })
              .catch(console.error)
              .finally(() => setIsLoading(false));
          } else {
            // Token is invalid
            authService.logout();
            setUser(null);
            setToken(null);
            setIsLoading(false);
          }
        })
        .catch(() => {
          // Error verifying token
          authService.logout();
          setUser(null);
          setToken(null);
          setIsLoading(false);
        });
    } else {
      // No token or invalid token
      authService.logout();
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const { user, token } = await authService.login({ email, password });
      setUser(user);
      setToken(token);
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
      const { user, token } = await authService.register({ 
        email, 
        password, 
        full_name: fullName 
      });
      setUser(user);
      setToken(token);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration failed', err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    router.push('/login');
  };

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
