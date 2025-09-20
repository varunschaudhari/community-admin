import React, { useState, useEffect } from 'react';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Tabs,
  Table,
  Statistic,
  Row,
  Col,
  Space,
  Divider,
  Typography,
  Avatar,
  Badge,
  Tooltip
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  LockOutlined,
  TeamOutlined,
  HeartOutlined,
  UserAddOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { userProfileService, UserProfile, FamilyTree, UserAnalytics } from '../../services/UserProfileService';
import './UserProfile.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface UserProfileProps {
  userId: string;
  onClose?: () => void;
  isModal?: boolean;
}

const UserProfileComponent: React.FC<UserProfileProps> = ({ userId, onClose, isModal = false }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [familyTree, setFamilyTree] = useState<FamilyTree | null>(null);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [userData, familyData, analyticsData] = await Promise.all([
        userProfileService.getUserProfile(userId),
        userProfileService.getUserFamilyTree(userId),
        userProfileService.getUserAnalytics(userId)
      ]);

      setUser(userData);
      setFamilyTree(familyData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading user data:', error);
      message.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (values: any) => {
    try {
      const updatedUser = await userProfileService.updateUserProfile(userId, values);
      setUser(updatedUser);
      setEditModalVisible(false);
      message.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    }
  };

  const handleChangePassword = async (values: any) => {
    try {
      await userProfileService.changePassword(userId, values);
      setPasswordModalVisible(false);
      passwordForm.resetFields();
      message.success('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      message.error('Failed to change password');
    }
  };

  const handleVerifyUser = async (isVerified: boolean) => {
    try {
      const updatedUser = await userProfileService.verifyUser(userId, isVerified);
      setUser(updatedUser);
      message.success(`User ${isVerified ? 'verified' : 'unverified'} successfully`);
    } catch (error) {
      console.error('Error updating verification status:', error);
      message.error('Failed to update verification status');
    }
  };

  const handleToggleStatus = async (isActive: boolean) => {
    try {
      const updatedUser = await userProfileService.toggleUserStatus(userId, isActive);
      setUser(updatedUser);
      message.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      message.error('Failed to update user status');
    }
  };

  const getRoleColor = (roleName: string) => {
    const colors: { [key: string]: string } = {
      'Super Admin': 'red',
      'Admin': 'orange',
      'Moderator': 'blue',
      'Member': 'green',
      'Guest': 'default'
    };
    return colors[roleName] || 'default';
  };

  const getStatusColor = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return 'red';
    if (!isVerified) return 'orange';
    return 'green';
  };

  const getStatusText = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return 'Inactive';
    if (!isVerified) return 'Unverified';
    return 'Active';
  };

  const familyColumns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>{userProfileService.getDisplayName(record)}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: any) => (
        <Tag color={getRoleColor(role?.name)}>
          {role?.name || 'Unknown'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: any) => (
        <Space>
          <Tag color={getStatusColor(record.isActive, record.isVerified)}>
            {getStatusText(record.isActive, record.isVerified)}
          </Tag>
          {record.isVerified && <CheckCircleOutlined style={{ color: 'green' }} />}
        </Space>
      ),
    },
  ];

  const childrenColumns = [
    {
      title: 'Name',
      dataIndex: 'childName',
      key: 'name',
      render: (text: string) => (
        <Space>
          <UserAddOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Relationship',
      dataIndex: 'relationshipType',
      key: 'relationship',
    },
    {
      title: 'Birth Date',
      dataIndex: 'birthDate',
      key: 'birthDate',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
    {
      title: 'From Marriage',
      dataIndex: 'fromWhichMarriage',
      key: 'marriage',
      render: (order: number) => `Marriage #${order}`,
    },
  ];

  const marriageColumns = [
    {
      title: 'Spouse Name',
      dataIndex: 'spouseName',
      key: 'spouse',
      render: (text: string) => (
        <Space>
          <HeartOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Marriage Date',
      dataIndex: 'marriageDate',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'marriageStatus',
      key: 'status',
      render: (status: string, record: any) => (
        <Space>
          <Tag color={status === 'current' ? 'green' : 'default'}>
            {status}
          </Tag>
          {record.isCurrentSpouse && <CheckCircleOutlined style={{ color: 'green' }} />}
        </Space>
      ),
    },
    {
      title: 'Order',
      dataIndex: 'marriageOrder',
      key: 'order',
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const content = (
    <div className="user-profile">
      <div className="user-profile-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Space size="large">
              <Avatar size={64} icon={<UserOutlined />} />
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {userProfileService.getFullName(user)}
                </Title>
                <Text type="secondary">{user.email}</Text>
                <div style={{ marginTop: 8 }}>
                  <Tag color={getRoleColor(user.role.name)}>
                    {user.role.name}
                  </Tag>
                  <Tag color={getStatusColor(user.isActive, user.isVerified)}>
                    {getStatusText(user.isActive, user.isVerified)}
                  </Tag>
                </div>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  editForm.setFieldsValue(user);
                  setEditModalVisible(true);
                }}
              >
                Edit Profile
              </Button>
              <Button
                icon={<LockOutlined />}
                onClick={() => setPasswordModalVisible(true)}
              >
                Change Password
              </Button>
              <Button
                type={user.isVerified ? 'default' : 'primary'}
                icon={user.isVerified ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                onClick={() => handleVerifyUser(!user.isVerified)}
              >
                {user.isVerified ? 'Unverify' : 'Verify'}
              </Button>
              <Button
                type={user.isActive ? 'default' : 'primary'}
                danger={user.isActive}
                onClick={() => handleToggleStatus(!user.isActive)}
              >
                {user.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      <Divider />

      <Tabs defaultActiveKey="profile">
        <TabPane tab="Profile" key="profile">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="Personal Information" size="small">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Full Name">
                    {userProfileService.getFullName(user)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Space>
                      <MailOutlined />
                      {user.email}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    <Space>
                      <PhoneOutlined />
                      {user.phoneNumber}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Role">
                    <Tag color={getRoleColor(user.role.name)}>
                      {user.role.name}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Member Since">
                    <Space>
                      <CalendarOutlined />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Family Information" size="small">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Father">
                    {user.fatherDetails?.fatherName || 'Not specified'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mother">
                    {user.motherDetails?.motherName || 'Not specified'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Current Spouse">
                    {userProfileService.getCurrentSpouse(user)?.spouseName || 'None'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Children">
                    {userProfileService.getChildrenCount(user)} children
                  </Descriptions.Item>
                  <Descriptions.Item label="Marriages">
                    {userProfileService.getMarriageCount(user)} marriages
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Family Tree" key="family">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Family Members" size="small">
                <Table
                  dataSource={familyTree?.familyMembers || []}
                  columns={familyColumns}
                  rowKey="_id"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Children" key="children">
          <Card title="Children" size="small">
            <Table
              dataSource={user.children || []}
              columns={childrenColumns}
              rowKey="childName"
              pagination={false}
              size="small"
            />
          </Card>
        </TabPane>

        <TabPane tab="Marriages" key="marriages">
          <Card title="Marriage History" size="small">
            <Table
              dataSource={user.marriages || []}
              columns={marriageColumns}
              rowKey="marriageOrder"
              pagination={false}
              size="small"
            />
          </Card>
        </TabPane>

        <TabPane tab="Analytics" key="analytics">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card size="small">
                <Statistic
                  title="Family Members"
                  value={analytics?.family.totalFamilyMembers || 0}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic
                  title="Verified Members"
                  value={analytics?.family.verifiedMembers || 0}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic
                  title="Same Role Users"
                  value={analytics?.role.totalUsersWithSameRole || 0}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditProfile}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="middleName"
            label="Middle Name"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Profile
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter current password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter new password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Change Password
              </Button>
              <Button onClick={() => setPasswordModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );

  if (isModal) {
    return (
      <Modal
        title="User Profile"
        open={true}
        onCancel={onClose}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        {content}
      </Modal>
    );
  }

  return content;
};

export default UserProfileComponent;
