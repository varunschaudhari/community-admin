import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
    Card,
    Table,
    Input,
    Button,
    Select,
    message,
    Row,
    Col,
    Avatar,
    Tag,
    Badge,
    Space,
    Typography,
    Tree,
    Modal,
    Descriptions,
    Divider,
    Tooltip
} from 'antd';
import {
    SearchOutlined,
    UserOutlined,
    TeamOutlined,
    HeartOutlined,
    UserAddOutlined,
    PhoneOutlined,
    MailOutlined,
    CalendarOutlined,
    EyeOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { userManagementService, User } from '../../services/UserManagementService';
import './FamilyTree.css';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

interface FamilyMember extends User {
    relationship?: string;
    generation?: number;
}

interface FamilyTreeData {
    user: User;
    familyMembers: FamilyMember[];
    relationships: {
        parents: {
            father?: User;
            mother?: User;
        };
        spouse?: User;
        children: any[];
        marriages: any[];
    };
}

const FamilyTree: React.FC = () => {
    const { isDark } = useTheme();
    const [familyTrees, setFamilyTrees] = useState<FamilyTreeData[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [treeData, setTreeData] = useState<any[]>([]);

    useEffect(() => {
        fetchFamilyTrees();
    }, []);

    const fetchFamilyTrees = async () => {
        setLoading(true);
        try {
            // Get all users first
            const usersResponse = await userManagementService.getAllUsers();
            const users = usersResponse.data;

            // For demo purposes, create family trees for users with family data
            const familyTreesData: FamilyTreeData[] = users
                .filter(user => user.fatherDetails || user.motherDetails || (user.marriages && user.marriages.length > 0))
                .map(user => ({
                    user,
                    familyMembers: users.filter(member =>
                        member._id !== user._id && (
                            member.fatherDetails?.fatherName === user.firstName ||
                            member.motherDetails?.motherName === user.firstName ||
                            (user.marriages && user.marriages.some(marriage => marriage.spouseName === member.firstName))
                        )
                    ),
                    relationships: {
                        parents: {
                            father: users.find(member =>
                                member.firstName === user.fatherDetails?.fatherName
                            ),
                            mother: users.find(member =>
                                member.firstName === user.motherDetails?.motherName
                            )
                        },
                        spouse: user.marriages && user.marriages[0] ? users.find(member =>
                            member.firstName === user.marriages![0].spouseName
                        ) : undefined,
                        children: user.children || [],
                        marriages: user.marriages || []
                    }
                }));

            setFamilyTrees(familyTreesData);
        } catch (error) {
            message.error('Failed to fetch family trees');
            console.error('Fetch family trees error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewFamilyTree = (user: User) => {
        setSelectedUser(user);
        setViewModalVisible(true);
        buildTreeData(user);
    };

    const buildTreeData = (user: User) => {
        const familyTree = familyTrees.find(ft => ft.user._id === user._id);
        if (!familyTree) return;

        const treeNodes: any[] = [];

        // Add parents
        if (familyTree.relationships.parents.father || familyTree.relationships.parents.mother) {
            const parentsNode = {
                title: 'Parents',
                key: 'parents',
                children: [] as any[]
            };

            if (familyTree.relationships.parents.father) {
                parentsNode.children.push({
                    title: (
                        <div className="tree-node">
                            <Avatar size="small" icon={<UserOutlined />} />
                            <span>{familyTree.relationships.parents.father.firstName} {familyTree.relationships.parents.father.lastName}</span>
                            <Tag color="blue">Father</Tag>
                        </div>
                    ),
                    key: `father-${familyTree.relationships.parents.father._id}`
                });
            }

            if (familyTree.relationships.parents.mother) {
                parentsNode.children.push({
                    title: (
                        <div className="tree-node">
                            <Avatar size="small" icon={<UserOutlined />} />
                            <span>{familyTree.relationships.parents.mother.firstName} {familyTree.relationships.parents.mother.lastName}</span>
                            <Tag color="pink">Mother</Tag>
                        </div>
                    ),
                    key: `mother-${familyTree.relationships.parents.mother._id}`
                });
            }

            treeNodes.push(parentsNode);
        }

        // Add current user
        const userNode = {
            title: (
                <div className="tree-node current-user">
                    <Avatar size="small" icon={<UserOutlined />} />
                    <span>{user.firstName} {user.lastName}</span>
                    <Tag color="green">Current User</Tag>
                </div>
            ),
            key: `user-${user._id}`,
            children: [] as any[]
        };

        // Add spouse
        if (familyTree.relationships.spouse) {
            userNode.children.push({
                title: (
                    <div className="tree-node">
                        <Avatar size="small" icon={<HeartOutlined />} />
                        <span>{familyTree.relationships.spouse.firstName} {familyTree.relationships.spouse.lastName}</span>
                        <Tag color="red">Spouse</Tag>
                    </div>
                ),
                key: `spouse-${familyTree.relationships.spouse._id}`
            });
        }

        // Add children
        if (familyTree.relationships.children.length > 0) {
            const childrenNode = {
                title: 'Children',
                key: 'children',
                children: familyTree.relationships.children.map((child: any, index: number) => ({
                    title: (
                        <div className="tree-node">
                            <Avatar size="small" icon={<UserOutlined />} />
                            <span>{child.name || `Child ${index + 1}`}</span>
                            <Tag color="orange">Child</Tag>
                        </div>
                    ),
                    key: `child-${index}`
                }))
            };
            userNode.children.push(childrenNode);
        }

        treeNodes.push(userNode);
        setTreeData(treeNodes);
    };

    const columns = [
        {
            title: 'User',
            key: 'user',
            render: (record: FamilyTreeData) => (
                <div className="user-info">
                    <Avatar icon={<UserOutlined />} />
                    <div className="user-details">
                        <div className="user-name">
                            {record.user.firstName} {record.user.lastName}
                        </div>
                        <div className="user-email">{record.user.email}</div>
                    </div>
                </div>
            )
        },
        {
            title: 'Family Members',
            key: 'familyMembers',
            render: (record: FamilyTreeData) => (
                <div className="family-members">
                    <Badge count={record.familyMembers.length} showZero>
                        <TeamOutlined />
                    </Badge>
                    <span className="member-count">
                        {record.familyMembers.length} members
                    </span>
                </div>
            )
        },
        {
            title: 'Parents',
            key: 'parents',
            render: (record: FamilyTreeData) => (
                <div className="parents-info">
                    {record.relationships.parents.father && (
                        <Tag color="blue">Father: {record.relationships.parents.father.firstName}</Tag>
                    )}
                    {record.relationships.parents.mother && (
                        <Tag color="pink">Mother: {record.relationships.parents.mother.firstName}</Tag>
                    )}
                    {!record.relationships.parents.father && !record.relationships.parents.mother && (
                        <Text type="secondary">No parent info</Text>
                    )}
                </div>
            )
        },
        {
            title: 'Spouse',
            key: 'spouse',
            render: (record: FamilyTreeData) => (
                <div>
                    {record.relationships.spouse ? (
                        <Tag color="red">{record.relationships.spouse.firstName} {record.relationships.spouse.lastName}</Tag>
                    ) : (
                        <Text type="secondary">No spouse</Text>
                    )}
                </div>
            )
        },
        {
            title: 'Children',
            key: 'children',
            render: (record: FamilyTreeData) => (
                <div>
                    <Badge count={record.relationships.children.length} showZero>
                        <UserAddOutlined />
                    </Badge>
                    <span className="children-count">
                        {record.relationships.children.length} children
                    </span>
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: FamilyTreeData) => (
                <Space>
                    <Tooltip title="View Family Tree">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => handleViewFamilyTree(record.user)}
                        >
                            View Tree
                        </Button>
                    </Tooltip>
                </Space>
            )
        }
    ];

    const filteredFamilyTrees = familyTrees.filter(ft =>
        ft.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ft.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ft.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`family-tree-page ${isDark ? 'dark-theme' : ''}`}>
            {/* Page Header */}
            <div className="page-header">
                <div className="header-content">
                    <Title level={2} className="page-title">
                        <TeamOutlined /> Family Trees
                    </Title>
                    <Text className="page-subtitle">
                        View and manage family relationships across the community
                    </Text>
                </div>
                <div className="header-actions">
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchFamilyTrees}
                        loading={loading}
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <Card className="search-card" style={{ marginBottom: 24 }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Search
                            placeholder="Search family trees by name or email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col span={6}>
                        <Select
                            placeholder="Filter by generation"
                            style={{ width: '100%' }}
                            allowClear
                        >
                            <Option value="1">1st Generation</Option>
                            <Option value="2">2nd Generation</Option>
                            <Option value="3">3rd Generation</Option>
                        </Select>
                    </Col>
                    <Col span={6}>
                        <Button
                            icon={<PlusOutlined />}
                            type="primary"
                            style={{ width: '100%' }}
                        >
                            Add Family Member
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Family Trees Table */}
            <Card className="family-trees-card">
                <Table
                    columns={columns}
                    dataSource={filteredFamilyTrees}
                    rowKey={(record) => record.user._id}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} family trees`
                    }}
                    scroll={{ x: 800 }}
                />
            </Card>

            {/* Family Tree Modal */}
            <Modal
                title={`Family Tree - ${selectedUser?.firstName} ${selectedUser?.lastName}`}
                open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                width={800}
                footer={null}
                className="family-tree-modal"
            >
                <div className="family-tree-content">
                    <Row gutter={16}>
                        <Col span={24}>
                            <Card title="Family Tree Structure" size="small">
                                <Tree
                                    treeData={treeData}
                                    defaultExpandAll
                                    showLine
                                    showIcon
                                />
                            </Card>
                        </Col>
                    </Row>

                    {selectedUser && (
                        <Row gutter={16} style={{ marginTop: 16 }}>
                            <Col span={12}>
                                <Card title="User Details" size="small">
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="Name">
                                            {selectedUser.firstName} {selectedUser.lastName}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Email">
                                            {selectedUser.email}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Phone">
                                            {selectedUser.phone || 'Not provided'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Role">
                                            <Tag color="blue">
                                                {typeof selectedUser.role === 'string' ? selectedUser.role : selectedUser.role.name}
                                            </Tag>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="Family Information" size="small">
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="Father">
                                            {selectedUser.fatherDetails?.fatherName || 'Not specified'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Mother">
                                            {selectedUser.motherDetails?.motherName || 'Not specified'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Spouse">
                                            {selectedUser.marriages?.[0]?.spouseName || 'Not married'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Children">
                                            {selectedUser.children?.length || 0} children
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default FamilyTree;
