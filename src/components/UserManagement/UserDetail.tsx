import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
    Card,
    Avatar,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Switch,
    message,
    Popconfirm,
    Descriptions,
    Tag,
    Badge,
    Space,
    Row,
    Col,
    Timeline,
    Alert,
    DatePicker,
    Checkbox
} from 'antd';
import {
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    SaveOutlined,
    CloseOutlined,
    MailOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ArrowLeftOutlined,
    TeamOutlined,
    HeartOutlined,
    PhoneOutlined,
    IdcardOutlined,
    BankOutlined,
    LockOutlined,
    SecurityScanOutlined,
    BellOutlined
} from '@ant-design/icons';
import { User, userManagementService } from '../../services/UserManagementService';
import './UserDetail.css';

const { Option } = Select;

interface UserDetailProps {
    user: User;
    onBack: () => void;
    onUserUpdated: () => void;
    onUserDeleted: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({
    user,
    onBack,
    onUserUpdated,
    onUserDeleted
}) => {
    const { isDark } = useTheme();
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [userData, setUserData] = useState<User>(user);

    useEffect(() => {
        form.setFieldsValue({
            firstName: userData.firstName || '',
            middleName: userData.middleName || '',
            lastName: userData.lastName || '',
            email: userData.email,
            username: userData.username,
            phone: userData.phone || '',
            pan: userData.pan || '',
            adhar: userData.adhar || '',
            maritalStatus: userData.maritalStatus || 'single',
            dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : undefined,
            dateOfMarriage: userData.dateOfMarriage ? new Date(userData.dateOfMarriage) : undefined,
            kul: userData.kul || '',
            gotra: userData.gotra || '',
            fatherName: userData.fatherName || '',
            motherName: userData.motherName || '',
            childrenName: userData.childrenName || '',
            role: userData.role,
            verified: userData.verified,
            isActive: userData.isActive,
            // Add new fields
            phoneNumber: userData.phone || '',
            dobAsPerDocument: userData.dateOfBirth || '',
            fatherDetails: userData.fatherDetails || {},
            motherDetails: userData.motherDetails || {},
            marriages: userData.marriages || [],
            children: userData.children || []
        });
    }, [userData, form]);

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Super Admin': return 'red';
            case 'Admin': return 'orange';
            case 'Member': return 'green';
            case 'Moderator': return 'blue';
            case 'Guest': return 'gray';
            default: return 'default';
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditMode(false);
        form.resetFields();
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const response = await userManagementService.updateUser(userData._id, values);
            setUserData(response.data);
            setEditMode(false);
            message.success('User updated successfully');
            onUserUpdated();
        } catch (error) {
            message.error('Failed to update user');
            console.error('Update user error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await userManagementService.deleteUser(userData._id);
            message.success('User deleted successfully');
            onUserDeleted();
        } catch (error) {
            message.error('Failed to delete user');
            console.error('Delete user error:', error);
        } finally {
            setLoading(false);
            setDeleteModalVisible(false);
        }
    };

    const handleToggleVerification = async () => {
        try {
            setLoading(true);
            const response = await userManagementService.verifyUser(userData._id);
            setUserData(response.data);
            message.success(`User ${response.data.verified ? 'verified' : 'unverified'} successfully`);
            onUserUpdated();
        } catch (error) {
            message.error('Failed to update verification status');
            console.error('Toggle verification error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatusColor = (status: boolean) => {
        return status ? '#52c41a' : '#ff4d4f';
    };

    const getStatusText = (status: boolean) => {
        return status ? 'Active' : 'Inactive';
    };

    const maritalStatusOptions = [
        { value: 'single', label: 'Single' },
        { value: 'married', label: 'Married' },
        { value: 'divorced', label: 'Divorced' },
        { value: 'widowed', label: 'Widowed' },
        { value: 'separated', label: 'Separated' }
    ];

    return (
        <div className={`user-detail-page ${isDark ? 'dark-theme' : ''}`}>
            {/* Header */}
            <div className="user-detail-header">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={onBack}
                    className="back-button"
                >
                    Back to Users
                </Button>

                <div className="header-actions">
                    {!editMode ? (
                        <Space>
                            <Button
                                icon={<EditOutlined />}
                                onClick={handleEdit}
                                type="primary"
                                className="edit-button"
                            >
                                Edit Info
                            </Button>
                            <Popconfirm
                                title="Delete User"
                                description="Are you sure you want to delete this user? This action cannot be undone."
                                onConfirm={() => setDeleteModalVisible(true)}
                                okText="Yes"
                                cancelText="No"
                                placement="topRight"
                            >
                                <Button
                                    icon={<DeleteOutlined />}
                                    danger
                                >
                                    Delete User
                                </Button>
                            </Popconfirm>
                        </Space>
                    ) : (
                        <Space>
                            <Button
                                icon={<CloseOutlined />}
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                icon={<SaveOutlined />}
                                type="primary"
                                loading={loading}
                                onClick={handleSave}
                            >
                                Save Changes
                            </Button>
                        </Space>
                    )}
                </div>
            </div>

            {/* User Profile Header */}
            <Card className={`user-profile-header-card ${isDark ? 'dark-theme' : ''}`}>
                <div className="user-profile-header">
                    <Avatar
                        size={60}
                        icon={<UserOutlined />}
                        className="user-avatar"
                    />
                    <div className="user-profile-info">
                        <h2 className="user-name">
                            {userData.fullName || `${userData.firstName} ${userData.lastName}`}
                            {userData.verified && <CheckCircleOutlined className="verified-icon" />}
                        </h2>
                        <p className="user-email">{userData.email}</p>
                        <div className="user-status-badges">
                            <Tag color={getRoleColor(typeof userData.role === 'string' ? userData.role : userData.role.name)}>
                                {typeof userData.role === 'string' ? userData.role : userData.role.name}
                            </Tag>
                            <Badge
                                status={userData.verified ? 'success' : 'error'}
                                text={userData.verified ? 'Verified' : 'Unverified'}
                            />
                            <Badge
                                status={userData.isActive ? 'success' : 'error'}
                                text={getStatusText(userData.isActive)}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Main Content */}
            <Row gutter={[16, 16]}>
                {/* Personal Information */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <span>
                                <UserOutlined />
                                Personal Details
                            </span>
                        }
                        className={`info-card ${isDark ? 'dark-theme' : ''}`}
                    >
                        {editMode ? (
                            <Form form={form} layout="vertical" size="small">
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="firstName"
                                            label="First Name"
                                            rules={[{ required: true, message: 'Please enter first name' }]}
                                            style={{ marginBottom: 12 }}
                                        >
                                            <Input prefix={<UserOutlined />} placeholder="Enter first name" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="lastName"
                                            label="Last Name"
                                            rules={[{ required: true, message: 'Please enter last name' }]}
                                            style={{ marginBottom: 12 }}
                                        >
                                            <Input prefix={<UserOutlined />} placeholder="Enter last name" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="dateOfBirth"
                                            label="Date of Birth"
                                            style={{ marginBottom: 12 }}
                                        >
                                            <DatePicker style={{ width: '100%' }} placeholder="Select date of birth" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="maritalStatus"
                                            label="Marital Status"
                                            style={{ marginBottom: 12 }}
                                        >
                                            <Select placeholder="Select marital status">
                                                {maritalStatusOptions.map(option => (
                                                    <Option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="kul"
                                            label="Kul"
                                            style={{ marginBottom: 12 }}
                                        >
                                            <Input placeholder="Enter kul" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="gotra"
                                            label="Gotra"
                                            style={{ marginBottom: 12 }}
                                        >
                                            <Input placeholder="Enter gotra" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        ) : (
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Full Name">
                                    {userData.fullName || `${userData.firstName} ${userData.lastName}`}
                                </Descriptions.Item>
                                <Descriptions.Item label="Date of Birth">
                                    {userData.dateOfBirth ? formatDate(userData.dateOfBirth) : 'Not provided'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Gender">
                                    {userData.maritalStatus || 'Not specified'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Nationality">
                                    Indian
                                </Descriptions.Item>
                                <Descriptions.Item label="Kul">
                                    {userData.kul || 'Not provided'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Gotra">
                                    {userData.gotra || 'Not provided'}
                                </Descriptions.Item>
                            </Descriptions>
                        )}
                    </Card>
                </Col>

                {/* Contact Information */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <span>
                                <PhoneOutlined />
                                Contact Info
                            </span>
                        }
                        className={`info-card ${isDark ? 'dark-theme' : ''}`}
                    >
                        {editMode ? (
                            <Form form={form} layout="vertical" size="small">
                                <Row gutter={12}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="email"
                                            label="E-mail"
                                            rules={[
                                                { required: true, message: 'Please enter email' },
                                                { type: 'email', message: 'Please enter a valid email' }
                                            ]}
                                            style={{ marginBottom: 12 }}
                                        >
                                            <Input prefix={<MailOutlined />} placeholder="Enter email address" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={12}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="phone"
                                            label="Phone"
                                            rules={[{ required: true, message: 'Please enter phone number' }]}
                                            style={{ marginBottom: 12 }}
                                        >
                                            <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="pan"
                                            label="PAN Number"
                                            style={{ marginBottom: 12 }}
                                        >
                                            <Input prefix={<IdcardOutlined />} placeholder="Enter PAN number" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="adhar"
                                            label="Aadhaar Number"
                                            style={{ marginBottom: 12 }}
                                        >
                                            <Input prefix={<IdcardOutlined />} placeholder="Enter Aadhaar number" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        ) : (
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="E-mail">
                                    {userData.email}
                                </Descriptions.Item>
                                <Descriptions.Item label="Phone">
                                    {userData.phone || 'Not provided'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Address">
                                    Not provided
                                </Descriptions.Item>
                                <Descriptions.Item label="City">
                                    Not provided
                                </Descriptions.Item>
                                <Descriptions.Item label="Country">
                                    India
                                </Descriptions.Item>
                                <Descriptions.Item label="PAN Number">
                                    {userData.pan || 'Not provided'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Aadhaar Number">
                                    {userData.adhar || 'Not provided'}
                                </Descriptions.Item>
                            </Descriptions>
                        )}
                    </Card>
                </Col>

                {/* Account Details */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <span>
                                <BankOutlined />
                                Account Details
                            </span>
                        }
                        className={`info-card ${isDark ? 'dark-theme' : ''}`}
                    >
                        {editMode ? (
                            <Form form={form} layout="vertical">
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="username"
                                            label="Username"
                                            rules={[{ required: true, message: 'Please enter username' }]}
                                        >
                                            <Input prefix={<UserOutlined />} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="role"
                                            label="Role"
                                        >
                                            <Select>
                                                <Option value="Member">Member</Option>
                                                <Option value="Admin">Admin</Option>
                                                <Option value="Moderator">Moderator</Option>
                                                <Option value="Guest">Guest</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="isActive"
                                            label="Account Status"
                                            valuePropName="checked"
                                        >
                                            <Switch />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        ) : (
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="User ID">
                                    {userData._id}
                                </Descriptions.Item>
                                <Descriptions.Item label="Username">
                                    {userData.username}
                                </Descriptions.Item>
                                <Descriptions.Item label="Account Created">
                                    {formatDate(userData.createdAt)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Last Login">
                                    {userData.lastLogin ? formatDate(userData.lastLogin) : 'Never'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Membership Status">
                                    <Tag color={getRoleColor(typeof userData.role === 'string' ? userData.role : userData.role.name)}>
                                        {typeof userData.role === 'string' ? userData.role : userData.role.name}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Account Verification">
                                    <Tag color={userData.verified ? 'green' : 'red'}>
                                        {userData.verified ? 'Verified' : 'Unverified'}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Account Status">
                                    <Tag color={userData.isActive ? 'green' : 'red'}>
                                        {getStatusText(userData.isActive)}
                                    </Tag>
                                </Descriptions.Item>
                            </Descriptions>
                        )}
                    </Card>
                </Col>

                {/* Family Information */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <span>
                                <TeamOutlined />
                                Family Information
                            </span>
                        }
                        className={`info-card ${isDark ? 'dark-theme' : ''}`}
                    >
                        {editMode ? (
                            <Form form={form} layout="vertical" size="small">
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <Form.Item
                                            name={['fatherDetails', 'fatherName']}
                                            label="Father's Name"
                                            style={{ marginBottom: 12 }}
                                        >
                                            <Input
                                                prefix={<UserOutlined />}
                                                placeholder="Search for father's name"
                                                style={{ fontSize: '12px' }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name={['motherDetails', 'motherName']}
                                            label="Mother's Name"
                                            style={{ marginBottom: 12 }}
                                        >
                                            <Input
                                                prefix={<UserOutlined />}
                                                placeholder="Search for mother's name"
                                                style={{ fontSize: '12px' }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <Form.Item
                                            name={['fatherDetails', 'isAlive']}
                                            label="Father's Status"
                                            valuePropName="checked"
                                            style={{ marginBottom: 12 }}
                                        >
                                            <Checkbox style={{ fontSize: '12px' }}>Alive</Checkbox>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name={['motherDetails', 'isAlive']}
                                            label="Mother's Status"
                                            valuePropName="checked"
                                            style={{ marginBottom: 12 }}
                                        >
                                            <Checkbox style={{ fontSize: '12px' }}>Alive</Checkbox>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        ) : (
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Father's Name">
                                    {userData.fatherName || 'Not provided'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Mother's Name">
                                    {userData.motherName || 'Not provided'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Father's Status">
                                    {userData.fatherDetails?.isAlive ? 'Alive' : 'Deceased'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Mother's Status">
                                    {userData.motherDetails?.isAlive ? 'Alive' : 'Deceased'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Children">
                                    {userData.childrenName || 'Not provided'}
                                </Descriptions.Item>
                            </Descriptions>
                        )}
                    </Card>
                </Col>

                {/* Marriage Information */}
                {userData.maritalStatus === 'married' && (
                    <Col xs={24}>
                        <Card
                            title={
                                <span>
                                    <HeartOutlined />
                                    Marriage Information
                                </span>
                            }
                            className={`info-card ${isDark ? 'dark-theme' : ''}`}
                        >
                            {editMode ? (
                                <Form form={form} layout="vertical" size="small">
                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <Form.Item
                                                name={['marriages', 0, 'spouseName']}
                                                label="Spouse Name"
                                                style={{ marginBottom: 12 }}
                                            >
                                                <Input
                                                    prefix={<UserOutlined />}
                                                    placeholder="Enter spouse name"
                                                    style={{ fontSize: '12px' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name={['marriages', 0, 'marriageDate']}
                                                label="Marriage Date"
                                                style={{ marginBottom: 12 }}
                                            >
                                                <DatePicker
                                                    style={{ width: '100%', fontSize: '12px' }}
                                                    placeholder="Select marriage date"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <Form.Item
                                                name={['marriages', 0, 'marriageType']}
                                                label="Marriage Type"
                                                style={{ marginBottom: 12 }}
                                            >
                                                <Select placeholder="Select marriage type" style={{ fontSize: '12px' }}>
                                                    <Option value="arranged">Arranged</Option>
                                                    <Option value="love">Love</Option>
                                                    <Option value="inter_caste">Inter-caste</Option>
                                                    <Option value="inter_religion">Inter-religion</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name={['marriages', 0, 'marriagePlace', 'city']}
                                                label="Marriage City"
                                                style={{ marginBottom: 12 }}
                                            >
                                                <Input
                                                    placeholder="Enter marriage city"
                                                    style={{ fontSize: '12px' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            ) : (
                                <Descriptions column={2} size="small">
                                    <Descriptions.Item label="Spouse Name">
                                        {userData.marriages?.[0]?.spouseName || 'Not provided'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Marriage Date">
                                        {userData.marriages?.[0]?.marriageDate ?
                                            formatDate(userData.marriages[0].marriageDate) : 'Not provided'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Marriage Type">
                                        {userData.marriages?.[0]?.marriageType || 'Not provided'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Marriage City">
                                        {userData.marriages?.[0]?.marriagePlace?.city || 'Not provided'}
                                    </Descriptions.Item>
                                </Descriptions>
                            )}
                        </Card>
                    </Col>
                )}

                {/* Security Settings */}
                <Col xs={24}>
                    <Card
                        title={
                            <span>
                                <SecurityScanOutlined />
                                Security Settings
                            </span>
                        }
                        className={`info-card ${isDark ? 'dark-theme' : ''}`}
                    >
                        <Row gutter={[16, 12]}>
                            <Col xs={24} sm={12} md={8}>
                                <div className="security-item">
                                    <LockOutlined className="security-icon" />
                                    <div className="security-content">
                                        <h4>Password Security</h4>
                                        <p>Last changed: {formatDate(userData.updatedAt)}</p>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <div className="security-item">
                                    <SecurityScanOutlined className="security-icon" />
                                    <div className="security-content">
                                        <h4>Two-Factor Authentication</h4>
                                        <p>Status: <Tag color="blue">Enabled</Tag></p>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <div className="security-item">
                                    <BellOutlined className="security-icon" />
                                    <div className="security-content">
                                        <h4>Login Notifications</h4>
                                        <p>Status: <Tag color="green">Enabled</Tag></p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* Activity Timeline */}
            <Card
                title={
                    <span>
                        <CalendarOutlined />
                        User Activity
                    </span>
                }
                className={`activity-card ${isDark ? 'dark-theme' : ''}`}
                style={{ marginTop: 16 }}
            >
                <Timeline>
                    <Timeline.Item color="green">
                        <p>Account created</p>
                        <p className="timeline-date">{formatDate(userData.createdAt)}</p>
                    </Timeline.Item>
                    {userData.lastLogin && (
                        <Timeline.Item color="blue">
                            <p>Last login</p>
                            <p className="timeline-date">{formatDate(userData.lastLogin)}</p>
                        </Timeline.Item>
                    )}
                    <Timeline.Item color="gray">
                        <p>Profile last updated</p>
                        <p className="timeline-date">{formatDate(userData.updatedAt)}</p>
                    </Timeline.Item>
                </Timeline>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Delete User"
                open={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="delete"
                        type="primary"
                        danger
                        loading={loading}
                        onClick={handleDelete}
                    >
                        Delete User
                    </Button>
                ]}
            >
                <Alert
                    message="Warning"
                    description="Are you sure you want to delete this user? This action cannot be undone and will permanently remove all user data."
                    type="warning"
                    showIcon
                />
            </Modal>
        </div>
    );
};

export default UserDetail;