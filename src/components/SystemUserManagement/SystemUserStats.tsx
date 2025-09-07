import React from 'react';
import { SystemUserStats as SystemUserStatsType } from '../../services/SystemUserManagementService';
import './SystemUserStats.css';

interface SystemUserStatsProps {
    stats: SystemUserStatsType;
    onFilterChange: (filters: any) => void;
    loading: boolean;
}

const SystemUserStats: React.FC<SystemUserStatsProps> = ({ stats, onFilterChange, loading }) => {
    const handleStatClick = (filter: any) => {
        onFilterChange(filter);
    };

    const getDepartmentColor = (department: string) => {
        const colors: { [key: string]: string } = {
            'IT': '#007bff',
            'HR': '#28a745',
            'Finance': '#17a2b8',
            'Operations': '#ffc107',
            'Security': '#dc3545',
            'Management': '#343a40',
            'Support': '#6c757d',
        };
        return colors[department] || '#6c757d';
    };

    const getRoleColor = (role: string) => {
        const colors: { [key: string]: string } = {
            'System Admin': '#dc3545',
            'System Manager': '#ffc107',
            'System Operator': '#17a2b8',
            'System Viewer': '#6c757d',
        };
        return colors[role] || '#6c757d';
    };

    return (
        <div className="system-user-stats">
            <div className="stats-header">
                <h3>System User Statistics</h3>
                <p>Overview of system users and their distribution</p>
            </div>

            <div className="stats-grid">
                {/* Overview Stats */}
                <div className="stats-section">
                    <h4>Overview</h4>
                    <div className="stats-cards">
                        <div
                            className="stat-card stat-card-primary"
                            onClick={() => handleStatClick({})}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="stat-card__icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="stat-card__content">
                                <div className="stat-card__value">{stats.overview.totalUsers}</div>
                                <div className="stat-card__label">Total Users</div>
                            </div>
                        </div>

                        <div
                            className="stat-card stat-card-success"
                            onClick={() => handleStatClick({ isActive: true })}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="stat-card__icon">
                                <i className="fas fa-user-check"></i>
                            </div>
                            <div className="stat-card__content">
                                <div className="stat-card__value">{stats.overview.activeUsers}</div>
                                <div className="stat-card__label">Active Users</div>
                            </div>
                        </div>

                        <div
                            className="stat-card stat-card-info"
                            onClick={() => handleStatClick({ verified: true })}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="stat-card__icon">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <div className="stat-card__content">
                                <div className="stat-card__value">{stats.overview.verifiedUsers}</div>
                                <div className="stat-card__label">Verified Users</div>
                            </div>
                        </div>

                        <div
                            className="stat-card stat-card-warning"
                            onClick={() => handleStatClick({ locked: true })}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="stat-card__icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <div className="stat-card__content">
                                <div className="stat-card__value">{stats.overview.lockedUsers}</div>
                                <div className="stat-card__label">Locked Users</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Department Distribution */}
                <div className="stats-section">
                    <h4>By Department</h4>
                    <div className="distribution-chart">
                        {stats.departmentStats.map((dept, index) => (
                            <div
                                key={dept._id}
                                className="distribution-item"
                                onClick={() => handleStatClick({ department: dept._id })}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="distribution-item__header">
                                    <div
                                        className="distribution-item__color"
                                        style={{ backgroundColor: getDepartmentColor(dept._id) }}
                                    ></div>
                                    <span className="distribution-item__label">{dept._id}</span>
                                    <span className="distribution-item__value">{dept.count}</span>
                                </div>
                                <div className="distribution-item__bar">
                                    <div
                                        className="distribution-item__fill"
                                        style={{
                                            width: `${(dept.count / Math.max(...stats.departmentStats.map(d => d.count))) * 100}%`,
                                            backgroundColor: getDepartmentColor(dept._id)
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Role Distribution */}
                <div className="stats-section">
                    <h4>By Role</h4>
                    <div className="distribution-chart">
                        {stats.roleStats.map((role, index) => (
                            <div
                                key={role._id}
                                className="distribution-item"
                                onClick={() => handleStatClick({ systemRole: role._id })}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="distribution-item__header">
                                    <div
                                        className="distribution-item__color"
                                        style={{ backgroundColor: getRoleColor(role._id) }}
                                    ></div>
                                    <span className="distribution-item__label">{role._id}</span>
                                    <span className="distribution-item__value">{role.count}</span>
                                </div>
                                <div className="distribution-item__bar">
                                    <div
                                        className="distribution-item__fill"
                                        style={{
                                            width: `${(role.count / Math.max(...stats.roleStats.map(r => r.count))) * 100}%`,
                                            backgroundColor: getRoleColor(role._id)
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="stats-actions">
                <h4>Quick Actions</h4>
                <div className="quick-actions">
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleStatClick({ isActive: true })}
                        disabled={loading}
                    >
                        <i className="fas fa-user-check"></i>
                        View Active Users
                    </button>

                    <button
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => handleStatClick({ isActive: false })}
                        disabled={loading}
                    >
                        <i className="fas fa-user-times"></i>
                        View Inactive Users
                    </button>

                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleStatClick({ locked: true })}
                        disabled={loading}
                    >
                        <i className="fas fa-lock"></i>
                        View Locked Users
                    </button>

                    <button
                        className="btn btn-outline-info btn-sm"
                        onClick={() => handleStatClick({ systemRole: 'System Admin' })}
                        disabled={loading}
                    >
                        <i className="fas fa-crown"></i>
                        View Admins
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemUserStats;
