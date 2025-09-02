import React, { useState, useEffect } from 'react';
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
    Divider,
    Row,
    Col,
    Statistic,
    Timeline,
    Tooltip,
    Alert
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
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    ArrowLeftOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { User, userManagementService } from '../../services/UserManagementService';
import './UserDetail.css';

const { Option } = Select;
const { TextArea } = Input;



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
            maritalStatus: userData.maritalStatus || 'Single',
            dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : undefined,
            dateOfMarriage: userData.dateOfMarriage ? new Date(userData.dateOfMarriage) : undefined,
            kul: userData.kul || '',
            gotra: userData.gotra || '',
            fatherName: userData.fatherName || '',
            motherName: userData.motherName || '',
            childrenName: userData.childrenName || '',
            role: userData.role,
            verified: userData.verified,
            isActive: userData.isActive
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

            // Convert date fields to ISO strings for API
            const processedValues = {
                ...values,
                dateOfBirth: values.dateOfBirth ? new Date(values.dateOfBirth).toISOString() : undefined,
                dateOfMarriage: values.dateOfMarriage ? new Date(values.dateOfMarriage).toISOString() : undefined
            };

            // For now, just update local state since the API might need adjustment
            // TODO: Implement proper API call to update user fields
            const updatedUser = { ...userData, ...processedValues };
            setUserData(updatedUser);

            message.success('User updated successfully');
            setEditMode(false);
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
            setDeleteModalVisible(false);
            onUserDeleted();
        } catch (error) {
            message.error('Failed to delete user');
            console.error('Delete user error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleVerification = async () => {
        try {
            setLoading(true);
            const response = await userManagementService.toggleUserVerification(userData._id);
            const updatedUser = { ...userData, verified: response.data.verified };
            setUserData(updatedUser);
            message.success(`User ${updatedUser.verified ? 'verified' : 'unverified'} successfully`);
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

    return (
        <div className="user-detail-page">
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
                            >
                                Edit User
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

            <Row gutter={[24, 24]}>
                {/* User Profile Card */}
                <Col xs={24} lg={8}>
                    <Card className="user-profile-card">
                        <div className="user-profile-header">
                            <Avatar
                                size={80}
                                icon={<UserOutlined />}
                                className="user-avatar"
                            />
                            <div className="user-profile-info">
                                <h2>{userData.fullName || `${userData.firstName} ${userData.lastName}`}</h2>
                                <p className="username">@{userData.username}</p>
                                <p className="email">{userData.email}</p>
                                <p className="phone">{userData.phone}</p>
                                <Tag color={getRoleColor(userData.role)}>
                                    {userData.role}
                                </Tag>
                            </div>
                        </div>

                        <Divider />

                        <div className="user-status">
                            <Badge
                                status={userData.verified ? 'success' : 'error'}
                                text={userData.verified ? 'Verified' : 'Unverified'}
                            />
                            {editMode && (
                                <Button
                                    type="link"
                                    size="small"
                                    onClick={handleToggleVerification}
                                    loading={loading}
                                >
                                    {userData.verified ? 'Unverify' : 'Verify'}
                                </Button>
                            )}
                        </div>
                    </Card>
                </Col>

                {/* User Details Card */}
                <Col xs={24} lg={16}>
                    <Card title="User Details" className="user-details-card">
                        {editMode ? (
                            <Form
                                form={form}
                                layout="vertical"
                                className="edit-user-form"
                            >
                                <Row gutter={16}>
                                    <Col xs={24} sm={8}>
                                        <Form.Item
                                            name="firstName"
                                            label="First Name"
                                            rules={[{ required: true, message: 'Please enter first name' }]}
                                        >
                                            <Input prefix={<UserOutlined />} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <Form.Item
                                            name="middleName"
                                            label="Middle Name"
                                        >
                                            <Input prefix={<UserOutlined />} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <Form.Item
                                            name="lastName"
                                            label="Last Name"
                                            rules={[{ required: true, message: 'Please enter last name' }]}
                                        >
                                            <Input prefix={<UserOutlined />} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="username"
                                            label="Username"
                                            rules={[{ required: true, message: 'Please enter username' }]}
                                        >
                                            <Input prefix={<UserOutlined />} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="email"
                                            label="Email"
                                            rules={[
                                                { required: true, message: 'Please enter email' },
                                                { type: 'email', message: 'Please enter a valid email' }
                                            ]}
                                        >
                                            <Input prefix={<MailOutlined />} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="phone"
                                            label="Phone Number"
                                            rules={[{ required: true, message: 'Please enter phone number' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="maritalStatus"
                                            label="Marital Status"
                                            rules={[{ required: true, message: 'Please select marital status' }]}
                                        >
                                            <Select placeholder="Select marital status">
                                                <Option value="Single">Single</Option>
                                                <Option value="Married">Married</Option>
                                                <Option value="Divorced">Divorced</Option>
                                                <Option value="Widowed">Widowed</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="dateOfBirth"
                                            label="Date of Birth"
                                            rules={[{ required: true, message: 'Please select date of birth' }]}
                                        >
                                            <Input type="date" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="dateOfMarriage"
                                            label="Date of Marriage"
                                        >
                                            <Input type="date" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="pan"
                                            label="PAN Number"
                                        >
                                            <Input placeholder="ABCDE1234F" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="adhar"
                                            label="Aadhaar Number"
                                        >
                                            <Input placeholder="123456789012" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="kul"
                                            label="Kul"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="gotra"
                                            label="Gotra"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col xs={24} sm={8}>
                                        <Form.Item
                                            name="fatherName"
                                            label="Father's Name"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <Form.Item
                                            name="motherName"
                                            label="Mother's Name"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <Form.Item
                                            name="childrenName"
                                            label="Children's Names"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="role"
                                            label="Role"
                                            rules={[{ required: true, message: 'Please select a role' }]}
                                        >
                                            <Select placeholder="Select role">
                                                <Option value="Super Admin">Super Admin</Option>
                                                <Option value="Admin">Admin</Option>
                                                <Option value="Member">Member</Option>
                                                <Option value="Moderator">Moderator</Option>
                                                <Option value="Guest">Guest</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="isActive"
                                            label="Active Status"
                                            valuePropName="checked"
                                        >
                                            <Switch
                                                checkedChildren="Active"
                                                unCheckedChildren="Inactive"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    name="verified"
                                    label="Verification Status"
                                    valuePropName="checked"
                                >
                                    <Switch
                                        checkedChildren="Verified"
                                        unCheckedChildren="Unverified"
                                    />
                                </Form.Item>
                            </Form>
                        ) : (
                            <Descriptions column={2} bordered>
                                <Descriptions.Item label="Full Name" span={2}>
                                    {userData.fullName || `${userData.firstName} ${userData.lastName}`}
                                </Descriptions.Item>
                                <Descriptions.Item label="Username" span={1}>
                                    @{userData.username}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email" span={1}>
                                    {userData.email}
                                </Descriptions.Item>
                                <Descriptions.Item label="Phone" span={1}>
                                    {userData.phone}
                                </Descriptions.Item>
                                <Descriptions.Item label="Role" span={1}>
                                    <Tag color={getRoleColor(userData.role)}>
                                        {userData.role}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Marital Status" span={1}>
                                    {userData.maritalStatus}
                                </Descriptions.Item>
                                <Descriptions.Item label="Date of Birth" span={1}>
                                    {userData.dateOfBirth ? formatDate(userData.dateOfBirth) : 'Not provided'}
                                </Descriptions.Item>
                                {userData.dateOfMarriage && (
                                    <Descriptions.Item label="Date of Marriage" span={1}>
                                        {formatDate(userData.dateOfMarriage)}
                                    </Descriptions.Item>
                                )}
                                {userData.pan && (
                                    <Descriptions.Item label="PAN" span={1}>
                                        {userData.pan}
                                    </Descriptions.Item>
                                )}
                                {userData.adhar && (
                                    <Descriptions.Item label="Aadhaar" span={1}>
                                        {userData.adhar}
                                    </Descriptions.Item>
                                )}
                                {userData.kul && (
                                    <Descriptions.Item label="Kul" span={1}>
                                        {userData.kul}
                                    </Descriptions.Item>
                                )}
                                {userData.gotra && (
                                    <Descriptions.Item label="Gotra" span={1}>
                                        {userData.gotra}
                                    </Descriptions.Item>
                                )}
                                {userData.fatherName && (
                                    <Descriptions.Item label="Father's Name" span={1}>
                                        {userData.fatherName}
                                    </Descriptions.Item>
                                )}
                                {userData.motherName && (
                                    <Descriptions.Item label="Mother's Name" span={1}>
                                        {userData.motherName}
                                    </Descriptions.Item>
                                )}
                                {userData.childrenName && (
                                    <Descriptions.Item label="Children's Names" span={1}>
                                        {userData.childrenName}
                                    </Descriptions.Item>
                                )}
                                <Descriptions.Item label="Verification Status" span={1}>
                                    <Badge
                                        status={userData.verified ? 'success' : 'error'}
                                        text={userData.verified ? 'Verified' : 'Unverified'}
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item label="Active Status" span={1}>
                                    <Badge
                                        status={userData.isActive ? 'success' : 'error'}
                                        text={userData.isActive ? 'Active' : 'Inactive'}
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item label="Joined Date" span={1}>
                                    {formatDate(userData.createdAt)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Last Updated" span={1}>
                                    {formatDate(userData.updatedAt)}
                                </Descriptions.Item>
                                {userData.lastLogin && (
                                    <Descriptions.Item label="Last Login" span={2}>
                                        {formatDate(userData.lastLogin)}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* User Statistics */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={8}>
                    <Card>
                        <Statistic
                            title="Account Age"
                            value={Math.floor((Date.now() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                            suffix="days"
                            prefix={<CalendarOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card>
                        <Statistic
                            title="Status"
                            value={userData.verified ? 'Active' : 'Pending'}
                            valueStyle={{ color: userData.verified ? '#3f8600' : '#cf1322' }}
                            prefix={userData.verified ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card>
                        <Statistic
                            title="Role Level"
                            value={userData.role}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Activity Timeline */}
            <Card title="User Activity" style={{ marginTop: 24 }}>
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
                    description="Are you sure you want to delete this user? This action cannot be undone and will permanently remove the user from the system."
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                />
                <div style={{ marginTop: 16 }}>
                    <p><strong>User:</strong> {userData.firstName} {userData.lastName}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Username:</strong> @{userData.username}</p>
                </div>
            </Modal>
        </div>
    );
};

export default UserDetail;
