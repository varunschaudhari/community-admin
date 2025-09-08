// Dynamic Permission Service - fetches permissions from backend
import axios from 'axios';

// Types for dynamic permissions
export interface Permission {
    id: string;
    name: string;
    resource: string;
    action: string;
    description?: string;
}

export interface Role {
    id: string;
    name: string;
    description?: string;
    permissions: Permission[];
}

export interface UserPermissions {
    role: string;
    permissions: string[];
    resources: string[];
}

// Cache for permissions (with TTL)
let permissionsCache: {
    data: UserPermissions | null;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
} = {
    data: null,
    timestamp: 0,
    ttl: 5 * 60 * 1000 // 5 minutes cache
};

// Permission Service Class
class PermissionService {
    private baseUrl = 'http://localhost:5000/api/permissions';

    /**
     * Get user permissions from backend
     */
    async getUserPermissions(): Promise<UserPermissions> {
        try {
            // Check cache first
            if (this.isCacheValid()) {
                console.log('🔐 Using cached permissions');
                return permissionsCache.data!;
            }

            // Check if we have a valid token
            const token = localStorage.getItem('authToken') || localStorage.getItem('systemAuthToken');
            console.log('🔐 PermissionService - Token check:');
            console.log('  authToken:', localStorage.getItem('authToken') ? 'Present' : 'Missing');
            console.log('  systemAuthToken:', localStorage.getItem('systemAuthToken') ? 'Present' : 'Missing');
            console.log('  Selected token:', token ? 'Present' : 'Missing');

            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log('🔐 Fetching fresh permissions from backend');
            const response = await axios.get(`${this.baseUrl}/user-permissions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                timeout: 5000 // 5 second timeout
            });

            if (response.data.success) {
                const userPermissions: UserPermissions = response.data.data;

                // Update cache
                this.updateCache(userPermissions);

                return userPermissions;
            } else {
                throw new Error(response.data.message || 'Failed to fetch permissions');
            }
        } catch (error) {
            console.error('🔐 Backend permission fetch failed:', error instanceof Error ? error.message : 'Unknown error');
            throw error; // Re-throw to let the calling component handle it
        }
    }

    /**
     * Get all available roles and their permissions
     */
    async getAllRoles(): Promise<Role[]> {
        try {
            const token = localStorage.getItem('authToken') || localStorage.getItem('systemAuthToken');
            console.log('🔐 PermissionService - getAllRoles Token check:');
            console.log('  authToken:', localStorage.getItem('authToken') ? 'Present' : 'Missing');
            console.log('  systemAuthToken:', localStorage.getItem('systemAuthToken') ? 'Present' : 'Missing');
            console.log('  Selected token:', token ? 'Present' : 'Missing');

            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log('🔐 Fetching roles from backend');
            const response = await axios.get(`${this.baseUrl}/roles`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                timeout: 5000
            });

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch roles');
            }
        } catch (error) {
            console.error('🔐 Backend roles fetch failed:', error instanceof Error ? error.message : 'Unknown error');
            throw error; // Re-throw to let the calling component handle it
        }
    }

    /**
     * Check if user has specific permission
     */
    async hasPermission(permission: string): Promise<boolean> {
        const userPermissions = await this.getUserPermissions();
        return userPermissions.permissions.includes(permission);
    }

    /**
     * Check if user can access specific resource
     */
    async canAccessResource(resource: string): Promise<boolean> {
        const userPermissions = await this.getUserPermissions();
        return userPermissions.resources.includes(resource);
    }

    /**
     * Get user's accessible resources
     */
    async getAccessibleResources(): Promise<string[]> {
        const userPermissions = await this.getUserPermissions();
        return userPermissions.resources;
    }

    /**
     * Clear permissions cache (call this when user logs out or permissions change)
     */
    clearCache(): void {
        permissionsCache.data = null;
        permissionsCache.timestamp = 0;
        console.log('🔐 Permissions cache cleared');
    }

    /**
     * Force refresh permissions from backend
     */
    async refreshPermissions(): Promise<UserPermissions> {
        this.clearCache();
        return await this.getUserPermissions();
    }

    /**
     * Check if cache is still valid
     */
    private isCacheValid(): boolean {
        if (!permissionsCache.data) return false;

        const now = Date.now();
        const cacheAge = now - permissionsCache.timestamp;

        return cacheAge < permissionsCache.ttl;
    }

    /**
     * Update permissions cache
     */
    private updateCache(userPermissions: UserPermissions): void {
        permissionsCache.data = userPermissions;
        permissionsCache.timestamp = Date.now();
    }



}

// Export singleton instance
export const permissionService = new PermissionService();
