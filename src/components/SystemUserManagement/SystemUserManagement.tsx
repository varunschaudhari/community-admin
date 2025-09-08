import React, { useState, useEffect } from 'react';
import {
    systemUserManagementService,
    SystemUser,
    SystemUserSearchParams,
    SystemUserStats as SystemUserStatsType
} from '../../services/SystemUserManagementService';
import { systemAuthService } from '../../services/SystemAuthService';
import SystemUserList from './SystemUserList';
import SystemUserForm from './SystemUserForm';
import SystemUserStats from './SystemUserStats';
import SystemUserFilters from './SystemUserFilters';
import SystemLogin from './SystemLogin';
import './SystemUserManagement.css';

interface SystemUserManagementProps {
    className?: string;
}

const SystemUserManagement: React.FC<SystemUserManagementProps> = ({ className = '' }) => {
    const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
    const [stats, setStats] = useState<SystemUserStatsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
    const [showLogin, setShowLogin] = useState(false);
    const [isSystemAuthenticated, setIsSystemAuthenticated] = useState(false);
    const [searchParams, setSearchParams] = useState<SystemUserSearchParams>({
        page: 1,
        limit: 10,
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        hasNext: false,
        hasPrev: false,
    });

    // Load system users
    const loadSystemUsers = async (params: SystemUserSearchParams = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await systemUserManagementService.getSystemUsers({
                ...searchParams,
                ...params,
            });

            setSystemUsers(response.data.systemUsers);
            setPagination(response.data.pagination);
        } catch (err) {
            console.error('Failed to load system users:', err);
            setError(err instanceof Error ? err.message : 'Failed to load system users. Please check your authentication and try again.');
            setSystemUsers([]);
            setPagination({ totalUsers: 0, totalPages: 0, currentPage: 1, hasNext: false, hasPrev: false });
        } finally {
            setLoading(false);
        }
    };

    // Load statistics
    const loadStats = async () => {
        try {
            const response = await systemUserManagementService.getSystemUserStats();
            setStats(response.data);
        } catch (err) {
            console.error('Failed to load stats:', err);
            setStats(null);
        }
    };

    // Search system users
    const searchSystemUsers = async (query: string) => {
        if (!query.trim()) {
            loadSystemUsers();
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await systemUserManagementService.searchSystemUsers(query, searchParams);

            setSystemUsers(response.data.systemUsers);
            setPagination(response.data.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to search system users');
            console.error('Error searching system users:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle user creation
    const handleCreateUser = async (userData: any) => {
        try {
            await systemUserManagementService.createSystemUser(userData);
            setShowForm(false);
            loadSystemUsers();
            loadStats();
        } catch (err) {
            throw err; // Let the form handle the error
        }
    };

    // Handle user update
    const handleUpdateUser = async (id: string, userData: any) => {
        try {
            await systemUserManagementService.updateSystemUser(id, userData);
            setEditingUser(null);
            loadSystemUsers();
            loadStats();
        } catch (err) {
            throw err; // Let the form handle the error
        }
    };

    // Handle user activation/deactivation
    const handleToggleUserStatus = async (user: SystemUser) => {
        try {
            if (user.isActive) {
                await systemUserManagementService.deactivateSystemUser(user._id);
            } else {
                await systemUserManagementService.activateSystemUser(user._id);
            }
            loadSystemUsers();
            loadStats();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update user status');
        }
    };

    // Handle password reset
    const handleResetPassword = async (userId: string, newPassword: string) => {
        try {
            await systemUserManagementService.resetSystemUserPassword(userId, newPassword);
            loadSystemUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reset password');
        }
    };

    // Handle account unlock
    const handleUnlockAccount = async (userId: string) => {
        try {
            await systemUserManagementService.unlockSystemUser(userId);
            loadSystemUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to unlock account');
        }
    };

    // Handle filter changes
    const handleFilterChange = (filters: Partial<SystemUserSearchParams>) => {
        const newParams = { ...searchParams, ...filters, page: 1 };
        setSearchParams(newParams);
        loadSystemUsers(newParams);
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        const newParams = { ...searchParams, page };
        setSearchParams(newParams);
        loadSystemUsers(newParams);
    };

    // Check system authentication on component mount
    useEffect(() => {
        const checkSystemAuth = async () => {
            // Check if user logged in as system user from main login page
            const systemUserType = localStorage.getItem('systemUserType');

            if (systemUserType === 'system') {
                const isAuth = systemAuthService.isAuthenticated();
                if (isAuth) {
                    const isValid = await systemAuthService.validateToken();
                    if (isValid) {
                        setIsSystemAuthenticated(true);
                        loadSystemUsers();
                        loadStats();
                    } else {
                        systemAuthService.logout();
                        localStorage.removeItem('systemUserType');
                        setShowLogin(true);
                    }
                } else {
                    localStorage.removeItem('systemUserType');
                    setShowLogin(true);
                }
            } else {
                setShowLogin(true);
            }
            setLoading(false);
        };

        checkSystemAuth();
    }, []);

    // Handle successful system login
    const handleSystemLoginSuccess = () => {
        setIsSystemAuthenticated(true);
        setShowLogin(false);
        loadSystemUsers();
        loadStats();
    };

    // Handle system login cancel
    const handleSystemLoginCancel = () => {
        setShowLogin(false);
        // You could redirect to dashboard or show a message
    };

    // Show login modal if not authenticated
    if (showLogin) {
        return (
            <SystemLogin
                onLoginSuccess={handleSystemLoginSuccess}
                onCancel={handleSystemLoginCancel}
            />
        );
    }

    // Show loading state
    if (loading) {
        return (
            <div className="system-user-management">
                <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading System User Management...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`system-user-management ${className}`}>
            <div className="system-user-management__header">
                <div className="system-user-management__title">
                    <h1>System User Management</h1>
                    <p>Manage system administrators, operators, and other system users</p>
                </div>

                <div className="system-user-management__actions">
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                        disabled={loading}
                    >
                        <i className="fas fa-plus"></i>
                        Add System User
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                    {error}
                    <button
                        className="btn-close"
                        onClick={() => setError(null)}
                        aria-label="Close"
                    ></button>
                </div>
            )}

            {/* Statistics */}
            {stats && (
                <SystemUserStats
                    stats={stats}
                    onFilterChange={handleFilterChange}
                    loading={loading}
                />
            )}

            {/* Filters */}
            <SystemUserFilters
                searchParams={searchParams}
                onFilterChange={handleFilterChange}
                onSearch={searchSystemUsers}
                loading={loading}
            />

            {/* User List */}
            <SystemUserList
                users={systemUsers}
                loading={loading}
                pagination={pagination}
                onEdit={(user) => setEditingUser(user)}
                onToggleStatus={handleToggleUserStatus}
                onResetPassword={handleResetPassword}
                onUnlockAccount={handleUnlockAccount}
                onPageChange={handlePageChange}
            />

            {/* Create/Edit Form Modal */}
            {(showForm || editingUser) && (
                <div className="modal-overlay" onClick={() => {
                    setShowForm(false);
                    setEditingUser(null);
                }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingUser ? 'Edit System User' : 'Create System User'}</h2>
                            <button
                                className="btn-close"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingUser(null);
                                }}
                                aria-label="Close"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="modal-body">
                            <SystemUserForm
                                user={editingUser}
                                onSubmit={editingUser
                                    ? (data) => handleUpdateUser(editingUser._id, data)
                                    : handleCreateUser
                                }
                                onCancel={() => {
                                    setShowForm(false);
                                    setEditingUser(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemUserManagement;
