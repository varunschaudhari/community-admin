// Dynamic Permissions Hook - React hook for permission management
import { useState, useEffect, useCallback } from 'react';
import { permissionService, UserPermissions } from '../services/PermissionService';

interface UsePermissionsReturn {
  // Data
  userPermissions: UserPermissions | null;
  isLoading: boolean;
  error: string | null;
  
  // Permission checks
  hasPermission: (permission: string) => boolean;
  canAccessResource: (resource: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  
  // Actions
  refreshPermissions: () => Promise<void>;
  clearCache: () => void;
  
  // Utility
  getAccessibleResources: () => string[];
}

export const useDynamicPermissions = (): UsePermissionsReturn => {
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load permissions on mount and when dependencies change
  const loadPermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const permissions = await permissionService.getUserPermissions();
      setUserPermissions(permissions);
      
      console.log('🔐 Dynamic permissions loaded:', permissions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load permissions';
      setError(errorMessage);
      console.error('Error loading permissions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load permissions on mount
  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  // Listen for permission updates (e.g., when user logs in/out)
  useEffect(() => {
    const handleUserDataUpdate = () => {
      console.log('🔐 User data updated, refreshing permissions');
      loadPermissions();
    };

    // Listen for custom events
    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    window.addEventListener('permissionsUpdated', handleUserDataUpdate);

    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
      window.removeEventListener('permissionsUpdated', handleUserDataUpdate);
    };
  }, [loadPermissions]);

  // Permission check functions
  const hasPermission = useCallback((permission: string): boolean => {
    if (!userPermissions) return false;
    return userPermissions.permissions.includes(permission);
  }, [userPermissions]);

  const canAccessResource = useCallback((resource: string): boolean => {
    if (!userPermissions) return false;
    return userPermissions.resources.includes(resource);
  }, [userPermissions]);

  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    if (!userPermissions) return false;
    return permissions.some(permission => userPermissions.permissions.includes(permission));
  }, [userPermissions]);

  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    if (!userPermissions) return false;
    return permissions.every(permission => userPermissions.permissions.includes(permission));
  }, [userPermissions]);

  const getAccessibleResources = useCallback((): string[] => {
    if (!userPermissions) return ['dashboard']; // Default fallback
    return userPermissions.resources;
  }, [userPermissions]);

  // Action functions
  const refreshPermissions = useCallback(async (): Promise<void> => {
    await loadPermissions();
  }, [loadPermissions]);

  const clearCache = useCallback((): void => {
    permissionService.clearCache();
    setUserPermissions(null);
  }, []);

  return {
    // Data
    userPermissions,
    isLoading,
    error,
    
    // Permission checks
    hasPermission,
    canAccessResource,
    hasAnyPermission,
    hasAllPermissions,
    
    // Actions
    refreshPermissions,
    clearCache,
    
    // Utility
    getAccessibleResources
  };
};

// Convenience hook for just checking resource access
export const useResourceAccess = (resource: string): boolean => {
  const { canAccessResource, isLoading } = useDynamicPermissions();
  
  if (isLoading) return false; // Don't show content while loading
  return canAccessResource(resource);
};

// Convenience hook for permission checking
export const usePermissionCheck = (permission: string): boolean => {
  const { hasPermission, isLoading } = useDynamicPermissions();
  
  if (isLoading) return false; // Don't show content while loading
  return hasPermission(permission);
};
