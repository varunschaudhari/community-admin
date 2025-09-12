import React from 'react';
import { SystemUser, systemUserManagementService } from '../../services/SystemUserManagementService';
import './SystemUserDetail.css';

interface SystemUserDetailProps {
    user: SystemUser;
    onClose: () => void;
    onEdit: (user: SystemUser) => void;
    onDelete: (userId: string) => void;
}

const SystemUserDetail: React.FC<SystemUserDetailProps> = ({ user, onClose, onEdit, onDelete }) => {
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

    const getStatusBadge = (user: SystemUser) => {
        const status = systemUserManagementService.getStatusText(user);
        const variant = systemUserManagementService.getStatusBadgeVariant(user);

        return (
            <span className={`badge badge-${variant}`}>
                {status}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`)) {
            onDelete(user._id);
        }
    };

    return (
        <div className="system-user-detail-overlay">
            <div className="system-user-detail-modal">
                <div className="system-user-detail-header">
                    <h3>User Details</h3>
                    <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="system-user-detail-content">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="detail-section">
                                <h5>Personal Information</h5>
                                <div className="detail-item">
                                    <label>Full Name:</label>
                                    <span>{user.firstName} {user.middleName} {user.lastName}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Email:</label>
                                    <span>{user.email}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Phone:</label>
                                    <span>{user.phone}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Username:</label>
                                    <span>@{user.username}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Employee ID:</label>
                                    <span><code>{user.employeeId}</code></span>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="detail-section">
                                <h5>Work Information</h5>
                                <div className="detail-item">
                                    <label>Department:</label>
                                    <span>{getDepartmentBadge(user.department)}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Designation:</label>
                                    <span>{user.designation}</span>
                                </div>
                                <div className="detail-item">
                                    <label>System Role:</label>
                                    <span>{getRoleBadge(user.role)}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Access Level:</label>
                                    <span>Level {user.accessLevel}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Status:</label>
                                    <span>{getStatusBadge(user)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="detail-section">
                                <h5>Security Information</h5>
                                <div className="detail-item">
                                    <label>Two-Factor Authentication:</label>
                                    <span className={user.twoFactorEnabled ? 'text-success' : 'text-muted'}>
                                        <i className={`fas fa-${user.twoFactorEnabled ? 'check-circle' : 'times-circle'}`}></i>
                                        {user.twoFactorEnabled ? ' Enabled' : ' Disabled'}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <label>Account Locked:</label>
                                    <span className={user.isLocked ? 'text-danger' : 'text-success'}>
                                        <i className={`fas fa-${user.isLocked ? 'lock' : 'unlock'}`}></i>
                                        {user.isLocked ? ' Locked' : ' Unlocked'}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <label>Last Password Change:</label>
                                    <span>{formatDate(user.lastPasswordChange)}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Password Expiry:</label>
                                    <span>{formatDate(user.passwordExpiry)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="detail-section">
                                <h5>Activity Information</h5>
                                <div className="detail-item">
                                    <label>Last Login:</label>
                                    <span>{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Last Login IP:</label>
                                    <span>{user.lastLoginIP || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Account Created:</label>
                                    <span>{formatDate(user.createdAt)}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Last Updated:</label>
                                    <span>{formatDate(user.updatedAt)}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Created By:</label>
                                    <span>{user.createdBy}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="detail-section">
                                <h5>Role & Permissions</h5>
                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle"></i>
                                    <strong>Role-based Permissions:</strong> This user's permissions are determined by their assigned role ({user.role}).
                                    To modify permissions, update the role in the Roles module.
                                </div>
                                {user.permissions && user.permissions.length > 0 && (
                                    <div className="permissions-list">
                                        <h6>Current Permissions (from role):</h6>
                                        <div className="permission-tags">
                                            {user.permissions.map((permission, index) => (
                                                <span key={index} className="badge badge-light permission-tag">
                                                    {permission}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="system-user-detail-footer">
                    <button className="btn btn-outline-danger" onClick={handleDelete}>
                        <i className="fas fa-trash"></i> Delete User
                    </button>
                    <button className="btn btn-primary" onClick={() => onEdit(user)}>
                        <i className="fas fa-edit"></i> Edit User
                    </button>
                    <button className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemUserDetail;
