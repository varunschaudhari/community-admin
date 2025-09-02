import React, { useState, useEffect } from 'react';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SaveOutlined,
  CloseOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { Modal, Button, Switch, Checkbox, Input, message, Popconfirm, Tooltip } from 'antd';
import { ROLES, FORMS, ERRORS, SUCCESS, ACTIONS } from '../../constants/strings';
import { roleService } from '../../services/RoleService';
import './Roles.css';

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
}

interface CreateRoleData {
  name: string;
  description: string;
  permissions: string[];
}

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<CreateRoleData>({
    name: '',
    description: '',
    permissions: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate total statistics
  const totalUsers = roles.reduce((sum, role) => sum + (role.memberCount || 0), 0);
  const rolesWithUsers = roles.filter(role => (role.memberCount || 0) > 0).length;
  const rolesWithoutUsers = roles.filter(role => (role.memberCount || 0) === 0).length;

  // Available permissions
  const availablePermissions: Permission[] = [
    { id: 'users:read', name: 'View Users', description: 'Can view community users', resource: 'users' },
    { id: 'users:create', name: 'Create Users', description: 'Can create new users', resource: 'users' },
    { id: 'users:update', name: 'Update Users', description: 'Can edit user information', resource: 'users' },
    { id: 'users:delete', name: 'Delete Users', description: 'Can remove users', resource: 'users' },
    { id: 'roles:read', name: 'View Roles', description: 'Can view role definitions', resource: 'roles' },
    { id: 'roles:create', name: 'Create Roles', description: 'Can create new roles', resource: 'roles' },
    { id: 'roles:update', name: 'Update Roles', description: 'Can edit role permissions', resource: 'roles' },
    { id: 'roles:delete', name: 'Delete Roles', description: 'Can remove roles', resource: 'roles' },
    { id: 'analytics:read', name: 'View Analytics', description: 'Can access analytics dashboard', resource: 'analytics' },
    { id: 'settings:read', name: 'View Settings', description: 'Can view system settings', resource: 'settings' },
    { id: 'settings:update', name: 'Update Settings', description: 'Can modify system settings', resource: 'settings' }
  ];

  // Group permissions by resource
  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await roleService.getAllRoles();
      setRoles(response.data || []);
    } catch (error) {
      message.error('Failed to fetch roles');
      console.error('Fetch roles error:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = ERRORS.REQUIRED_FIELD;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Role name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Role name cannot exceed 50 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = ERRORS.REQUIRED_FIELD;
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'At least one permission must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateRole = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await roleService.createRole(formData);
      message.success(SUCCESS.CREATED);
      setCreateModalVisible(false);
      resetForm();
      fetchRoles();
    } catch (error) {
      message.error('Failed to create role');
      console.error('Create role error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedRole || !validateForm()) return;

    setLoading(true);
    try {
      await roleService.updateRole(selectedRole.id, formData);
      message.success(SUCCESS.UPDATED);
      setEditModalVisible(false);
      resetForm();
      fetchRoles();
    } catch (error) {
      message.error('Failed to update role');
      console.error('Update role error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    setLoading(true);
    try {
      await roleService.deleteRole(roleId);
      message.success(SUCCESS.DELETED);
      fetchRoles();
    } catch (error) {
      message.error('Failed to delete role');
      console.error('Delete role error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleSelectAllPermissions = (resource: string, checked: boolean) => {
    const resourcePermissions = groupedPermissions[resource].map(p => p.id);
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? Array.from(new Set([...prev.permissions, ...resourcePermissions]))
        : prev.permissions.filter(id => !resourcePermissions.includes(id))
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: []
    });
    setErrors({});
    setSelectedRole(null);
  };

  const openCreateModal = () => {
    resetForm();
    setCreateModalVisible(true);
  };

  const openEditModal = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setEditModalVisible(true);
  };

  const openViewModal = (role: Role) => {
    setSelectedRole(role);
    setViewModalVisible(true);
  };

  const getPermissionDisplayName = (permissionId: string): string => {
    const permission = availablePermissions.find(p => p.id === permissionId);
    return permission ? permission.name : permissionId;
  };

  const getPermissionDescription = (permissionId: string): string => {
    const permission = availablePermissions.find(p => p.id === permissionId);
    return permission ? permission.description : '';
  };

  const renderPermissionsList = (permissions: string[]) => (
    <div className="permissions-list">
      {permissions.map(permissionId => (
        <div key={permissionId} className="permission-item">
          <span className="permission-name">{getPermissionDisplayName(permissionId)}</span>
          <span className="permission-description">{getPermissionDescription(permissionId)}</span>
        </div>
      ))}
    </div>
  );

  const renderPermissionsForm = () => (
    <div className="permissions-form">
      {Object.entries(groupedPermissions).map(([resource, permissions]) => (
        <div key={resource} className="permission-group">
          <div className="permission-group-header">
            <h4 className="resource-name">{resource.charAt(0).toUpperCase() + resource.slice(1)}</h4>
            <Checkbox
              checked={permissions.every(p => formData.permissions.includes(p.id))}
              indeterminate={permissions.some(p => formData.permissions.includes(p.id)) &&
                !permissions.every(p => formData.permissions.includes(p.id))}
              onChange={(e) => handleSelectAllPermissions(resource, e.target.checked)}
            >
              Select All
            </Checkbox>
          </div>
          <div className="permission-items">
            {permissions.map(permission => (
              <div key={permission.id} className="permission-item">
                <Checkbox
                  checked={formData.permissions.includes(permission.id)}
                  onChange={() => handleTogglePermission(permission.id)}
                >
                  <div className="permission-content">
                    <span className="permission-name">{permission.name}</span>
                    <span className="permission-description">{permission.description}</span>
                  </div>
                </Checkbox>
              </div>
            ))}
          </div>
        </div>
      ))}
      {errors.permissions && <div className="error-message">{errors.permissions}</div>}
    </div>
  );

  return (
    <div className="roles-page">
      <div className="roles-header">
        <div className="header-content">
          <h1 className="page-title">Role Management</h1>
          <p className="page-subtitle">Manage user roles and permissions for the community</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
          className="create-role-btn"
        >
          Create New Role
        </Button>
      </div>

      <div className="roles-content">
        {/* Statistics Section */}
        <div className="roles-statistics">
          <div className="stat-card">
            <div className="stat-number">{roles.length}</div>
            <div className="stat-label">Total Roles</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{rolesWithUsers}</div>
            <div className="stat-label">Roles with Members</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{rolesWithoutUsers}</div>
            <div className="stat-label">Empty Roles</div>
          </div>
        </div>

        <div className="roles-table-container">
          <div className="table-header">
            <h3>Available Roles</h3>
            <span className="role-count">{roles.length} roles</span>
          </div>

          <div className="roles-grid">
            {roles.map(role => (
              <div key={role.id} className="role-card">
                <div className="role-header">
                  <div className="role-info">
                    <h4 className="role-name">{role.name}</h4>
                    <p className="role-description">{role.description}</p>
                  </div>
                  <div className="role-status">
                    <Switch
                      checked={role.isActive}
                      size="small"
                      disabled
                    />
                    <span className="status-label">{role.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>

                <div className="role-permissions">
                  <h5>Permissions ({role.permissions.length})</h5>
                  {renderPermissionsList(role.permissions.slice(0, 3))}
                  {role.permissions.length > 3 && (
                    <div className="more-permissions">
                      +{role.permissions.length - 3} more permissions
                    </div>
                  )}
                </div>

                <div className="role-footer">
                  <div className="role-meta">
                    <span className="member-count">
                      {role.memberCount || 0} members
                    </span>
                    <span className="last-updated">
                      Updated {new Date(role.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="role-actions">
                    <Tooltip title="View Details">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => openViewModal(role)}
                        className="action-btn"
                      />
                    </Tooltip>
                    <Tooltip title="Edit Role">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(role)}
                        className="action-btn"
                      />
                    </Tooltip>
                    <Popconfirm
                      title="Delete Role"
                      description="Are you sure you want to delete this role? This action cannot be undone."
                      onConfirm={() => handleDeleteRole(role.id)}
                      okText="Yes, Delete"
                      cancelText="Cancel"
                      icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                    >
                      <Tooltip title="Delete Role">
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          className="action-btn delete-btn"
                        />
                      </Tooltip>
                    </Popconfirm>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {roles.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No Roles Found</h3>
              <p>Create your first role to get started with permission management.</p>
              <Button type="primary" onClick={openCreateModal}>
                Create First Role
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Role Modal */}
      <Modal
        title="Create New Role"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setCreateModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="create"
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={handleCreateRole}
          >
            Create Role
          </Button>
        ]}
        width={800}
        destroyOnClose
      >
        <div className="role-form">
          <div className="form-group">
            <label htmlFor="roleName">Role Name *</label>
            <Input
              id="roleName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter role name"
              status={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="roleDescription">Description *</label>
            <Input.TextArea
              id="roleDescription"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter role description"
              rows={3}
              status={errors.description ? 'error' : ''}
            />
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>

          <div className="form-group">
            <label>Permissions *</label>
            {renderPermissionsForm()}
          </div>
        </div>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        title="Edit Role"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="update"
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={handleUpdateRole}
          >
            Update Role
          </Button>
        ]}
        width={800}
        destroyOnClose
      >
        <div className="role-form">
          <div className="form-group">
            <label htmlFor="editRoleName">Role Name *</label>
            <Input
              id="editRoleName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter role name"
              status={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="editRoleDescription">Description *</label>
            <Input.TextArea
              id="editRoleDescription"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter role description"
              rows={3}
              status={errors.description ? 'error' : ''}
            />
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>

          <div className="form-group">
            <label>Permissions *</label>
            {renderPermissionsForm()}
          </div>
        </div>
      </Modal>

      {/* View Role Modal */}
      <Modal
        title="Role Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
        destroyOnClose
      >
        {selectedRole && (
          <div className="role-details">
            <div className="detail-group">
              <label>Role Name</label>
              <p className="detail-value">{selectedRole.name}</p>
            </div>

            <div className="detail-group">
              <label>Description</label>
              <p className="detail-value">{selectedRole.description}</p>
            </div>

            <div className="detail-group">
              <label>Status</label>
              <div className="status-badge">
                <Switch checked={selectedRole.isActive} disabled size="small" />
                <span>{selectedRole.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>

            <div className="detail-group">
              <label>Permissions ({selectedRole.permissions.length})</label>
              <div className="permissions-detail">
                {renderPermissionsList(selectedRole.permissions)}
              </div>
            </div>

            <div className="detail-group">
              <label>Created</label>
              <p className="detail-value">
                {new Date(selectedRole.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="detail-group">
              <label>Last Updated</label>
              <p className="detail-value">
                {new Date(selectedRole.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Roles;
