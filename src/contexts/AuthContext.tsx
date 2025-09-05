import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../services/ApiService';
import { authService } from '../services/AuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const clearError = () => setError(null);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(credentials);

      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.register(userData);

      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setError(null);
  };

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First, try to get user from localStorage
        const storedUser = authService.getUser();
        const hasToken = authService.isAuthenticated();
        const tokenExpiry = authService.getTokenExpiry();
        const timeUntilExpiry = authService.getTimeUntilExpiry();

        console.log('🔍 Auth Check - Stored User:', !!storedUser, 'Has Valid Token:', hasToken);
        if (tokenExpiry) {
          console.log('⏰ Token expires at:', tokenExpiry.toLocaleString());
          console.log('⏰ Time until expiry:', Math.round(timeUntilExpiry / 60000), 'minutes');
        }

        if (storedUser && hasToken) {
          // We have both user data and valid token, set the user immediately
          setUser(storedUser);
          console.log('✅ User loaded from localStorage:', storedUser.firstName, storedUser.lastName);

          // Try to validate token in background (don't block the UI)
          try {
            const response = await authService.validateToken();
            if (response.success) {
              setUser(response.data);
              console.log('✅ Token validated with backend');
            }
          } catch (validationError: unknown) {
            // Only clear storage if token is actually expired
            const errorMessage = validationError instanceof Error ? validationError.message : String(validationError);
            if (errorMessage.includes('Session expired')) {
              console.warn('⚠️ Token expired - clearing storage');
              authService.clearAuth();
              setUser(null);
            } else {
              console.warn('⚠️ Token validation failed, but keeping user logged in from localStorage');
            }
          }
        } else if (storedUser && !hasToken) {
          // We have user data but no valid token - clear user data
          console.warn('⚠️ User data found but no valid token - clearing storage');
          authService.clearAuth();
          setUser(null);
        } else if (!storedUser && hasToken) {
          // We have token but no user data - clear token
          console.warn('⚠️ Token found but no user data - clearing storage');
          authService.clearAuth();
          setUser(null);
        } else {
          // No user data and no token
          console.log('ℹ️ No authentication data found');
          setUser(null);
        }
      } catch (err) {
        console.error('❌ Auth check error:', err);
        // Don't clear storage on error, just set user to null
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Set up periodic token expiration check
  useEffect(() => {
    if (!user) return; // Only check if user is logged in

    const checkTokenExpiry = () => {
      if (authService.isTokenExpired()) {
        console.log('⏰ Token expired - clearing authentication');
        authService.clearAuth();
        setUser(null);
        setError('Session expired. Please login again.');
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);

    // Also check when the token is about to expire
    const timeUntilExpiry = authService.getTimeUntilExpiry();
    if (timeUntilExpiry > 0) {
      const timeout = setTimeout(() => {
        checkTokenExpiry();
      }, timeUntilExpiry);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    return () => clearInterval(interval);
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
