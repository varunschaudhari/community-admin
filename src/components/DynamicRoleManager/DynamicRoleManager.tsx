import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Tag,
    Select,
    Button,
    message,
    Space,
    Typography,
    Row,
    Col,
    Statistic,
    Input,
    Modal,
    Form,
    Checkbox,
    Divider,
    Tooltip,
    Badge
} from 'antd';
import {
    UserOutlined,
    EditOutlined,
    SearchOutlined,
    ReloadOutlined,
    PlusOutlined,
    SettingOutlined,
    EyeOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { userManagementService, User, Role } from '../../services/UserManagementService';
import './DynamicRoleManager.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface RoleStats {
    [key: string]: number;
}

const DynamicRoleManager: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [roleStats, setRoleStats] = useState<RoleStats>({});
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [roleModalVisible, setRoleModalVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [form] = Form.useForm();

    // Available permissions for new modules
    const allPermissions = [
        // User Management
        'users:read', 'users:create', 'users:update', 'users:delete', 'users:manage',
        // Role Management
        'roles:read', 'roles:create', 'roles:update', 'roles:delete',
        // Analytics
        'analytics:read', 'analytics:export',
        // Settings
        'settings:read', 'settings:update',
        // Community
        'community:read', 'community:create', 'community:update', 'community:delete',
        // Events (New Module)
        'events:read', 'events:create', 'events:update', 'events:delete', 'events:manage',
        // Documents (New Module)
        'documents:read', 'documents:create', 'documents:update', 'documents:delete', 'documents:share',
        // Notifications (New Module)
        'notifications:read', 'notifications:create', 'notifications:update', 'notifications:delete',
        // Reports (New Module)
        'reports:read', 'reports:create', 'reports:export', 'reports:schedule',
        // Finance (New Module)
        'finance:read', 'finance:create', 'finance:update', 'finance:delete', 'finance:approve'
    ];

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userManagementService.getAllUsers();
            const usersData = response.data || [];
            setUsers(usersData);
            calculateRoleStats(usersData);
        } catch (error) {
            message.error('Failed to fetch users');
            console.error('Fetch users error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await userManagementService.getAllRoles();
            const rolesData = response.data || [];
            setAvailableRoles(rolesData);
        } catch (error) {
            message.error('Failed to fetch roles');
            console.error('Fetch roles error:', error);
        }
    };

    const calculateRoleStats = (usersData: User[]) => {
        const stats: RoleStats = {};
        usersData.forEach(user => {
            const roleName = typeof user.role === 'string' ? user.role : user.role.name;
            stats[roleName] = (stats[roleName] || 0) + 1;
        });
        setRoleStats(stats);
    };

    const handleRoleUpdate = async (userId: string, roleId: string) => {
        try {
            await userManagementService.updateUserRole(userId, roleId);
            message.success('User role updated successfully');
            fetchUsers();
        } catch (error) {
            message.error('Failed to update user role');
            console.error('Update role error:', error);
        }
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setEditModalVisible(true);
    };

    const handleCreateRole = () => {
        setSelectedRole(null);
        form.resetFields();
        setRoleModalVisible(true);
    };

    const handleEditRole = (role: Role) => {
        setSelectedRole(role);
        form.setFieldsValue({
            name: role.name,
            description: role.description,
            permissions: role.permissions
        });
        setRoleModalVisible(true);
    };

    const handleRoleSubmit = async (values: any) => {
        try {
            // This would call a create/update role API
            message.success(selectedRole ? 'Role updated successfully' : 'Role created successfully');
            setRoleModalVisible(false);
            fetchRoles();
        } catch (error) {
            message.error('Failed to save role');
            console.error('Save role error:', error);
        }
    };

    const getRoleColor = (role: string) => {
        const colors: { [key: string]: string } = {
            'Super Admin': 'red',
            'Admin': 'orange',
            'Moderator': 'blue',
            'Member': 'green',
            'Guest': 'gray'
        };
        return colors[role] || 'default';
    };

    const getPermissionCategory = (permission: string) => {
        const category = permission.split(':')[0];
        const categories: { [key: string]: string } = {
            'users': 'User Management',
            'roles': 'Role Management',
            'analytics': 'Analytics',
            'settings': 'Settings',
            'community': 'Community',
            'events': 'Events',
            'documents': 'Documents',
            'notifications': 'Notifications',
            'reports': 'Reports',
            'finance': 'Finance'
        };
        return categories[category] || 'Other';
    };

    const filteredUsers = users.filter(user => {
        const roleName = typeof user.role === 'string' ? user.role : user.role.name;

        const matchesSearch = !searchQuery ||
            user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = !roleFilter || roleName === roleFilter;

        return matchesSearch && matchesRole;
    });

    const columns = [
        {
            title: 'User',
            key: 'user',
            render: (record: User) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>
                        {record.firstName} {record.lastName}
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.email}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Current Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string | Role) => {
                const roleName = typeof role === 'string' ? role : role.name;
                const roleObj = typeof role === 'object' ? role : availableRoles.find(r => r.name === roleName);
                return (
                    <div>
                        <Tag color={getRoleColor(roleName)}>
                            {roleName}
                        </Tag>
                        {roleObj && (
                            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                {roleObj.permissions.length} permissions
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Status',
            key: 'status',
            render: (record: User) => (
                <Space>
                    <Tag color={record.verified ? 'green' : 'red'}>
                        {record.verified ? 'Verified' : 'Unverified'}
                    </Tag>
                    <Tag color={record.isActive ? 'blue' : 'gray'}>
                        {record.isActive ? 'Active' : 'Inactive'}
                    </Tag>
                </Space>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: User) => {
                const currentRoleId = typeof record.role === 'string' ? record.roleId : record.role._id;
                return (
                    <Space>
                        <Select
                            value={currentRoleId}
                            style={{ width: 120 }}
                            size="small"
                            onChange={(value) => handleRoleUpdate(record._id, value)}
                        >
                            {availableRoles.map(role => (
                                <Option key={role._id} value={role._id}>
                                    {role.name}
                                </Option>
                            ))}
                        </Select>
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEditUser(record)}
                            size="small"
                        />
                    </Space>
                );
            },
        },
    ];

    return (
        <div className="dynamic-role-manager">
            <div className="page-header">
                <Title level={2}>
                    <SettingOutlined /> Dynamic Role Management
                </Title>
                <Text type="secondary">
                    Fully dynamic role system - create any roles you want and easily add new modules
                </Text>
            </div>

            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Users"
                            value={users.length}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Available Roles"
                            value={availableRoles.length}
                            prefix={<SettingOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Permissions"
                            value={allPermissions.length}
                            prefix={<EyeOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Active Modules"
                            value={new Set(allPermissions.map(p => p.split(':')[0])).size}
                            prefix={<PlusOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Role Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                {availableRoles.map(role => (
                    <Col span={4} key={role._id}>
                        <Card>
                            <Statistic
                                title={role.name}
                                value={roleStats[role.name] || 0}
                                valueStyle={{
                                    color: getRoleColor(role.name) === 'red' ? '#cf1322' :
                                        getRoleColor(role.name) === 'orange' ? '#d46b08' :
                                            getRoleColor(role.name) === 'blue' ? '#1890ff' :
                                                getRoleColor(role.name) === 'green' ? '#52c41a' : '#8c8c8c'
                                }}
                            />
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                {role.permissions.length} permissions
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Controls */}
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                    <Col span={8}>
                        <Search
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col span={6}>
                        <Select
                            placeholder="Filter by role"
                            value={roleFilter}
                            onChange={setRoleFilter}
                            style={{ width: '100%' }}
                            allowClear
                        >
                            {availableRoles.map(role => (
                                <Option key={role._id} value={role.name}>
                                    {role.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={fetchUsers}
                            loading={loading}
                        >
                            Refresh
                        </Button>
                    </Col>
                    <Col span={6}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleCreateRole}
                        >
                            Create New Role
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Users Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} users`,
                    }}
                />
            </Card>

            {/* Edit User Modal */}
            <Modal
                title="Edit User Role"
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
            >
                {selectedUser && (
                    <div>
                        <p><strong>User:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Current Role:</strong>
                            <Tag color={getRoleColor(typeof selectedUser.role === 'string' ? selectedUser.role : selectedUser.role.name)} style={{ marginLeft: 8 }}>
                                {typeof selectedUser.role === 'string' ? selectedUser.role : selectedUser.role.name}
                            </Tag>
                        </p>
                        <div style={{ marginTop: 16 }}>
                            <Text strong>Change Role:</Text>
                            <Select
                                value={typeof selectedUser.role === 'string' ? selectedUser.roleId : selectedUser.role._id}
                                style={{ width: '100%', marginTop: 8 }}
                                onChange={(value) => {
                                    handleRoleUpdate(selectedUser._id, value);
                                    setEditModalVisible(false);
                                }}
                            >
                                {availableRoles.map(role => (
                                    <Option key={role._id} value={role._id}>
                                        {role.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Create/Edit Role Modal */}
            <Modal
                title={selectedRole ? 'Edit Role' : 'Create New Role'}
                open={roleModalVisible}
                onCancel={() => setRoleModalVisible(false)}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleRoleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Role Name"
                        rules={[{ required: true, message: 'Please enter role name' }]}
                    >
                        <Input placeholder="e.g., Event Manager, Document Admin" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter role description' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Describe what this role can do" />
                    </Form.Item>

                    <Form.Item
                        name="permissions"
                        label="Permissions"
                        rules={[{ required: true, message: 'Please select at least one permission' }]}
                    >
                        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #d9d9d9', padding: '12px', borderRadius: '6px' }}>
                            {Object.entries(
                                allPermissions.reduce((acc, permission) => {
                                    const category = getPermissionCategory(permission);
                                    if (!acc[category]) acc[category] = [];
                                    acc[category].push(permission);
                                    return acc;
                                }, {} as { [key: string]: string[] })
                            ).map(([category, permissions]) => (
                                <div key={category} style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ color: '#1890ff' }}>{category}</Text>
                                    <Divider style={{ margin: '8px 0' }} />
                                    <Checkbox.Group>
                                        <Row>
                                            {permissions.map(permission => (
                                                <Col span={12} key={permission}>
                                                    <Checkbox value={permission}>
                                                        {permission}
                                                    </Checkbox>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Checkbox.Group>
                                </div>
                            ))}
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {selectedRole ? 'Update Role' : 'Create Role'}
                            </Button>
                            <Button onClick={() => setRoleModalVisible(false)}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DynamicRoleManager;
