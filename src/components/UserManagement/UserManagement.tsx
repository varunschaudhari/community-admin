import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
    Table,
    Input,
    Button,
    Select,
    Switch,
    Modal,
    message,
    Popconfirm,
    Tooltip,
    Badge,
    Card,
    Row,
    Col,
    Statistic,
    Avatar,
    Tag,
    Space,
    Dropdown,
    Menu
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    MoreOutlined,
    ExportOutlined,
    ReloadOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { userManagementService, User, UserStats } from '../../services/UserManagementService';
import { roleService } from '../../services/RoleService';
import UserDetail from './UserDetail';
import './UserManagement.css';

const { Search } = Input;
const { Option } = Select;

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    isActive: boolean;
    isSystem: boolean;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

const UserManagement: React.FC = () => {
    const { theme, isDark } = useTheme();
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [verifiedFilter, setVerifiedFilter] = useState<boolean | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [showUserDetail, setShowUserDetail] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    useEffect(() => {
        fetchUsers();
        fetchRoles();
        fetchStats();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [pagination.current, pagination.pageSize, searchQuery, roleFilter, verifiedFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userManagementService.searchUsers({
                query: searchQuery,
                role: roleFilter,
                verified: verifiedFilter !== null ? verifiedFilter : undefined,
                page: pagination.current,
                limit: pagination.pageSize
            });

            setUsers(response.data);
            setPagination(prev => ({
                ...prev,
                total: response.pagination?.total || 0
            }));
        } catch (error) {
            message.error('Failed to fetch users');
            console.error('Fetch users error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await roleService.getAllRoles();
            setRoles((response.data || []) as Role[]);
        } catch (error) {
            console.error('Fetch roles error:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await userManagementService.getUserStats();
            setStats(response.data);
        } catch (error) {
            console.error('Fetch stats error:', error);
        }
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleRoleFilter = (value: string) => {
        setRoleFilter(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleVerifiedFilter = (value: boolean | null) => {
        setVerifiedFilter(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleTableChange = (pagination: any) => {
        setPagination(prev => ({
            ...prev,
            current: pagination.current,
            pageSize: pagination.pageSize
        }));
    };

    const handleViewUser = (user: User) => {
        setSelectedUser(user);
        setShowUserDetail(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setEditModalVisible(true);
    };

    const handleUpdateUserRole = async (userId: string, role: string) => {
        try {
            await userManagementService.updateUserRole(userId, role);
            message.success('User role updated successfully');
            fetchUsers();
            fetchStats();
        } catch (error) {
            message.error('Failed to update user role');
            console.error('Update user role error:', error);
        }
    };

    const handleToggleVerification = async (userId: string) => {
        try {
            await userManagementService.toggleUserVerification(userId);
            message.success('User verification status updated');
            fetchUsers();
            fetchStats();
        } catch (error) {
            message.error('Failed to update verification status');
            console.error('Toggle verification error:', error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            await userManagementService.deleteUser(userId);
            message.success('User deleted successfully');
            fetchUsers();
            fetchStats();
        } catch (error) {
            message.error('Failed to delete user');
            console.error('Delete user error:', error);
        }
    };

    const handleUserDetailBack = () => {
        setShowUserDetail(false);
        setSelectedUser(null);
    };

    const handleUserUpdated = () => {
        fetchUsers();
        fetchStats();
        setShowUserDetail(false);
        setSelectedUser(null);
    };

    const handleUserDeleted = () => {
        fetchUsers();
        fetchStats();
        setShowUserDetail(false);
        setSelectedUser(null);
    };

    const handleExportUsers = async () => {
        try {
            const blob = await userManagementService.exportUsers();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'users-export.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            message.success('Users exported successfully');
        } catch (error) {
            message.error('Failed to export users');
            console.error('Export users error:', error);
        }
    };

    const getRoleColor = (roleName: string) => {
        switch (roleName) {
            case 'Super Admin': return 'red';
            case 'Admin': return 'orange';
            case 'Moderator': return 'blue';
            case 'Member': return 'green';
            case 'Guest': return 'default';
            default: return 'default';
        }
    };

    const columns = [
        {
            title: 'User',
            key: 'user',
            render: (user: User) => (
                <div className="user-info">
                    <Avatar icon={<UserOutlined />} className="user-avatar" />
                    <div className="user-details">
                        <div className="user-name">{user.firstName} {user.lastName}</div>
                        <div className="user-username">@{user.username}</div>
                    </div>
                </div>
            ),
            width: 200
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email: string) => (
                <Tooltip title={email}>
                    <span className="email-text">{email}</span>
                </Tooltip>
            )
        },
        {
            title: 'Role',
            key: 'role',
            render: (user: User) => {
                const roleName = typeof user.role === 'string' ? user.role : user.role.name;
                return (
                    <Tag color={getRoleColor(roleName)}>
                        {roleName}
                    </Tag>
                );
            },
            width: 120
        },
        {
            title: 'Status',
            key: 'status',
            render: (user: User) => (
                <Space>
                    <Badge
                        status={user.verified ? 'success' : 'error'}
                        text={user.verified ? 'Verified' : 'Unverified'}
                    />
                </Space>
            ),
            width: 120
        },
        {
            title: 'Joined',
            key: 'createdAt',
            render: (user: User) => (
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            ),
            width: 100
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (user: User) => (
                <Space onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewUser(user)}
                            className="action-btn"
                        />
                    </Tooltip>
                    <Tooltip title="Edit User">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEditUser(user)}
                            className="action-btn"
                        />
                    </Tooltip>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item
                                    key="role"
                                    onClick={() => {
                                        // Role selection modal logic
                                    }}
                                >
                                    Change Role
                                </Menu.Item>
                                <Menu.Item
                                    key="verification"
                                    onClick={() => handleToggleVerification(user._id)}
                                >
                                    {user.verified ? 'Unverify' : 'Verify'}
                                </Menu.Item>
                                {user.role !== 'Super Admin' && user.role !== 'Admin' && (
                                    <Menu.Item
                                        key="delete"
                                        danger
                                        onClick={() => handleDeleteUser(user._id)}
                                    >
                                        Delete User
                                    </Menu.Item>
                                )}
                            </Menu>
                        }
                        trigger={['click']}
                    >
                        <Button type="text" icon={<MoreOutlined />} className="action-btn" />
                    </Dropdown>
                </Space>
            ),
            width: 120
        }
    ];

    // Show UserDetail component if a user is selected
    if (showUserDetail && selectedUser) {
        return (
            <UserDetail
                user={selectedUser}
                onBack={handleUserDetailBack}
                onUserUpdated={handleUserUpdated}
                onUserDeleted={handleUserDeleted}
            />
        );
    }

    return (
        <div className={`user-management-page ${isDark ? 'dark-theme' : ''}`}>
            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">User Management</h1>
                    <p className="page-subtitle">Manage all users in the community</p>
                </div>
                <div className="header-actions">
                    <Button
                        icon={<ExportOutlined />}
                        onClick={handleExportUsers}
                        className="export-btn"
                    >
                        Export
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchUsers}
                        className="refresh-btn"
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div className="stats-section">
                    <Row gutter={16}>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Total Users"
                                    value={stats.total}
                                    prefix={<UserOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Verified Users"
                                    value={stats.verified}
                                    prefix={<CheckCircleOutlined />}
                                    valueStyle={{ color: '#3f8600' }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Admins"
                                    value={stats.admins}
                                    prefix={<UserOutlined />}
                                    valueStyle={{ color: '#cf1322' }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Recent (7 days)"
                                    value={stats.recent}
                                    prefix={<UserOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            )}

            {/* Filters */}
            <div className="filters-section">
                <Row gutter={16} align="middle">
                    <Col span={8}>
                        <Search
                            placeholder="Search users..."
                            allowClear
                            onSearch={handleSearch}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={4}>
                        <Select
                            placeholder="Filter by role"
                            allowClear
                            style={{ width: '100%' }}
                            onChange={handleRoleFilter}
                        >
                            {roles.map(role => (
                                <Option key={role.id} value={role.name}>
                                    {role.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Select
                            placeholder="Verification status"
                            allowClear
                            style={{ width: '100%' }}
                            onChange={handleVerifiedFilter}
                        >
                            <Option value={true}>Verified</Option>
                            <Option value={false}>Unverified</Option>
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Space>
                            <Button
                                icon={<FilterOutlined />}
                                onClick={() => {
                                    setSearchQuery('');
                                    setRoleFilter('');
                                    setVerifiedFilter(null);
                                    setPagination(prev => ({ ...prev, current: 1 }));
                                }}
                            >
                                Clear Filters
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </div>

            {/* Users Table */}
            <div className="table-section">
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} users`
                    }}
                    onChange={handleTableChange}
                    className="users-table"
                    onRow={(record) => ({
                        onClick: () => handleViewUser(record),
                        style: { cursor: 'pointer' }
                    })}
                />
            </div>

        </div>
    );
};

export default UserManagement;
