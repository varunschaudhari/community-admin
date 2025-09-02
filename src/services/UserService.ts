import { User } from './ApiService';
import { authService } from './AuthService';

class UserService {
  private readonly API_BASE_URL = 'http://localhost:5000/api';

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): HeadersInit {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        authService.clearAuth();
        throw new Error('Session expired. Please login again.');
      }

      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }



  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<{ success: boolean; data: User[] }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ success: boolean; data: User[] }>(response);
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<{ success: boolean; data: User }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ success: boolean; data: User }>(response);
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, userData: Partial<User>): Promise<{ success: boolean; data: User }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users/${userId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      return await this.handleResponse<{ success: boolean; data: User }>(response);
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users/${userId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ success: boolean; message: string }>(response);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  /**
   * Change user role (admin only)
   */
  async changeUserRole(userId: string, role: 'admin' | 'member'): Promise<{ success: boolean; data: User }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users/${userId}/role`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ role }),
      });

      return await this.handleResponse<{ success: boolean; data: User }>(response);
    } catch (error) {
      console.error('Change user role error:', error);
      throw error;
    }
  }

  /**
   * Verify user (admin only)
   */
  async verifyUser(userId: string): Promise<{ success: boolean; data: User }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users/${userId}/verify`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ success: boolean; data: User }>(response);
    } catch (error) {
      console.error('Verify user error:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{ success: boolean; data: any }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users/stats/overview`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ success: boolean; data: any }>(response);
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  }

  /**
   * Search users with filters
   */
  async searchUsersWithFilters(query: string): Promise<{ success: boolean; data: User[] }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ success: boolean; data: User[] }>(response);
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: 'admin' | 'member'): Promise<{ success: boolean; data: User[] }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users?role=${role}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ success: boolean; data: User[] }>(response);
    } catch (error) {
      console.error('Get users by role error:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: any): Promise<{ success: boolean; data: any }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users/create`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      return await this.handleResponse<{ success: boolean; data: any }>(response);
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  /**
   * Search users for autocomplete
   */
  async searchUsers(query: string, type: 'father' | 'mother' | 'children'): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users/search?q=${encodeURIComponent(query)}&type=${type}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse<{ success: boolean; data: any[] }>(response);
      return result.data || [];
    } catch (error) {
      console.error('Search users error:', error);
      // Return mock data for development
      return [
        { id: '1', name: 'John Doe', type },
        { id: '2', name: 'Jane Smith', type },
        { id: '3', name: 'Mike Johnson', type },
      ];
    }
  }
}

// Create singleton instance
export const userService = new UserService();
