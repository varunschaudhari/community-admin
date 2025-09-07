import React from 'react';
import SystemUserManagement from './SystemUserManagement';
import './SystemUserManagement.css';

/**
 * Example component showing how to integrate SystemUserManagement
 * into your application
 */
const SystemUserManagementExample: React.FC = () => {
    return (
        <div className="system-user-management-example">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header__content">
                    <h1>System Administration</h1>
                    <p>Manage system users, roles, and permissions</p>
                </div>
                <div className="page-header__actions">
                    <button className="btn btn-outline-secondary">
                        <i className="fas fa-download"></i>
                        Export Users
                    </button>
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-cog"></i>
                        System Settings
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="admin-tabs">
                <nav className="nav nav-tabs">
                    <a className="nav-link active" href="#users" data-toggle="tab">
                        <i className="fas fa-users"></i>
                        System Users
                    </a>
                    <a className="nav-link" href="#roles" data-toggle="tab">
                        <i className="fas fa-user-shield"></i>
                        Roles & Permissions
                    </a>
                    <a className="nav-link" href="#logs" data-toggle="tab">
                        <i className="fas fa-list-alt"></i>
                        Audit Logs
                    </a>
                    <a className="nav-link" href="#settings" data-toggle="tab">
                        <i className="fas fa-cog"></i>
                        System Settings
                    </a>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                <div className="tab-pane active" id="users">
                    {/* System User Management Component */}
                    <SystemUserManagement />
                </div>

                <div className="tab-pane" id="roles">
                    <div className="placeholder-content">
                        <h3>Roles & Permissions</h3>
                        <p>This section would contain role and permission management functionality.</p>
                    </div>
                </div>

                <div className="tab-pane" id="logs">
                    <div className="placeholder-content">
                        <h3>Audit Logs</h3>
                        <p>This section would contain system audit logs and activity tracking.</p>
                    </div>
                </div>

                <div className="tab-pane" id="settings">
                    <div className="placeholder-content">
                        <h3>System Settings</h3>
                        <p>This section would contain system configuration and settings.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemUserManagementExample;
