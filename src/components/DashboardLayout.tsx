import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  DashboardOutlined,
  MessageOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  SearchOutlined,
  TeamOutlined,
  BarChartOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Sidebar = styled.div<{ $collapsed: boolean }>`
  width: ${({ $collapsed }) => ($collapsed ? '80px' : '280px')};
  background: ${({ theme }) => theme.colors.sidebar.background};
  border-right: 1px solid ${({ theme }) => theme.colors.sidebar.border};
  transition: width 0.3s ease;
  position: fixed;
  height: 100vh;
  z-index: 1000;
  box-shadow: ${({ theme }) => theme.colors.shadow};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    transform: translateX(${({ $collapsed }) => ($collapsed ? '-100%' : '0')});
    width: 280px;
  }
`;

const SidebarHeader = styled.div<{ $collapsed: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.sidebar.border};
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? 'center' : 'space-between'};
  background: ${({ theme }) => theme.colors.sidebar.header};
`;

const Logo = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const LogoText = styled.span<{ $collapsed: boolean }>`
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  transition: opacity 0.3s ease;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    opacity: 1;
  }
`;

const NavMenu = styled.nav`
  padding: ${({ theme }) => theme.spacing.md};
`;

const NavItem = styled.a<{ $active?: boolean; $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.sidebar.textActive : theme.colors.sidebar.text};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $active, theme }) =>
    $active ? `${theme.colors.primary}15` : 'transparent'};
  transition: all 0.3s ease;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}10`};
    color: ${({ theme }) => theme.colors.sidebar.textActive};
  }

  .nav-text {
    opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
    transition: opacity 0.3s ease;
    white-space: nowrap;

    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      opacity: 1;
    }
  }
`;

const MainContent = styled.main<{ $sidebarCollapsed: boolean }>`
  flex: 1;
  margin-left: ${({ $sidebarCollapsed }) => ($sidebarCollapsed ? '80px' : '280px')};
  transition: margin-left 0.3s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: 0;
  }
`;

const Header = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MenuToggle = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-width: 400px;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.sm} 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 16px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const HeaderButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.gradient.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const UserName = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const UserRole = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.error}20;
    color: ${({ theme }) => theme.colors.error};
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1140px;
  margin: 0 auto;
  width: 100%;
`;

const Overlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: all 0.3s ease;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChartOutlined /> },
    { id: 'messages', label: 'Messages', icon: <MessageOutlined /> },
    { id: 'team', label: 'Team', icon: <TeamOutlined /> },
    { id: 'documents', label: 'Documents', icon: <FileTextOutlined /> },
    { id: 'settings', label: 'Settings', icon: <SettingOutlined /> },
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <LayoutContainer>
      <Overlay
        $visible={!sidebarCollapsed}
        onClick={() => setSidebarCollapsed(true)}
      />

      <Sidebar $collapsed={sidebarCollapsed}>
        <SidebarHeader $collapsed={sidebarCollapsed}>
          <Logo $collapsed={sidebarCollapsed}>
            <LogoIcon>BW</LogoIcon>
            <LogoText $collapsed={sidebarCollapsed}>Bright Web</LogoText>
          </Logo>
        </SidebarHeader>

        <NavMenu>
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              href={`#${item.id}`}
              $active={activePage === item.id}
              $collapsed={sidebarCollapsed}
              onClick={() => setActivePage(item.id)}
            >
              {item.icon}
              <span className="nav-text">{item.label}</span>
            </NavItem>
          ))}
        </NavMenu>
      </Sidebar>

      <MainContent $sidebarCollapsed={sidebarCollapsed}>
        <Header>
          <HeaderLeft>
            <MenuToggle onClick={toggleSidebar}>
              {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </MenuToggle>

            <SearchBar>
              <SearchIcon>
                <SearchOutlined />
              </SearchIcon>
              <SearchInput placeholder="Search..." />
            </SearchBar>
          </HeaderLeft>

          <HeaderRight>
            <HeaderButton onClick={toggleTheme}>
              {isDark ? <SunOutlined /> : <MoonOutlined />}
            </HeaderButton>

            <HeaderButton>
              <BellOutlined />
              <NotificationBadge>3</NotificationBadge>
            </HeaderButton>

            <UserMenu>
              <UserAvatar>
                {(user?.firstName?.charAt(0) || '') + (user?.lastName?.charAt(0) || '') || 'U'}
              </UserAvatar>
              <UserInfo>
                <UserName>{user?.firstName || ''} {user?.lastName || ''}</UserName>
                <UserRole>{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}</UserRole>
              </UserInfo>
              <LogoutButton onClick={() => logout()}>
                <LogoutOutlined />
              </LogoutButton>
            </UserMenu>
          </HeaderRight>
        </Header>

        <Content>
          {children}
        </Content>
      </MainContent>
    </LayoutContainer>
  );
};

export default DashboardLayout;
