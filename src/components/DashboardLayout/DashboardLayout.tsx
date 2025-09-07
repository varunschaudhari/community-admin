import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalStorageUser } from '../../hooks/useLocalStorageUser';
import { NAVIGATION, HEADER, BRAND } from '../../constants';
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
  UsergroupAddOutlined,
  SafetyCertificateOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onPageChange?: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentPage = 'dashboard', onPageChange }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { userName, firstName, lastName, isLoggedIn, refreshUser } = useLocalStorageUser();

  // Debug: Log the values from useLocalStorageUser
  console.log('🔍 DashboardLayout - useLocalStorageUser values:', {
    userName,
    firstName,
    lastName,
    isLoggedIn,
    user
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Refresh user data when currentPage changes
  React.useEffect(() => {
    console.log('🔍 DashboardLayout - Page changed to:', currentPage);
    console.log('🔍 DashboardLayout - Current user data:', { userName, firstName, lastName, isLoggedIn });
    console.log('🔍 DashboardLayout - isLoggedIn calculation:', !!(localStorage.getItem('user') && localStorage.getItem('authToken')));
    console.log('🔍 DashboardLayout - localStorage user:', localStorage.getItem('user'));
    console.log('🔍 DashboardLayout - localStorage authToken:', localStorage.getItem('authToken'));
    refreshUser();
  }, [currentPage, refreshUser, userName, firstName, lastName, isLoggedIn]);


  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if it's a system user and handle logout differently
    const systemUserType = localStorage.getItem('systemUserType');
    if (systemUserType === 'system') {
      // Clear system user data without showing confirmation dialog
      localStorage.removeItem('systemUserType');
      localStorage.removeItem('systemUser');
      localStorage.removeItem('systemAuthToken');
      localStorage.removeItem('tokenExpiry');
      // Also clear any community user data if present
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');

      // Dispatch event to notify components
      window.dispatchEvent(new CustomEvent('userDataUpdated'));

      // Redirect to login page
      window.location.href = '/';
    } else {
      // Use normal logout for community users
      logout();
    }
  };

  const navigationItems = [
    { key: 'dashboard', label: NAVIGATION.DASHBOARD, icon: <DashboardOutlined />, active: currentPage === 'dashboard' },
    { key: 'analytics', label: NAVIGATION.ANALYTICS, icon: <BarChartOutlined />, active: currentPage === 'analytics' },
    { key: 'messages', label: NAVIGATION.MESSAGES, icon: <MessageOutlined />, active: currentPage === 'messages' },
    { key: 'team', label: NAVIGATION.TEAM, icon: <TeamOutlined />, active: currentPage === 'team' },
    { key: 'documents', label: NAVIGATION.DOCUMENTS, icon: <FileTextOutlined />, active: currentPage === 'documents' },
    { key: 'user', label: NAVIGATION.USERS, icon: <UsergroupAddOutlined />, active: currentPage === 'user' },
    { key: 'user-management', label: 'User Management', icon: <UserOutlined />, active: currentPage === 'user-management' },
    { key: 'system-users', label: 'System Users', icon: <UserSwitchOutlined />, active: currentPage === 'system-users' },
    { key: 'roles', label: 'Roles', icon: <SafetyCertificateOutlined />, active: currentPage === 'roles' },
    { key: 'settings', label: NAVIGATION.SETTINGS, icon: <SettingOutlined />, active: currentPage === 'settings' },
  ];

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${sidebarOpen ? 'open' : ''}`}>
        <div className={`sidebar-header ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="logo">
            <div className="logo-icon">{BRAND.SHORT_NAME}</div>
            <span className={`logo-text ${sidebarCollapsed ? 'collapsed' : ''}`}>
              {BRAND.NAME}
            </span>
          </div>
        </div>

        <nav className="nav-menu">
          {navigationItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onPageChange?.(item.key)}
              className={`nav-item ${item.active ? 'active' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay open" onClick={closeMobileSidebar} />
      )}

      {/* Main Content */}
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleMobileSidebar}>
              {sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            </button>
            <button className="menu-toggle desktop-hidden" onClick={toggleSidebar}>
              {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
          </div>

          <div className="header-center">
            <div className="search-container">
              <SearchOutlined className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder={HEADER.SEARCH_PLACEHOLDER}
              />
            </div>
          </div>

          <div className="header-right">
            <div className="header-actions">
              <button className="action-button">
                <BellOutlined />
                <div className="notification-badge"></div>
              </button>
              <button className="theme-toggle" onClick={toggleTheme}>
                {isDark ? <SunOutlined /> : <MoonOutlined />}
              </button>
            </div>

            <div className="user-menu-container">
              <div className="user-menu">
                <div className="user-avatar">
                  {isLoggedIn ? (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '') : 'U'}
                </div>
                <div className="user-info">
                  <div className="user-name">{isLoggedIn ? userName : HEADER.USER}</div>
                </div>
              </div>
            </div>

            <button className="header-logout-button" onClick={handleLogout} title={HEADER.LOGOUT}>
              <LogoutOutlined />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
