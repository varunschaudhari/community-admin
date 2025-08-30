import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { DASHBOARD, ANALYTICS, MESSAGES, ACTIONS, TIME } from '../../constants';
import {
  UserOutlined,
  BarChartOutlined,
  MessageOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  LikeOutlined,
  ShareAltOutlined,
  StarOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();

  const stats = [
    {
      title: 'Total Users',
      value: '12,847',
      change: '+12.5%',
      positive: true,
      icon: <UserOutlined />,
      color: theme.colors.primary,
    },
    {
      title: 'Revenue',
      value: '$48,234',
      change: '+8.2%',
      positive: true,
      icon: <DollarOutlined />,
      color: theme.colors.success,
    },
    {
      title: MESSAGES.INBOX,
      value: '1,234',
      change: '-2.1%',
      positive: false,
      icon: <MessageOutlined />,
      color: theme.colors.warning,
    },
    {
      title: ANALYTICS.PAGE_VIEWS,
      value: '89.2%',
      change: '+5.7%',
      positive: true,
      icon: <BarChartOutlined />,
      color: theme.colors.accent,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'Sarah Wilson',
      avatar: 'SW',
      color: theme.colors.primary,
      message: 'Great work on the latest project! The client is very satisfied.',
      time: '2 hours ago',
    },
    {
      id: 2,
      sender: 'Mike Johnson',
      avatar: 'MJ',
      color: theme.colors.success,
      message: 'Can we schedule a meeting to discuss the new features?',
      time: '4 hours ago',
    },
    {
      id: 3,
      sender: 'Emily Davis',
      avatar: 'ED',
      color: theme.colors.warning,
      message: 'The analytics dashboard looks amazing. Well done!',
      time: '6 hours ago',
    },
    {
      id: 4,
      sender: 'Alex Brown',
      avatar: 'AB',
      color: theme.colors.accent,
      message: 'I need help with the user authentication system.',
      time: '8 hours ago',
    },
  ];

  const products = [
    {
      id: 1,
      title: 'Analytics Pro',
      description: 'Advanced analytics and reporting tools for your business',
      icon: <BarChartOutlined />,
      color: theme.colors.primary,
      views: '1.2k',
      likes: '89',
      rating: '4.8',
    },
    {
      id: 2,
      title: 'Messaging Hub',
      description: 'Centralized communication platform for teams',
      icon: <MessageOutlined />,
      color: theme.colors.success,
      views: '856',
      likes: '67',
      rating: '4.6',
    },
    {
      id: 3,
      title: 'User Management',
      description: 'Complete user administration and permission system',
      icon: <UserOutlined />,
      color: theme.colors.warning,
      views: '2.1k',
      likes: '124',
      rating: '4.9',
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1 className="welcome-title">{DASHBOARD.WELCOME_MESSAGE}, John! 👋</h1>
        <p className="welcome-subtitle">
          {DASHBOARD.DASHBOARD_SUBTITLE}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{ '--stat-color': stat.color } as React.CSSProperties}
          >
            <div className="stat-header">
              <div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.title}</div>
                <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                  {stat.positive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {stat.change}
                </div>
              </div>
              <div
                className="stat-icon"
                style={{ '--stat-color': stat.color } as React.CSSProperties}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="main-content-grid">
        {/* Messages Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent {MESSAGES.INBOX}</h3>
          </div>
          <div className="card-body">
            {messages.map((message) => (
              <div key={message.id} className="message-item">
                <div
                  className="message-avatar"
                  style={{ '--message-color': message.color } as React.CSSProperties}
                >
                  {message.avatar}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <div className="message-sender">{message.sender}</div>
                    <div className="message-time">{message.time}</div>
                  </div>
                  <div className="message-text">{message.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Highlights */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Product Highlights</h3>
          </div>
          <div className="card-body">
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div
                    className="product-image"
                    style={{ '--product-color': product.color } as React.CSSProperties}
                  >
                    {product.icon}
                  </div>
                  <div className="product-content">
                    <h4 className="product-title">{product.title}</h4>
                    <p className="product-description">{product.description}</p>
                    <div className="product-stats">
                      <div className="product-stat">
                        <EyeOutlined />
                        {product.views}
                      </div>
                      <div className="product-stat">
                        <LikeOutlined />
                        {product.likes}
                      </div>
                      <div className="product-stat">
                        <StarOutlined />
                        {product.rating}
                      </div>
                    </div>
                    <button className="product-button">{ACTIONS.VIEW}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features Grid */}
      <div className="features-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{DASHBOARD.QUICK_ACTIONS}</h3>
          </div>
          <div className="card-body">
            <div className="quick-actions">
              <button className="product-button">Create New Project</button>
              <button className="product-button secondary">
                {ACTIONS.VIEW} Reports
              </button>
              <button className="product-button secondary">
                Manage Users
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{DASHBOARD.RECENT_ACTIVITY}</h3>
          </div>
          <div className="card-body">
            <div className="activity-item">
              <div className="activity-dot success"></div>
              <span className="activity-text">New user registered</span>
            </div>
            <div className="activity-item">
              <div className="activity-dot primary"></div>
              <span className="activity-text">Project updated</span>
            </div>
            <div className="activity-item">
              <div className="activity-dot warning"></div>
              <span className="activity-text">System backup completed</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Upcoming Events</h3>
          </div>
          <div className="card-body">
            <div className="event-item">
              <CalendarOutlined className="event-icon" style={{ color: theme.colors.primary }} />
              <div className="event-content">
                <div className="event-title">Team Meeting</div>
                <div className="event-time">{TIME.TODAY}, 10:00 AM</div>
              </div>
            </div>
            <div className="event-item">
              <ClockCircleOutlined className="event-icon" style={{ color: theme.colors.success }} />
              <div className="event-content">
                <div className="event-title">Product Launch</div>
                <div className="event-time">Friday, 2:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
