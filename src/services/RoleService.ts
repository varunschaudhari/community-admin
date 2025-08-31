import { authService } from './AuthService';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
}

interface CreateRoleData {
  name: string;
  description: string;
  permissions: string[];
}

interface UpdateRoleData {
  name?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
}

class RoleService {
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
   * Get all roles
   */
  async getAllRoles(): Promise<{ success: boolean; data: Role[] }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/roles`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ success: boolean; data: Role[] }>(response);
    } catch (error) {
      console.error('Get all roles error:', error);
      throw error;
    }
  }

  /**
   * Get role by ID
   */
  async getRoleById(roleId: string): Promise<{ success: boolean; data: Role }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/roles/${roleId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ success: boolean; data: Role }>(response);
    } catch (error) {
      console.error('Get role by ID error:', error);
      throw error;
    }
  }

  /**
   * Create a new role
   */
  async createRole(roleData: CreateRoleData): Promise<{ success: boolean; data: Role }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/roles`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(roleData),
      });

      return await this.handleResponse<{ success: boolean; data: Role }>(response);
    } catch (error) {
      console.error('Create role error:', error);
      throw error;
    }
  }

  /**
   * Update role
   */
  async updateRole(roleId: string, roleData: UpdateRoleData): Promise<{ success: boolean; data: Role }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/roles/${roleId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(roleData),
      });

      return await this.handleResponse<{ success: boolean; data: Role }>(response);
    } catch (error) {
      console.error('Update role error:', error);
      throw error;
    }
  }

  /**
   * Delete role
   */
  async deleteRole(roleId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/roles/${roleId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ success: boolean; message: string }>(response);
    } catch (error) {
      console.error('Delete role error:', error);
      throw error;
    }
  }

  /**
   * Toggle role status (active/inactive)
   */
  async toggleRoleStatus(roleId: string, isActive: boolean): Promise<{ success: boolean; data: Role }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/roles/${roleId}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ isActive }),
      });

      return await this.handleResponse<{ success: boolean; data: Role }>(response);
    } catch (error) {
      console.error('Toggle role status error:', error);
      throw error;
    }
  }

  /**
   * Get role permissions
   */
  async getRolePermissions(roleId: string): Promise<{ success: boolean; data: string[] }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/roles/${roleId}/permissions`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ success: boolean; data: string[] }>(response);
    } catch (error) {
      console.error('Get role permissions error:', error);
      throw error;
    }
  }

  /**
   * Update role permissions
   */
  async updateRolePermissions(roleId: string, permissions: string[]): Promise<{ success: boolean; data: Role }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/roles/${roleId}/permissions`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ permissions }),
      });

      return await this.handleResponse<{ success: boolean; data: Role }>(response);
    } catch (error) {
      console.error('Update role permissions error:', error);
      throw error;
    }
  }

  /**
   * Get all available permissions
   */
  async getAvailablePermissions(): Promise<{ success: boolean; data: any[] }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/permissions`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ success: boolean; data: any[] }>(response);
    } catch (error) {
      console.error('Get available permissions error:', error);
      throw error;
    }
  }

  /**
   * Get roles statistics
   */
  async getRolesStats(): Promise<{ success: boolean; data: any }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/roles/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ success: boolean; data: any }>(response);
    } catch (error) {
      console.error('Get roles stats error:', error);
      throw error;
    }
  }

  /**
   * Search roles
   */
  async searchRoles(query: string): Promise<{ success: boolean; data: Role[] }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/roles/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ success: boolean; data: Role[] }>(response);
    } catch (error) {
      console.error('Search roles error:', error);
      throw error;
    }
  }

  /**
   * Get roles by member count
   */
  async getRolesByMemberCount(): Promise<{ success: boolean; data: Role[] }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/roles/by-member-count`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse<{ success: boolean; data: Role[] }>(response);
    } catch (error) {
      console.error('Get roles by member count error:', error);
      throw error;
    }
  }

  /**
   * Duplicate role
   */
  async duplicateRole(roleId: string, newName: string): Promise<{ success: boolean; data: Role }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/roles/${roleId}/duplicate`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ name: newName }),
      });

      return await this.handleResponse<{ success: boolean; data: Role }>(response);
    } catch (error) {
      console.error('Duplicate role error:', error);
      throw error;
    }
  }

  /**
   * Export roles
   */
  async exportRoles(format: 'csv' | 'json' = 'json'): Promise<Blob> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/roles/export?format=${format}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Export roles error:', error);
      throw error;
    }
  }

  /**
   * Import roles
   */
  async importRoles(file: File): Promise<{ success: boolean; data: { imported: number; failed: number } }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const authHeaders = this.getAuthHeaders();
      const response = await fetch(`${this.API_BASE_URL}/roles/import`, {
        method: 'POST',
        headers: {
          Authorization: (authHeaders as any).Authorization || '',
        },
        body: formData,
      });

      return await this.handleResponse<{ success: boolean; data: { imported: number; failed: number } }>(response);
    } catch (error) {
      console.error('Import roles error:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const roleService = new RoleService();
