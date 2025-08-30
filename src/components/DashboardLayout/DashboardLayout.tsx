import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const navigationItems = [
    { key: 'dashboard', label: NAVIGATION.DASHBOARD, icon: <DashboardOutlined />, active: currentPage === 'dashboard' },
    { key: 'analytics', label: NAVIGATION.ANALYTICS, icon: <BarChartOutlined />, active: currentPage === 'analytics' },
    { key: 'messages', label: NAVIGATION.MESSAGES, icon: <MessageOutlined />, active: currentPage === 'messages' },
    { key: 'team', label: NAVIGATION.TEAM, icon: <TeamOutlined />, active: currentPage === 'team' },
    { key: 'documents', label: NAVIGATION.DOCUMENTS, icon: <FileTextOutlined />, active: currentPage === 'documents' },
    { key: 'user', label: NAVIGATION.USERS, icon: <UsergroupAddOutlined />, active: currentPage === 'user' },
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
                  {(user?.firstName?.charAt(0) || '') + (user?.lastName?.charAt(0) || '') || 'U'}
                </div>
                <div className="user-info">
                  <div className="user-name">{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : HEADER.USER}</div>
                  <div className="user-role">{user?.role || 'User'}</div>
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
