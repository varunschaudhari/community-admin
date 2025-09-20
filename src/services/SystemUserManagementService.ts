import { systemAuthService } from './SystemAuthService';

interface SystemUser {
    _id: string;
    username: string;
    email: string;
    employeeId: string;
    department: 'IT' | 'HR' | 'Finance' | 'Operations' | 'Security' | 'Management' | 'Support';
    designation: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    phone: string;
    role: 'Super Admin' | 'Admin' | 'Moderator' | 'Member' | 'Guest';
    accessLevel: number;
    permissions?: string[];
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    passwordExpiry: string;
    verified: boolean;
    isActive: boolean;
    lastLogin?: string;
    lastLoginIP?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    // Virtual fields
    fullName?: string;
    displayName?: string;
    isLocked?: boolean;
    isPasswordExpired?: boolean;
}

interface SystemUserStats {
    overview: {
        totalUsers: number;
        activeUsers: number;
        verifiedUsers: number;
        lockedUsers: number;
    };
    departmentStats: Array<{
        _id: string;
        count: number;
    }>;
    roleStats: Array<{
        _id: string;
        count: number;
    }>;
}

interface SystemUserSearchParams {
    query?: string;
    department?: string;
    role?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
}

interface CreateSystemUserData {
    username: string;
    password: string;
    email: string;
    employeeId: string;
    department: string;
    designation: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    phone: string;
    role: string;
    accessLevel: number;
}

interface UpdateSystemUserData {
    department?: string;
    designation?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    phone?: string;
    role?: string;
    accessLevel?: number;
    isActive?: boolean;
    verified?: boolean;
}

interface SystemUserResponse {
    success: boolean;
    data: {
        systemUsers: SystemUser[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalUsers: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    };
}

interface SystemUserStatsResponse {
    success: boolean;
    data: SystemUserStats;
}

class SystemUserManagementService {
    private baseUrl = 'http://localhost:5000/api/system';

    private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const token = systemAuthService.getToken();

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('System User Management API Error:', error);
            throw error;
        }
    }

    // Get all system users with pagination and filtering
    async getSystemUsers(params: SystemUserSearchParams = {}): Promise<SystemUserResponse> {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.department) queryParams.append('department', params.department);
        if (params.role) queryParams.append('role', params.role);
        if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/users?${queryString}` : '/users';

        return this.makeRequest<SystemUserResponse>(endpoint);
    }

    // Search system users
    async searchSystemUsers(query: string, params: SystemUserSearchParams = {}): Promise<SystemUserResponse> {
        const queryParams = new URLSearchParams();
        queryParams.append('q', query);

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const queryString = queryParams.toString();
        return this.makeRequest<SystemUserResponse>(`/users/search?${queryString}`);
    }

    // Get system user by ID
    async getSystemUserById(id: string): Promise<{ success: boolean; data: { systemUser: SystemUser } }> {
        return this.makeRequest<{ success: boolean; data: { systemUser: SystemUser } }>(`/users/${id}`);
    }

    // Create new system user
    async createSystemUser(userData: CreateSystemUserData): Promise<{ success: boolean; data: { user: SystemUser } }> {
        return this.makeRequest<{ success: boolean; data: { user: SystemUser } }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    // Update system user
    async updateSystemUser(id: string, userData: UpdateSystemUserData): Promise<{ success: boolean; data: { systemUser: SystemUser } }> {
        return this.makeRequest<{ success: boolean; data: { systemUser: SystemUser } }>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    // Deactivate system user
    async deactivateSystemUser(id: string): Promise<{ success: boolean; message: string }> {
        return this.makeRequest<{ success: boolean; message: string }>(`/users/${id}/deactivate`, {
            method: 'POST',
        });
    }

    // Activate system user
    async activateSystemUser(id: string): Promise<{ success: boolean; message: string }> {
        return this.makeRequest<{ success: boolean; message: string }>(`/users/${id}/activate`, {
            method: 'POST',
        });
    }

    // Reset system user password
    async resetSystemUserPassword(id: string, newPassword: string): Promise<{ success: boolean; message: string }> {
        return this.makeRequest<{ success: boolean; message: string }>(`/users/${id}/reset-password`, {
            method: 'POST',
            body: JSON.stringify({ newPassword }),
        });
    }

    // Unlock system user account
    async unlockSystemUser(id: string): Promise<{ success: boolean; message: string }> {
        return this.makeRequest<{ success: boolean; message: string }>(`/users/${id}/unlock`, {
            method: 'POST',
        });
    }

    // Delete system user
    async deleteSystemUser(id: string): Promise<{ success: boolean; message: string }> {
        console.log(`Attempting to delete system user with ID: ${id}`);
        try {
            const result = await this.makeRequest<{ success: boolean; message: string }>(`/users/${id}`, {
                method: 'DELETE',
            });
            console.log('Delete system user result:', result);
            return result;
        } catch (error) {
            console.error('Delete system user error:', error);
            throw error;
        }
    }

    // Get system users by department
    async getSystemUsersByDepartment(department: string, params: SystemUserSearchParams = {}): Promise<SystemUserResponse> {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/users/department/${department}?${queryString}` : `/users/department/${department}`;

        return this.makeRequest<SystemUserResponse>(endpoint);
    }

    // Get system users by role
    async getSystemUsersByRole(role: string, params: SystemUserSearchParams = {}): Promise<SystemUserResponse> {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/users/role/${role}?${queryString}` : `/users/role/${role}`;

        return this.makeRequest<SystemUserResponse>(endpoint);
    }

    // Get active system users
    async getActiveSystemUsers(params: SystemUserSearchParams = {}): Promise<SystemUserResponse> {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/users/active?${queryString}` : '/users/active';

        return this.makeRequest<SystemUserResponse>(endpoint);
    }

    // Get inactive system users
    async getInactiveSystemUsers(params: SystemUserSearchParams = {}): Promise<SystemUserResponse> {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/users/inactive?${queryString}` : '/users/inactive';

        return this.makeRequest<SystemUserResponse>(endpoint);
    }

    // Get locked system users
    async getLockedSystemUsers(params: SystemUserSearchParams = {}): Promise<SystemUserResponse> {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/users/locked?${queryString}` : '/users/locked';

        return this.makeRequest<SystemUserResponse>(endpoint);
    }

    // Get system user statistics
    async getSystemUserStats(): Promise<SystemUserStatsResponse> {
        return this.makeRequest<SystemUserStatsResponse>('/users/stats');
    }

    // Get current system user permissions
    async getCurrentUserPermissions(): Promise<{ success: boolean; data: { permissions: string[]; role: string; accessLevel: number; department: string } }> {
        return this.makeRequest<{ success: boolean; data: { permissions: string[]; role: string; accessLevel: number; department: string } }>('/auth/permissions');
    }

    // Get current system user access info
    async getCurrentUserAccessInfo(): Promise<{ success: boolean; data: { user: SystemUser; accessInfo: any } }> {
        return this.makeRequest<{ success: boolean; data: { user: SystemUser; accessInfo: any } }>('/auth/access-info');
    }

    // Change current system user password
    async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
        return this.makeRequest<{ success: boolean; message: string }>('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    }

    // Utility methods
    getDepartmentOptions(): Array<{ value: string; label: string }> {
        return [
            { value: 'IT', label: 'Information Technology' },
            { value: 'HR', label: 'Human Resources' },
            { value: 'Finance', label: 'Finance' },
            { value: 'Operations', label: 'Operations' },
            { value: 'Security', label: 'Security' },
            { value: 'Management', label: 'Management' },
            { value: 'Support', label: 'Support' },
        ];
    }

    getSystemRoleOptions(): Array<{ value: string; label: string; accessLevel: number }> {
        return [
            { value: 'Super Admin', label: 'Super Admin', accessLevel: 5 },
            { value: 'Admin', label: 'Admin', accessLevel: 4 },
            { value: 'Moderator', label: 'Moderator', accessLevel: 3 },
            { value: 'Member', label: 'Member', accessLevel: 2 },
            { value: 'Guest', label: 'Guest', accessLevel: 1 },
        ];
    }


    formatSystemUser(user: SystemUser): SystemUser {
        return {
            ...user,
            fullName: user.middleName
                ? `${user.firstName} ${user.middleName} ${user.lastName}`
                : `${user.firstName} ${user.lastName}`,
            displayName: user.firstName && user.lastName
                ? (user.middleName ? `${user.firstName} ${user.middleName} ${user.lastName}` : `${user.firstName} ${user.lastName}`)
                : user.username,
        };
    }

    getStatusBadgeVariant(user: SystemUser): 'success' | 'warning' | 'danger' | 'secondary' {
        if (!user.isActive) return 'secondary';
        if (user.isLocked) return 'danger';
        if (user.isPasswordExpired) return 'warning';
        if (!user.verified) return 'warning';
        return 'success';
    }

    getStatusText(user: SystemUser): string {
        if (!user.isActive) return 'Inactive';
        if (user.isLocked) return 'Locked';
        if (user.isPasswordExpired) return 'Password Expired';
        if (!user.verified) return 'Unverified';
        return 'Active';
    }
}

export const systemUserManagementService = new SystemUserManagementService();
export type { SystemUser, SystemUserStats, SystemUserSearchParams, CreateSystemUserData, UpdateSystemUserData };
