import { authService } from './AuthService';

interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  isSystem?: boolean;
  isDefault?: boolean;
}

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  pan?: string;
  adhar?: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'separated';
  dateOfBirth: string;
  dateOfMarriage?: string;
  kul?: string;
  gotra?: string;
  fatherName?: string;
  motherName?: string;
  childrenName?: string;
  role: string | Role; // Can be role name (string) or populated role object
  roleId?: string;
  verified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  // Virtual fields
  fullName?: string;
  displayName?: string;
  // New fields
  fatherDetails?: {
    fatherName?: string;
    relationshipType?: string;
    isAlive?: boolean;
  };
  motherDetails?: {
    motherName?: string;
    relationshipType?: string;
    isAlive?: boolean;
  };
  marriages?: Array<{
    spouseName?: string;
    spouseId?: string;
    marriageDate?: string;
    marriageType?: string;
    marriagePlace?: {
      city?: string;
      state?: string;
      country?: string;
    };
  }>;
  children?: Array<{
    name?: string;
    dateOfBirth?: string;
    gender?: string;
  }>;
}

interface UserStats {
  total: number;
  verified: number;
  unverified: number;
  admins: number;
  members: number;
  recent: number;
  byRole: Array<{
    roleName: string;
    count: number;
  }>;
}

interface SearchParams {
  query?: string;
  role?: string;
  verified?: boolean;
  limit?: number;
  page?: number;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  total?: number;
  pagination?: PaginationInfo;
}

class UserManagementService {
  private API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  private getAuthHeaders(): Record<string, string> {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle authentication errors
      if (response.status === 401) {
        authService.clearAuth();
        throw new Error('Session expired. Please login again.');
      }

      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<User[]>(response);
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<User>(response);
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  /**
   * Search users with filters and pagination
   */
  async searchUsers(params: SearchParams): Promise<ApiResponse<User[]>> {
    try {
      const queryParams = new URLSearchParams();

      if (params.query) queryParams.append('search', params.query);
      if (params.role) queryParams.append('role', params.role);
      if (params.verified !== undefined) queryParams.append('isVerified', params.verified.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.page) queryParams.append('page', params.page.toString());

      const response = await fetch(`${this.API_BASE_URL}/community/users?${queryParams}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<User[]>(response);
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users/stats/overview`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<UserStats>(response);
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: string, roleId: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users/${userId}/role`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ roleId }),
      });

      return await this.handleResponse<User>(response);
    } catch (error) {
      console.error('Update user role error:', error);
      throw error;
    }
  }

  /**
   * Toggle user verification status
   */
  async toggleUserVerification(userId: string): Promise<ApiResponse<{ id: string; verified: boolean }>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users/${userId}/verification`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ id: string; verified: boolean }>(response);
    } catch (error) {
      console.error('Toggle user verification error:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users/${userId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<null>(response);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  /**
   * Export users to CSV
   */
  async exportUsers(): Promise<Blob> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/export`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Export users error:', error);
      throw error;
    }
  }

  /**
   * Get user activity (last login, etc.)
   */
  async getUserActivity(userId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/${userId}/activity`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<any>(response);
    } catch (error) {
      console.error('Get user activity error:', error);
      throw error;
    }
  }

  /**
   * Get all available roles
   */
  async getAllRoles(): Promise<ApiResponse<Role[]>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/roles`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<Role[]>(response);
    } catch (error) {
      console.error('Get all roles error:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(userId: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users/${userId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      return await this.handleResponse<User>(response);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  /**
   * Verify user
   */
  async verifyUser(userId: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/community/users/${userId}/verify`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<User>(response);
    } catch (error) {
      console.error('Verify user error:', error);
      throw error;
    }
  }
}

export const userManagementService = new UserManagementService();
export type { User, Role, UserStats, SearchParams, PaginationInfo, ApiResponse };
