import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { permissionService, UserPermissions } from '../../services/PermissionService';

interface PermissionManagerProps {
    isVisible?: boolean;
}

const PermissionManager: React.FC<PermissionManagerProps> = ({ isVisible = false }) => {
    const { theme, isDark } = useTheme();
    const [roles, setRoles] = useState<any[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [permissions, setPermissions] = useState<string[]>([]);
    const [resources, setResources] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string>('');

    // Available resources
    const availableResources = [
        'dashboard', 'analytics', 'messages', 'team', 'documents',
        'users', 'user-management', 'system-users', 'roles', 'settings'
    ];

    // Available permissions
    const availablePermissions = [
        'users:read', 'users:create', 'users:update', 'users:delete',
        'system_users:read', 'system_users:create', 'system_users:update', 'system_users:delete',
        'roles:read', 'roles:create', 'roles:update', 'roles:delete',
        'analytics:read', 'analytics:export',
        'settings:read', 'settings:update',
        'community:read', 'community:create', 'community:update', 'community:delete',
        'documents:read', 'documents:create', 'documents:update', 'documents:delete',
        'messages:read', 'messages:create', 'messages:update', 'messages:delete'
    ];

    useEffect(() => {
        if (isVisible) {
            loadRoles();
        }
    }, [isVisible]);

    const loadRoles = async () => {
        try {
            setIsLoading(true);
            const rolesData = await permissionService.getAllRoles();
            setRoles(rolesData);
        } catch (error) {
            console.error('Error loading roles:', error);
            setMessage('Error loading roles');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleSelect = (roleName: string) => {
        setSelectedRole(roleName);
        const role = roles.find(r => r.name === roleName);
        if (role) {
            setPermissions(role.permissions.map((p: any) => p.name));
            setResources(role.resources || []);
        }
    };

    const handleResourceToggle = (resource: string) => {
        setResources(prev =>
            prev.includes(resource)
                ? prev.filter(r => r !== resource)
                : [...prev, resource]
        );
    };

    const handlePermissionToggle = (permission: string) => {
        setPermissions(prev =>
            prev.includes(permission)
                ? prev.filter(p => p !== permission)
                : [...prev, permission]
        );
    };

    const updateRolePermissions = async () => {
        if (!selectedRole) return;

        try {
            setIsLoading(true);
            setMessage('');

            // In a real app, this would call the backend API
            // For now, we'll just show a success message
            console.log('Updating role permissions:', {
                role: selectedRole,
                permissions,
                resources
            });

            setMessage(`Permissions updated for ${selectedRole} successfully!`);

            // Clear cache to force refresh
            permissionService.clearCache();

            // Dispatch event to notify components
            window.dispatchEvent(new CustomEvent('permissionsUpdated'));

        } catch (error) {
            console.error('Error updating permissions:', error);
            setMessage('Error updating permissions');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            zIndex: 10000,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>🔧 Permission Manager</h3>

            {message && (
                <div style={{
                    background: message.includes('Error') ? '#f8d7da' : '#d4edda',
                    color: message.includes('Error') ? '#721c24' : '#155724',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    {message}
                </div>
            )}

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Select Role:
                </label>
                <select
                    value={selectedRole}
                    onChange={(e) => handleRoleSelect(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="">Select a role...</option>
                    {roles.map(role => (
                        <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                </select>
            </div>

            {selectedRole && (
                <>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                            Resources Access:
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px' }}>
                            {availableResources.map(resource => (
                                <label key={resource} style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                                    <input
                                        type="checkbox"
                                        checked={resources.includes(resource)}
                                        onChange={() => handleResourceToggle(resource)}
                                        style={{ marginRight: '8px' }}
                                    />
                                    {resource}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                            Permissions:
                        </label>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px' }}>
                            {availablePermissions.map(permission => (
                                <label key={permission} style={{ display: 'flex', alignItems: 'center', fontSize: '12px', marginBottom: '5px' }}>
                                    <input
                                        type="checkbox"
                                        checked={permissions.includes(permission)}
                                        onChange={() => handlePermissionToggle(permission)}
                                        style={{ marginRight: '8px' }}
                                    />
                                    {permission}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={updateRolePermissions}
                            disabled={isLoading}
                            style={{
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.6 : 1
                            }}
                        >
                            {isLoading ? 'Updating...' : 'Update Permissions'}
                        </button>

                        <button
                            onClick={() => {
                                setSelectedRole('');
                                setPermissions([]);
                                setResources([]);
                                setMessage('');
                            }}
                            style={{
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PermissionManager;
