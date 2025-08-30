import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { DASHBOARD, ANALYTICS, MESSAGES, ACTIONS, TIME } from '../constants';
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

const DashboardContainer = styled.div`
  .grid {
    display: grid;
    gap: ${({ theme }) => theme.spacing.lg};
  }

  .grid-12 {
    grid-template-columns: repeat(12, 1fr);
  }

  .grid-6 {
    grid-template-columns: repeat(6, 1fr);
  }

  .grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    .grid-12,
    .grid-6,
    .grid-4,
    .grid-3 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    .grid-12,
    .grid-6,
    .grid-4,
    .grid-3 {
      grid-template-columns: 1fr;
    }
  }
`;

const WelcomeSection = styled.div`
  background: ${({ theme }) => theme.colors.gradient.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const WelcomeTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  position: relative;
  z-index: 1;
`;

const WelcomeSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  opacity: 0.9;
  margin-bottom: 0;
  position: relative;
  z-index: 1;
`;

const StatCard = styled.div<{ color: string }>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.shadow};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ color }) => color};
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ color }) => color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
  font-size: 20px;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatChange = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ $positive, theme }) =>
    $positive ? theme.colors.success : theme.colors.error};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.shadow};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CardBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const MessageItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const MessageAvatar = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  flex: 1;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MessageSender = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const MessageTime = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const MessageText = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.4;
`;

const ProductCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div<{ color: string }>`
  height: 120px;
  background: ${({ color }) => color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
  font-size: 32px;
`;

const ProductContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ProductTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProductDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.4;
`;

const ProductStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProductStat = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const ProductButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.gradient.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

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
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>{DASHBOARD.WELCOME_MESSAGE}, John! 👋</WelcomeTitle>
        <WelcomeSubtitle>
          {DASHBOARD.DASHBOARD_SUBTITLE}
        </WelcomeSubtitle>
      </WelcomeSection>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.xl
      }}>
        {stats.map((stat, index) => (
          <StatCard key={index} color={stat.color}>
            <StatHeader>
              <div>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.title}</StatLabel>
                <StatChange $positive={stat.positive}>
                  {stat.positive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {stat.change}
                </StatChange>
              </div>
              <StatIcon color={stat.color}>{stat.icon}</StatIcon>
            </StatHeader>
          </StatCard>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.xl
      }}>
        {/* Messages Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent {MESSAGES.INBOX}</CardTitle>
          </CardHeader>
          <CardBody>
            {messages.map((message) => (
              <MessageItem key={message.id}>
                <MessageAvatar color={message.color}>
                  {message.avatar}
                </MessageAvatar>
                <MessageContent>
                  <MessageHeader>
                    <MessageSender>{message.sender}</MessageSender>
                    <MessageTime>{message.time}</MessageTime>
                  </MessageHeader>
                  <MessageText>{message.message}</MessageText>
                </MessageContent>
              </MessageItem>
            ))}
          </CardBody>
        </Card>

        {/* Product Highlights */}
        <Card>
          <CardHeader>
            <CardTitle>Product Highlights</CardTitle>
          </CardHeader>
          <CardBody>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: theme.spacing.lg
            }}>
              {products.map((product) => (
                <ProductCard key={product.id}>
                  <ProductImage color={product.color}>
                    {product.icon}
                  </ProductImage>
                  <ProductContent>
                    <ProductTitle>{product.title}</ProductTitle>
                    <ProductDescription>{product.description}</ProductDescription>
                    <ProductStats>
                      <ProductStat>
                        <EyeOutlined />
                        {product.views}
                      </ProductStat>
                      <ProductStat>
                        <LikeOutlined />
                        {product.likes}
                      </ProductStat>
                      <ProductStat>
                        <StarOutlined />
                        {product.rating}
                      </ProductStat>
                    </ProductStats>
                    <ProductButton>{ACTIONS.VIEW}</ProductButton>
                  </ProductContent>
                </ProductCard>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Additional Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: theme.spacing.lg,
        marginTop: theme.spacing.xl
      }}>
        <Card>
          <CardHeader>
            <CardTitle>{DASHBOARD.QUICK_ACTIONS}</CardTitle>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
              <ProductButton>Create New Project</ProductButton>
              <ProductButton style={{ background: theme.colors.surface, color: theme.colors.text.primary, border: `1px solid ${theme.colors.border}` }}>
                {ACTIONS.VIEW} Reports
              </ProductButton>
              <ProductButton style={{ background: theme.colors.surface, color: theme.colors.text.primary, border: `1px solid ${theme.colors.border}` }}>
                Manage Users
              </ProductButton>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{DASHBOARD.RECENT_ACTIVITY}</CardTitle>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: theme.colors.success }} />
                <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
                  New user registered
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: theme.colors.primary }} />
                <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
                  Project updated
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: theme.colors.warning }} />
                <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
                  System backup completed
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <CalendarOutlined style={{ color: theme.colors.primary }} />
                <div>
                  <div style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.medium, color: theme.colors.text.primary }}>
                    Team Meeting
                  </div>
                  <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary }}>
                    {TIME.TODAY}, 10:00 AM
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <ClockCircleOutlined style={{ color: theme.colors.success }} />
                <div>
                  <div style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.medium, color: theme.colors.text.primary }}>
                    Product Launch
                  </div>
                  <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary }}>
                    Friday, 2:00 PM
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;
