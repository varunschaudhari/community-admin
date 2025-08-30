import { User, LoginCredentials, RegisterData, AuthResponse } from './ApiService';

class AuthService {
  private readonly API_BASE_URL = 'http://localhost:5000/api';
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'user';

  /**
   * Get authentication headers for API requests
   */
  private getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Handle API response and throw errors if needed
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        this.clearAuth();
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  }

  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await this.handleResponse<AuthResponse>(response);
      
      if (result.success && result.data) {
        this.setToken(result.data.token);
        this.setUser(result.data.user);
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await this.handleResponse<AuthResponse>(response);
      
      if (result.success && result.data) {
        this.setToken(result.data.token);
        this.setUser(result.data.user);
      }
      
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<{ success: boolean; data: User }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ success: boolean; data: User }>(response);
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Validate current token
   */
  async validateToken(): Promise<{ success: boolean; data: User }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/validate`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse<{ success: boolean; data: User }>(response);
      
      if (result.success) {
        this.setUser(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Token validation error:', error);
      this.clearAuth();
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      await fetch(`${this.API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      this.clearAuth();
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Set token in storage
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Get stored user data
   */
  getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Set user data in storage
   */
  setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear all authentication data
   */
  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Refresh user data from server
   */
  async refreshUserData(): Promise<User | null> {
    try {
      const response = await this.getProfile();
      if (response.success) {
        this.setUser(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Refresh user data error:', error);
      return null;
    }
  }

  /**
   * Health check for backend connectivity
   */
  async healthCheck(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('http://localhost:5000/health');
      return await this.handleResponse<{ success: boolean; message: string }>(response);
    } catch (error) {
      console.error('Health check error:', error);
      throw new Error('Backend service is not available');
    }
  }

  /**
   * Check if backend is available
   */
  async isBackendAvailable(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User>): Promise<{ success: boolean; data: User }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      const result = await this.handleResponse<{ success: boolean; data: User }>(response);
      
      if (result.success) {
        this.setUser(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      return await this.handleResponse<{ success: boolean; message: string }>(response);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      return await this.handleResponse<{ success: boolean; message: string }>(response);
    } catch (error) {
      console.error('Request password reset error:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      return await this.handleResponse<{ success: boolean; message: string }>(response);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const authService = new AuthService();
