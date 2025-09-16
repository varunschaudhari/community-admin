import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../services/ApiService';
import { authService } from '../services/AuthService';
import { systemAuthService } from '../services/SystemAuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
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
    try {
      // Check if it's a system user and use appropriate logout method
      if (user && user.userType === 'system') {
        systemAuthService.logout();
      } else {
        await authService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First, try to get user from localStorage
        const storedUser = authService.getUser();
        const hasToken = !!authService.getToken();
        const tokenExpiry = authService.getTokenExpiry();
        const timeUntilExpiry = authService.getTimeUntilExpiry();

        console.log('🔍 Auth Check - Stored User:', !!storedUser, 'Has Token:', hasToken);
        if (tokenExpiry) {
          console.log('⏰ Token expires at:', tokenExpiry.toLocaleString());
          console.log('⏰ Time until expiry:', Math.round(timeUntilExpiry / 60000), 'minutes');
        }

        // For system users, use different authentication logic
        if (storedUser && storedUser.userType === 'system') {
          // For system users, check if token is valid and not expired
          if (systemAuthService.isAuthenticated()) {
            setUser(storedUser);
            console.log('✅ System user loaded from localStorage:', storedUser.firstName, storedUser.lastName);
          } else {
            console.warn('⚠️ System user found but token expired or invalid - clearing storage');
            systemAuthService.logout();
            setUser(null);
          }
        } else if (storedUser && hasToken) {
          // For community users, use the full authentication check
          if (storedUser.userType !== 'system') {
            const isAuthenticated = authService.isAuthenticated();
            if (isAuthenticated) {
              setUser(storedUser);
              console.log('✅ Community user loaded from localStorage:', storedUser.firstName, storedUser.lastName);

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
            } else {
              console.warn('⚠️ Community user found but token expired - clearing storage');
              authService.clearAuth();
              setUser(null);
            }
          }
        } else if (storedUser && !hasToken) {
          // We have user data but no valid token - clear user data
          console.warn('⚠️ User data found but no valid token - clearing storage');
          if (storedUser.userType === 'system') {
            systemAuthService.logout();
          } else {
            authService.clearAuth();
          }
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
      let isExpired = false;
      
      if (user.userType === 'system') {
        // Check system user token expiry
        isExpired = systemAuthService.isTokenExpired();
        if (isExpired) {
          console.log('⏰ System token expired - clearing authentication');
          systemAuthService.logout();
          setUser(null);
          setError('Session expired. Please login again.');
        }
      } else {
        // Check community user token expiry
        isExpired = authService.isTokenExpired();
        if (isExpired) {
          console.log('⏰ Community token expired - clearing authentication');
          authService.clearAuth();
          setUser(null);
          setError('Session expired. Please login again.');
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);

    // Also check when the token is about to expire
    let timeout: NodeJS.Timeout | null = null;
    if (user.userType === 'system') {
      const timeUntilExpiry = systemAuthService.getTimeUntilExpiry();
      if (timeUntilExpiry > 0) {
        timeout = setTimeout(() => {
          checkTokenExpiry();
        }, timeUntilExpiry);
      }
    } else {
      const timeUntilExpiry = authService.getTimeUntilExpiry();
      if (timeUntilExpiry > 0) {
        timeout = setTimeout(() => {
          checkTokenExpiry();
        }, timeUntilExpiry);
      }
    }

    return () => {
      clearInterval(interval);
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    setUser,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
