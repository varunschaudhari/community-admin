import React, { useState } from 'react';
import { SystemUser, systemUserManagementService } from '../../services/SystemUserManagementService';
import './SystemUserList.css';

interface SystemUserListProps {
    users: SystemUser[];
    loading: boolean;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalUsers: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    onEdit: (user: SystemUser) => void;
    onView: (user: SystemUser) => void;
    onDelete: (userId: string) => void;
    onToggleStatus: (user: SystemUser) => void;
    onResetPassword: (userId: string, newPassword: string) => void;
    onUnlockAccount: (userId: string) => void;
    onPageChange: (page: number) => void;
}

const SystemUserList: React.FC<SystemUserListProps> = ({
    users,
    loading,
    pagination,
    onEdit,
    onView,
    onDelete,
    onToggleStatus,
    onResetPassword,
    onUnlockAccount,
    onPageChange,
}) => {
    const [showPasswordModal, setShowPasswordModal] = useState<{
        userId: string;
        username: string;
    } | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleRowClick = (user: SystemUser, event: React.MouseEvent) => {
        // Don't trigger row click if clicking on action buttons
        if ((event.target as HTMLElement).closest('.action-buttons')) {
            return;
        }
        onView(user);
    };

    const handleResetPassword = async () => {
        if (!showPasswordModal || !newPassword.trim()) return;

        try {
            setPasswordLoading(true);
            await onResetPassword(showPasswordModal.userId, newPassword);
            setShowPasswordModal(null);
            setNewPassword('');
        } catch (error) {
            console.error('Error resetting password:', error);
        } finally {
            setPasswordLoading(false);
        }
    };

    const getStatusBadge = (user: SystemUser) => {
        const status = systemUserManagementService.getStatusText(user);
        const variant = systemUserManagementService.getStatusBadgeVariant(user);

        return (
            <span className={`badge badge-${variant}`}>
                {status}
            </span>
        );
    };

    const getRoleBadge = (systemRole: string) => {
        const roleColors: { [key: string]: string } = {
            'Super Admin': 'danger',
            'Admin': 'warning',
            'Moderator': 'info',
            'Member': 'secondary',
            'Guest': 'light',
        };

        return (
            <span className={`badge badge-${roleColors[systemRole] || 'secondary'}`}>
                {systemRole}
            </span>
        );
    };

    const getDepartmentBadge = (department: string) => {
        const deptColors: { [key: string]: string } = {
            'IT': 'primary',
            'HR': 'success',
            'Finance': 'info',
            'Operations': 'warning',
            'Security': 'danger',
            'Management': 'dark',
            'Support': 'secondary',
        };

        return (
            <span className={`badge badge-${deptColors[department] || 'secondary'}`}>
                {department}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="system-user-list">
                <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading system users...</p>
                </div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="system-user-list">
                <div className="empty-state">
                    <i className="fas fa-users"></i>
                    <h3>No System Users Found</h3>
                    <p>No system users match your current filters.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="system-user-list">
            <div className="system-user-list__header">
                <h3>System Users ({pagination.totalUsers})</h3>
                <div className="system-user-list__actions">
                    <span className="text-muted">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Employee ID</th>
                            <th>Department</th>
                            <th>Role</th>
                            <th>Access Level</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user._id}
                                className={`${!user.isActive ? 'table-secondary' : ''} clickable-row`}
                                onClick={(e) => handleRowClick(user, e)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>
                                    <div className="user-info">
                                        <div className="user-info__avatar">
                                            <i className="fas fa-user-shield"></i>
                                        </div>
                                        <div className="user-info__details">
                                            <div className="user-info__name">
                                                {systemUserManagementService.formatSystemUser(user).displayName}
                                            </div>
                                            <div className="user-info__email">{user.email}</div>
                                            <div className="user-info__username">@{user.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <code className="employee-id">{user.employeeId}</code>
                                </td>
                                <td>{getDepartmentBadge(user.department)}</td>
                                <td>{getRoleBadge(user.role)}</td>
                                <td>
                                    <span className="access-level">
                                        Level {user.accessLevel}
                                    </span>
                                </td>
                                <td>{getStatusBadge(user)}</td>
                                <td>
                                    {user.lastLogin ? (
                                        <div className="last-login">
                                            <div>{new Date(user.lastLogin).toLocaleDateString()}</div>
                                            <small className="text-muted">
                                                {new Date(user.lastLogin).toLocaleTimeString()}
                                            </small>
                                        </div>
                                    ) : (
                                        <span className="text-muted">Never</span>
                                    )}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => onEdit(user)}
                                            title="Edit User"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>

                                        <button
                                            className={`btn btn-sm ${user.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                            onClick={() => onToggleStatus(user)}
                                            title={user.isActive ? 'Deactivate' : 'Activate'}
                                        >
                                            <i className={`fas fa-${user.isActive ? 'pause' : 'play'}`}></i>
                                        </button>

                                        {user.isLocked && (
                                            <button
                                                className="btn btn-sm btn-outline-info"
                                                onClick={() => onUnlockAccount(user._id)}
                                                title="Unlock Account"
                                            >
                                                <i className="fas fa-unlock"></i>
                                            </button>
                                        )}

                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => setShowPasswordModal({
                                                userId: user._id,
                                                username: user.username
                                            })}
                                            title="Reset Password"
                                        >
                                            <i className="fas fa-key"></i>
                                        </button>

                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`)) {
                                                    onDelete(user._id);
                                                }
                                            }}
                                            title="Delete User"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="pagination-wrapper">
                    <nav aria-label="System users pagination">
                        <ul className="pagination">
                            <li className={`page-item ${!pagination.hasPrev ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => onPageChange(pagination.currentPage - 1)}
                                    disabled={!pagination.hasPrev}
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                            </li>

                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                <li key={page} className={`page-item ${page === pagination.currentPage ? 'active' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => onPageChange(page)}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}

                            <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => onPageChange(pagination.currentPage + 1)}
                                    disabled={!pagination.hasNext}
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}

            {/* Password Reset Modal */}
            {showPasswordModal && (
                <div className="modal-overlay" onClick={() => setShowPasswordModal(null)}>
                    <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Reset Password</h3>
                            <button
                                className="btn-close"
                                onClick={() => setShowPasswordModal(null)}
                                aria-label="Close"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="modal-body">
                            <p>Enter new password for <strong>{showPasswordModal.username}</strong>:</p>
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    className="form-control"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password (min 12 characters)"
                                    minLength={12}
                                    required
                                />
                                <small className="form-text text-muted">
                                    Password must be at least 12 characters long
                                </small>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowPasswordModal(null)}
                                disabled={passwordLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleResetPassword}
                                disabled={!newPassword.trim() || newPassword.length < 12 || passwordLoading}
                            >
                                {passwordLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Resetting...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemUserList;
