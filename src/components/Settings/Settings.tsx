import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLocalStorageUser } from '../../hooks/useLocalStorageUser';
import { settingsService, UserSettings } from '../../services/SettingsService';
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
  CheckOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import './Settings.css';

const Settings: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, refreshUser } = useLocalStorageUser();
  const [settings, setSettings] = useState<UserSettings>(settingsService.getDefaultSettings());
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Load settings and user data when component mounts
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = settingsService.getSettings();
      setSettings(savedSettings);

      if (user) {
        console.log('🔍 Settings - Loading user data:', user);
        setSettings(prev => ({
          ...prev,
          profile: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            bio: prev.profile.bio || '',
          },
        }));
      }
    };

    loadSettings();
    refreshUser();
  }, [user, refreshUser]);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save all settings
      settingsService.saveSettings(settings);

      // Update profile if changed
      if (user) {
        await settingsService.updateProfile(settings.profile);
      }

      // Update appearance settings (theme change)
      await settingsService.updateAppearanceSettings(settings.appearance);

      // Update notification settings
      await settingsService.updateNotificationSettings(settings.notifications);

      // Update security settings
      await settingsService.updateSecuritySettings(settings.security);

      showMessage('success', 'Settings saved successfully!');
      console.log('✅ Settings saved:', settings);
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      showMessage('error', 'Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage('error', 'New password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await settingsService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      showMessage('success', 'Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error) {
      console.error('❌ Error changing password:', error);
      showMessage('error', 'Failed to change password. Please check your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSettings = () => {
    const settingsJson = settingsService.exportSettings();
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMessage('success', 'Settings exported successfully!');
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = settingsService.importSettings(e.target?.result as string);
        if (result.success) {
          setSettings(settingsService.getSettings());
          showMessage('success', 'Settings imported successfully!');
        } else {
          showMessage('error', result.message);
        }
      } catch (error) {
        showMessage('error', 'Invalid settings file');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      settingsService.resetSettings();
      setSettings(settingsService.getDefaultSettings());
      showMessage('success', 'Settings reset to default!');
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">{SETTINGS.GENERAL}</h1>
        <p className="settings-subtitle">Manage your account settings and preferences</p>

        {/* Message Display */}
        {message && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? <CheckOutlined /> : <ExclamationCircleOutlined />}
            {message.text}
          </div>
        )}
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

          {/* Password Change Section */}
          <div className="security-item">
            <div className="security-info">
              <div className="security-title">Change Password</div>
              <div className="security-description">Update your account password</div>
            </div>
            <button
              className="button button-secondary"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              <LockOutlined />
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {/* Password Change Form */}
          {showPasswordForm && (
            <div className="password-form">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword.current ? 'text' : 'password'}
                    className="form-input"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPassword.current ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    className="form-input"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPassword.new ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    className="form-input"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPassword.confirm ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </button>
                </div>
              </div>
              <div className="form-actions">
                <button
                  className="button button-primary"
                  onClick={handlePasswordChange}
                  disabled={isLoading}
                >
                  <LockOutlined />
                  {isLoading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  className="button button-secondary"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
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

      {/* Settings Management */}
      <div className="settings-section">
        <div className="section-header">
          <div className="section-icon" style={{ '--section-color': theme.colors.accent } as React.CSSProperties}>
            <SettingOutlined />
          </div>
          <h3 className="section-title">Settings Management</h3>
        </div>
        <div className="section-body">
          <div className="settings-management">
            <div className="management-item">
              <div className="management-info">
                <div className="management-title">Export Settings</div>
                <div className="management-description">Download your settings as a JSON file</div>
              </div>
              <button className="button button-secondary" onClick={handleExportSettings}>
                <DownloadOutlined />
                Export
              </button>
            </div>

            <div className="management-item">
              <div className="management-info">
                <div className="management-title">Import Settings</div>
                <div className="management-description">Upload a settings JSON file</div>
              </div>
              <div className="file-upload">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                  id="import-settings"
                />
                <label htmlFor="import-settings" className="file-upload-label">
                  <UploadOutlined />
                  Import
                </label>
              </div>
            </div>

            <div className="management-item">
              <div className="management-info">
                <div className="management-title">Reset Settings</div>
                <div className="management-description">Reset all settings to default values</div>
              </div>
              <button className="button button-danger" onClick={handleResetSettings}>
                <ReloadOutlined />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        className="save-button"
        onClick={handleSave}
        disabled={isLoading}
      >
        <SaveOutlined />
        {isLoading ? 'Saving...' : FORMS.SAVE}
      </button>
    </div>
  );
};

export default Settings;
