import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SaveOutlined,
  UserOutlined,
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined
} from '@ant-design/icons';
import {
  Modal,
  Button,
  Switch,
  Checkbox,
  Input,
  message,
  Popconfirm,
  Tooltip,
  Tabs,
  Table,
  Tag,
  Select,
  Space,
  Row,
  Col,
  Statistic,
  Card
} from 'antd';
import { ERRORS, SUCCESS } from '../../constants/strings';
import { roleService } from '../../services/RoleService';
import { userManagementService, User } from '../../services/UserManagementService';
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

const { Option } = Select;
const { Search } = Input;

interface RoleStats {
  [key: string]: number;
}

const Roles: React.FC = () => {
  const { theme, isDark } = useTheme();
  // Role management state
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

  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [roleStats, setRoleStats] = useState<RoleStats>({});
  const [errors, setErrors] = useState<Record<string, string>>({});


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
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await roleService.getAllRoles();
      setRoles(response.data || []);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      message.error('Failed to fetch roles. Please check your authentication and try again.');
      setRoles([]);
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

  // User management functions
  const fetchUsers = async () => {
    try {
      const response = await userManagementService.getAllUsers();
      setUsers(response.data || []);
      calculateRoleStats(response.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.error('Failed to fetch users');
    }
  };

  const calculateRoleStats = (userList: User[]) => {
    const stats: RoleStats = {};
    userList.forEach(user => {
      const roleName = typeof user.role === 'object' && user.role?.name ? user.role.name : 'No Role';
      stats[roleName] = (stats[roleName] || 0) + 1;
    });
    setRoleStats(stats);
  };

  const handleUserRoleChange = async (userId: string, newRoleId: string) => {
    try {
      await userManagementService.updateUserRole(userId, newRoleId);
      message.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user role:', error);
      message.error('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery ||
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const userRoleName = typeof user.role === 'object' && user.role?.name ? user.role.name : 'No Role';
    const matchesRole = !roleFilter || userRoleName === roleFilter;

    return matchesSearch && matchesRole;
  });

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

  // User table columns
  const userColumns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (text: string, record: User) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Current Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: any) => {
        const roleName = typeof role === 'object' && role?.name ? role.name : 'No Role';
        return (
          <Tag color={roleName === 'Super Admin' ? 'red' : roleName === 'Admin' ? 'blue' : 'green'}>
            {roleName}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: User) => (
        <Space>
          <Select
            value={typeof record.role === 'object' && record.role?._id ? record.role._id : ''}
            style={{ width: 150 }}
            onChange={(value) => handleUserRoleChange(record._id, value)}
            placeholder="Select Role"
          >
            {roles.map(role => (
              <Option key={role.id} value={role.id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Space>
      ),
    },
  ];

  return (
    <div className="roles-page">
      <div className="roles-header">
        <div className="header-content">
          <h1 className="page-title">Role Management</h1>
          <p className="page-subtitle">Manage user roles and permissions for the community</p>
        </div>
      </div>

      <div className="roles-content">
        <Tabs defaultActiveKey="roles" type="card">
          {/* Role Management Tab */}
          <Tabs.TabPane tab={<span><SettingOutlined />Role Management</span>} key="roles">
            <div className="tab-header">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openCreateModal}
                className="create-role-btn"
              >
                Create New Role
              </Button>
            </div>

            {/* Statistics Section */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic title="Total Roles" value={roles.length} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Total Users" value={users.length} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Active Roles" value={roles.filter(r => r.isActive).length} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Roles with Members" value={Object.keys(roleStats).length} />
                </Card>
              </Col>
            </Row>

            {/* Roles Table */}
            <Card title="Available Roles" extra={<span>{roles.length} roles</span>}>
              <Table
                dataSource={roles}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                columns={[
                  {
                    title: 'Role Name',
                    dataIndex: 'name',
                    key: 'name',
                    render: (text: string) => <strong>{text}</strong>,
                  },
                  {
                    title: 'Description',
                    dataIndex: 'description',
                    key: 'description',
                  },
                  {
                    title: 'Members',
                    dataIndex: 'memberCount',
                    key: 'memberCount',
                    render: (count: number) => count || 0,
                  },
                  {
                    title: 'Status',
                    dataIndex: 'isActive',
                    key: 'isActive',
                    render: (isActive: boolean) => (
                      <Tag color={isActive ? 'green' : 'red'}>
                        {isActive ? 'Active' : 'Inactive'}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Actions',
                    key: 'actions',
                    render: (text: string, record: Role) => (
                      <Space>
                        <Tooltip title="View Details">
                          <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => openViewModal(record)}
                          />
                        </Tooltip>
                        <Tooltip title="Edit Role">
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openEditModal(record)}
                          />
                        </Tooltip>
                        <Popconfirm
                          title="Are you sure you want to delete this role?"
                          onConfirm={() => handleDeleteRole(record.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Tooltip title="Delete Role">
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                            />
                          </Tooltip>
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]}
              />
            </Card>
          </Tabs.TabPane>

          {/* User Role Assignment Tab */}
          <Tabs.TabPane tab={<span><UserOutlined />User Role Assignment</span>} key="users">
            <div className="tab-header">
              <Space>
                <Search
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: 300 }}
                  prefix={<SearchOutlined />}
                />
                <Select
                  placeholder="Filter by role"
                  value={roleFilter}
                  onChange={setRoleFilter}
                  style={{ width: 200 }}
                  allowClear
                >
                  {roles.map(role => (
                    <Option key={role.id} value={role.name}>
                      {role.name}
                    </Option>
                  ))}
                </Select>
                <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
                  Refresh
                </Button>
              </Space>
            </div>

            {/* User Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              {Object.entries(roleStats).map(([roleName, count]) => (
                <Col span={6} key={roleName}>
                  <Card>
                    <Statistic title={roleName} value={count} />
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Users Table */}
            <Card title="User Role Assignment" extra={<span>{filteredUsers.length} users</span>}>
              <Table
                dataSource={filteredUsers}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                columns={userColumns}
              />
            </Card>
          </Tabs.TabPane>
        </Tabs>
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
