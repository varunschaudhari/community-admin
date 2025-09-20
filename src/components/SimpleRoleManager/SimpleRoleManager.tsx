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
    Modal
} from 'antd';
import {
    UserOutlined,
    EditOutlined,
    SearchOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { userManagementService, User, Role } from '../../services/UserManagementService';
import './SimpleRoleManager.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface RoleStats {
    [key: string]: number;
}

const SimpleRoleManager: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [roleStats, setRoleStats] = useState<RoleStats>({});
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);

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
                return (
                    <Tag color={getRoleColor(roleName)}>
                        {roleName}
                    </Tag>
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
        <div className="simple-role-manager">
            <div className="page-header">
                <Title level={2}>
                    <UserOutlined /> Simple Role Management
                </Title>
                <Text type="secondary">
                    Manage user roles with a simple, streamlined interface
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
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Filters */}
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
        </div>
    );
};

export default SimpleRoleManager;
