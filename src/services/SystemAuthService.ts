interface SystemUser {
  _id: string;
  username: string;
  email: string;
  employeeId: string;
  department: string;
  designation: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  systemRole: string;
  accessLevel: number;
  permissions: string[];
  verified: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface SystemLoginResponse {
  success: boolean;
  data: {
    user: SystemUser;
    token: string;
  };
  message: string;
}

interface SystemRegisterResponse {
  success: boolean;
  data: {
    user: SystemUser;
  };
  message: string;
}

class SystemAuthService {
  private baseUrl = 'http://localhost:5000/api/system';
  private tokenKey = 'systemAuthToken';
  private userKey = 'systemUser';

  // Login system user
  async login(username: string, password: string): Promise<SystemLoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem(this.tokenKey, data.data.token);
        localStorage.setItem(this.userKey, JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      console.error('System login error:', error);
      throw new Error('Failed to login. Please check your credentials.');
    }
  }

  // Register system user (admin only)
  async register(userData: any): Promise<SystemRegisterResponse> {
    try {
      const token = this.getToken();
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(userData),
      });

      return await response.json();
    } catch (error) {
      console.error('System registration error:', error);
      throw new Error('Failed to register system user.');
    }
  }

  // Get current system user
  getCurrentUser(): SystemUser | null {
    try {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current system user:', error);
      return null;
    }
  }

  // Get system auth token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Check if system user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Logout system user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Validate system token
  async validateToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await fetch(`${this.baseUrl}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  // Get system user profile
  async getProfile(): Promise<{ success: boolean; data: { user: SystemUser } }> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Change system user password
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      return await response.json();
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Get system user permissions
  async getPermissions(): Promise<{ success: boolean; data: { permissions: string[]; systemRole: string; accessLevel: number; department: string } }> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/auth/permissions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Get permissions error:', error);
      throw error;
    }
  }
}

export const systemAuthService = new SystemAuthService();
export type { SystemUser, SystemLoginResponse, SystemRegisterResponse };
