import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { SETTINGS, FORMS, SUCCESS } from '../../constants';
import {
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  SecurityScanOutlined,
  GlobalOutlined,
  SunOutlined,
  MoonOutlined,
  SaveOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import './Settings.css';

const Settings: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      bio: 'Software developer with 5+ years of experience in web development.',
    },
    notifications: {
      email: true,
      push: false,
      sms: true,
      marketing: false,
    },
    security: {
      twoFactor: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
    },
    appearance: {
      theme: isDark ? 'dark' : 'light',
      language: 'en',
      timezone: 'UTC',
    },
  });

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    // Save settings logic here
    console.log('Settings saved:', settings);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">{SETTINGS.GENERAL}</h1>
        <p className="settings-subtitle">Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="settings-section">
        <div className="section-header">
          <div className="section-icon" style={{ '--section-color': theme.colors.primary } as React.CSSProperties}>
            <UserOutlined />
          </div>
          <h3 className="section-title">Profile Information</h3>
        </div>
        <div className="section-body">
          <div className="settings-grid">
            <div className="form-group">
              <label className="form-label">{FORMS.FIRST_NAME}</label>
              <input
                type="text"
                className="form-input"
                value={settings.profile.firstName}
                onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{FORMS.LAST_NAME}</label>
              <input
                type="text"
                className="form-input"
                value={settings.profile.lastName}
                onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{FORMS.EMAIL}</label>
              <input
                type="email"
                className="form-input"
                value={settings.profile.email}
                onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{FORMS.PHONE}</label>
              <input
                type="tel"
                className="form-input"
                value={settings.profile.phone}
                onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              className="form-textarea"
              value={settings.profile.bio}
              onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="settings-section">
        <div className="section-header">
          <div className="section-icon" style={{ '--section-color': theme.colors.warning } as React.CSSProperties}>
            <BellOutlined />
          </div>
          <h3 className="section-title">{SETTINGS.NOTIFICATIONS}</h3>
        </div>
        <div className="section-body">
          <div className="notification-item">
            <div className="notification-info">
              <div className="notification-title">Email Notifications</div>
              <div className="notification-description">Receive notifications via email</div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => handleInputChange('notifications', 'email', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="notification-item">
            <div className="notification-info">
              <div className="notification-title">Push Notifications</div>
              <div className="notification-description">Receive push notifications in browser</div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => handleInputChange('notifications', 'push', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="notification-item">
            <div className="notification-info">
              <div className="notification-title">SMS Notifications</div>
              <div className="notification-description">Receive notifications via SMS</div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={(e) => handleInputChange('notifications', 'sms', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="settings-section">
        <div className="section-header">
          <div className="section-icon" style={{ '--section-color': theme.colors.error } as React.CSSProperties}>
            <SecurityScanOutlined />
          </div>
          <h3 className="section-title">{SETTINGS.SECURITY}</h3>
        </div>
        <div className="section-body">
          <div className="security-item">
            <div className="security-info">
              <div className="security-title">Two-Factor Authentication</div>
              <div className="security-description">Add an extra layer of security to your account</div>
            </div>
            <div className="security-status">
              <span className={`status-badge ${settings.security.twoFactor ? 'enabled' : 'disabled'}`}>
                {settings.security.twoFactor ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          <div className="security-item">
            <div className="security-info">
              <div className="security-title">Session Timeout</div>
              <div className="security-description">Automatically log out after inactivity</div>
            </div>
            <select
              className="form-select"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="settings-section">
        <div className="section-header">
          <div className="section-icon" style={{ '--section-color': theme.colors.accent } as React.CSSProperties}>
            <GlobalOutlined />
          </div>
          <h3 className="section-title">{SETTINGS.APPEARANCE}</h3>
        </div>
        <div className="section-body">
          <div className="form-group">
            <label className="form-label">{SETTINGS.THEME}</label>
            <div className="theme-options">
              <div
                className={`theme-option ${settings.appearance.theme === 'light' ? 'selected' : ''}`}
                onClick={() => handleInputChange('appearance', 'theme', 'light')}
              >
                <SunOutlined className="theme-option-icon" />
                <span className="theme-option-text">{SETTINGS.LIGHT_MODE}</span>
              </div>
              <div
                className={`theme-option ${settings.appearance.theme === 'dark' ? 'selected' : ''}`}
                onClick={() => handleInputChange('appearance', 'theme', 'dark')}
              >
                <MoonOutlined className="theme-option-icon" />
                <span className="theme-option-text">{SETTINGS.DARK_MODE}</span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{SETTINGS.LANGUAGE}</label>
            <select
              className="form-select"
              value={settings.appearance.language}
              onChange={(e) => handleInputChange('appearance', 'language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button className="save-button" onClick={handleSave}>
        <SaveOutlined />
        {FORMS.SAVE}
      </button>
    </div>
  );
};

export default Settings;
