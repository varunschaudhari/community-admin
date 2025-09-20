import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
    Card,
    Button,
    Table,
    Modal,
    Form,
    Input,
    DatePicker,
    Select,
    message,
    Space,
    Tag,
    Avatar,
    Row,
    Col,
    Statistic,
    Badge
} from 'antd';
import {
    CalendarOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import './Events.css';

const { Option } = Select;
const { TextArea } = Input;

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    type: 'meeting' | 'celebration' | 'religious' | 'social' | 'other';
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    attendees: string[];
    maxAttendees: number;
    organizer: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

const Events: React.FC = () => {
    const { theme } = useTheme();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [form] = Form.useForm();

    // Mock data for demonstration
    const mockEvents: Event[] = [
        {
            _id: '1',
            title: 'Community Annual Meeting',
            description: 'Annual community meeting to discuss important matters',
            date: '2024-02-15',
            time: '10:00 AM',
            location: 'Community Hall',
            type: 'meeting',
            status: 'upcoming',
            attendees: ['user1', 'user2', 'user3'],
            maxAttendees: 100,
            organizer: {
                _id: 'admin1',
                name: 'Admin User',
                email: 'admin@community.com'
            },
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
        },
        {
            _id: '2',
            title: 'Diwali Celebration',
            description: 'Community Diwali celebration with cultural programs',
            date: '2024-11-12',
            time: '6:00 PM',
            location: 'Community Center',
            type: 'celebration',
            status: 'upcoming',
            attendees: ['user4', 'user5'],
            maxAttendees: 200,
            organizer: {
                _id: 'mod1',
                name: 'Moderator User',
                email: 'moderator@community.com'
            },
            createdAt: '2024-01-02',
            updatedAt: '2024-01-02'
        }
    ];

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            // Simulate API call
            setTimeout(() => {
                setEvents(mockEvents);
                setLoading(false);
            }, 1000);
        } catch (error) {
            message.error('Failed to fetch events');
            setLoading(false);
        }
    };

    const handleCreateEvent = () => {
        setEditingEvent(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEditEvent = (event: Event) => {
        setEditingEvent(event);
        form.setFieldsValue({
            ...event,
            date: event.date ? new Date(event.date) : null
        });
        setModalVisible(true);
    };

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);

            const eventData = {
                ...values,
                date: values.date ? values.date.format('YYYY-MM-DD') : null,
                status: 'upcoming'
            };

            if (editingEvent) {
                // Update existing event
                const updatedEvents = events.map(event =>
                    event._id === editingEvent._id
                        ? { ...event, ...eventData }
                        : event
                );
                setEvents(updatedEvents);
                message.success('Event updated successfully');
            } else {
                // Create new event
                const newEvent: Event = {
                    _id: Date.now().toString(),
                    ...eventData,
                    attendees: [],
                    organizer: {
                        _id: 'current-user',
                        name: 'Current User',
                        email: 'current@community.com'
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                setEvents([newEvent, ...events]);
                message.success('Event created successfully');
            }

            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Failed to save event');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = (eventId: string) => {
        const updatedEvents = events.filter(event => event._id !== eventId);
        setEvents(updatedEvents);
        message.success('Event deleted successfully');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming': return 'blue';
            case 'ongoing': return 'green';
            case 'completed': return 'gray';
            case 'cancelled': return 'red';
            default: return 'default';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'meeting': return 'blue';
            case 'celebration': return 'gold';
            case 'religious': return 'purple';
            case 'social': return 'green';
            default: return 'default';
        }
    };

    const columns = [
        {
            title: 'Event',
            key: 'event',
            render: (event: Event) => (
                <div className="event-info">
                    <div className="event-title">{event.title}</div>
                    <div className="event-description">{event.description}</div>
                    <div className="event-meta">
                        <Space>
                            <Tag color={getTypeColor(event.type)}>{event.type}</Tag>
                            <Tag color={getStatusColor(event.status)}>{event.status}</Tag>
                        </Space>
                    </div>
                </div>
            ),
        },
        {
            title: 'Date & Time',
            key: 'datetime',
            render: (event: Event) => (
                <div className="datetime-info">
                    <div><CalendarOutlined /> {event.date}</div>
                    <div><ClockCircleOutlined /> {event.time}</div>
                </div>
            ),
        },
        {
            title: 'Location',
            key: 'location',
            render: (event: Event) => (
                <div><EnvironmentOutlined /> {event.location}</div>
            ),
        },
        {
            title: 'Attendees',
            key: 'attendees',
            render: (event: Event) => (
                <div>
                    <UserOutlined /> {event.attendees.length}/{event.maxAttendees}
                    <div className="attendees-list">
                        {event.attendees.slice(0, 3).map((attendee, index) => (
                            <Avatar key={index} size="small" icon={<UserOutlined />} />
                        ))}
                        {event.attendees.length > 3 && (
                            <Avatar size="small">+{event.attendees.length - 3}</Avatar>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: 'Organizer',
            key: 'organizer',
            render: (event: Event) => (
                <div className="organizer-info">
                    <Avatar icon={<UserOutlined />} />
                    <div>
                        <div>{event.organizer.name}</div>
                        <div className="organizer-email">{event.organizer.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (event: Event) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleEditEvent(event)}
                    >
                        View
                    </Button>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditEvent(event)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteEvent(event._id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const upcomingEvents = events.filter(event => event.status === 'upcoming').length;
    const totalAttendees = events.reduce((sum, event) => sum + event.attendees.length, 0);

    return (
        <div className="events-page">
            <div className="events-header">
                <div className="header-content">
                    <h1>Community Events</h1>
                    <p>Manage and organize community events</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateEvent}
                    size="large"
                >
                    Create Event
                </Button>
            </div>

            <Row gutter={[16, 16]} className="stats-section">
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Events"
                            value={events.length}
                            prefix={<CalendarOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Upcoming Events"
                            value={upcomingEvents}
                            prefix={<Badge status="processing" />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Attendees"
                            value={totalAttendees}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="This Month"
                            value={events.filter(event => {
                                const eventDate = new Date(event.date);
                                const now = new Date();
                                return eventDate.getMonth() === now.getMonth() &&
                                    eventDate.getFullYear() === now.getFullYear();
                            }).length}
                            prefix={<CalendarOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card className="events-table">
                <Table
                    columns={columns}
                    dataSource={events}
                    loading={loading}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} events`,
                    }}
                />
            </Card>

            <Modal
                title={editingEvent ? 'Edit Event' : 'Create Event'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="title"
                        label="Event Title"
                        rules={[{ required: true, message: 'Please enter event title' }]}
                    >
                        <Input placeholder="Enter event title" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter event description' }]}
                    >
                        <TextArea rows={3} placeholder="Enter event description" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="date"
                                label="Date"
                                rules={[{ required: true, message: 'Please select date' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="time"
                                label="Time"
                                rules={[{ required: true, message: 'Please enter time' }]}
                            >
                                <Input placeholder="e.g., 10:00 AM" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="location"
                        label="Location"
                        rules={[{ required: true, message: 'Please enter location' }]}
                    >
                        <Input placeholder="Enter event location" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Event Type"
                                rules={[{ required: true, message: 'Please select event type' }]}
                            >
                                <Select placeholder="Select event type">
                                    <Option value="meeting">Meeting</Option>
                                    <Option value="celebration">Celebration</Option>
                                    <Option value="religious">Religious</Option>
                                    <Option value="social">Social</Option>
                                    <Option value="other">Other</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="maxAttendees"
                                label="Max Attendees"
                                rules={[{ required: true, message: 'Please enter max attendees' }]}
                            >
                                <Input type="number" placeholder="Maximum attendees" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editingEvent ? 'Update Event' : 'Create Event'}
                            </Button>
                            <Button onClick={() => setModalVisible(false)}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Events;

