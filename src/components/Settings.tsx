import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
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

const SettingsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const SettingsHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SettingsTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SettingsSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin-bottom: 0;
`;

const SettingsSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.shadow};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SectionIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ color }) => color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
  font-size: 18px;
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const SectionBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const FormInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 16px;
  z-index: 1;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  font-size: 16px;
  z-index: 1;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ToggleLabel = styled.div`
  display: flex;
  flex-direction: column;
`;

const ToggleTitle = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ToggleDescription = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`;

const ToggleSwitch = styled.button<{ active: boolean }>`
  width: 48px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.border};
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ active }) => (active ? '26px' : '2px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:hover {
    background: ${({ active, theme }) =>
    active ? theme.colors.secondary : theme.colors.text.tertiary};
  }
`;

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const ThemeOption = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) =>
    active ? 'white' : theme.colors.text.secondary};
  font-weight: ${({ active, theme }) =>
    active ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal};
  transition: all 0.3s ease;

  &:hover {
    background: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.background};
  }
`;

const SaveButton = styled.button`
  background: ${({ theme }) => theme.colors.gradient.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Settings: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    twoFactorAuth: false,
    autoBackup: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSettingToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Show success message
    console.log('Settings saved successfully');
  };

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>Settings</SettingsTitle>
        <SettingsSubtitle>
          Manage your account settings and preferences
        </SettingsSubtitle>
      </SettingsHeader>

      {/* Profile Settings */}
      <SettingsSection>
        <SectionHeader>
          <SectionIcon color={theme.colors.primary}>
            <UserOutlined />
          </SectionIcon>
          <SectionTitle>Profile Information</SectionTitle>
        </SectionHeader>
        <SectionBody>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: theme.spacing.lg
          }}>
            <FormGroup>
              <FormLabel>First Name</FormLabel>
              <InputWrapper>
                <InputIcon>
                  <UserOutlined />
                </InputIcon>
                <FormInput
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <FormLabel>Last Name</FormLabel>
              <InputWrapper>
                <InputIcon>
                  <UserOutlined />
                </InputIcon>
                <FormInput
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <FormLabel>Email Address</FormLabel>
              <InputWrapper>
                <InputIcon>
                  <MailOutlined />
                </InputIcon>
                <FormInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <FormLabel>Phone Number</FormLabel>
              <InputWrapper>
                <InputIcon>
                  <PhoneOutlined />
                </InputIcon>
                <FormInput
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </InputWrapper>
            </FormGroup>
          </div>
        </SectionBody>
      </SettingsSection>

      {/* Theme Settings */}
      <SettingsSection>
        <SectionHeader>
          <SectionIcon color={theme.colors.accent}>
            <GlobalOutlined />
          </SectionIcon>
          <SectionTitle>Appearance</SectionTitle>
        </SectionHeader>
        <SectionBody>
          <FormGroup>
            <FormLabel>Theme</FormLabel>
            <ThemeToggle onClick={toggleTheme}>
              <ThemeOption active={!isDark}>
                <SunOutlined />
                Light
              </ThemeOption>
              <ThemeOption active={isDark}>
                <MoonOutlined />
                Dark
              </ThemeOption>
            </ThemeToggle>
          </FormGroup>
        </SectionBody>
      </SettingsSection>

      {/* Notification Settings */}
      <SettingsSection>
        <SectionHeader>
          <SectionIcon color={theme.colors.warning}>
            <BellOutlined />
          </SectionIcon>
          <SectionTitle>Notifications</SectionTitle>
        </SectionHeader>
        <SectionBody>
          <ToggleContainer>
            <ToggleLabel>
              <ToggleTitle>Email Notifications</ToggleTitle>
              <ToggleDescription>
                Receive notifications via email
              </ToggleDescription>
            </ToggleLabel>
            <ToggleSwitch
              active={settings.emailNotifications}
              onClick={() => handleSettingToggle('emailNotifications')}
            />
          </ToggleContainer>

          <ToggleContainer>
            <ToggleLabel>
              <ToggleTitle>Push Notifications</ToggleTitle>
              <ToggleDescription>
                Receive push notifications in your browser
              </ToggleDescription>
            </ToggleLabel>
            <ToggleSwitch
              active={settings.pushNotifications}
              onClick={() => handleSettingToggle('pushNotifications')}
            />
          </ToggleContainer>

          <ToggleContainer>
            <ToggleLabel>
              <ToggleTitle>Marketing Emails</ToggleTitle>
              <ToggleDescription>
                Receive updates about new features and products
              </ToggleDescription>
            </ToggleLabel>
            <ToggleSwitch
              active={settings.marketingEmails}
              onClick={() => handleSettingToggle('marketingEmails')}
            />
          </ToggleContainer>
        </SectionBody>
      </SettingsSection>

      {/* Security Settings */}
      <SettingsSection>
        <SectionHeader>
          <SectionIcon color={theme.colors.error}>
            <SecurityScanOutlined />
          </SectionIcon>
          <SectionTitle>Security</SectionTitle>
        </SectionHeader>
        <SectionBody>
          <ToggleContainer>
            <ToggleLabel>
              <ToggleTitle>Two-Factor Authentication</ToggleTitle>
              <ToggleDescription>
                Add an extra layer of security to your account
              </ToggleDescription>
            </ToggleLabel>
            <ToggleSwitch
              active={settings.twoFactorAuth}
              onClick={() => handleSettingToggle('twoFactorAuth')}
            />
          </ToggleContainer>

          <ToggleContainer>
            <ToggleLabel>
              <ToggleTitle>Auto Backup</ToggleTitle>
              <ToggleDescription>
                Automatically backup your data
              </ToggleDescription>
            </ToggleLabel>
            <ToggleSwitch
              active={settings.autoBackup}
              onClick={() => handleSettingToggle('autoBackup')}
            />
          </ToggleContainer>

          <FormGroup>
            <FormLabel>Current Password</FormLabel>
            <InputWrapper>
              <InputIcon>
                <LockOutlined />
              </InputIcon>
              <FormInput
                type={showPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter your current password"
              />
              <PasswordToggle
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </PasswordToggle>
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <FormLabel>New Password</FormLabel>
            <InputWrapper>
              <InputIcon>
                <LockOutlined />
              </InputIcon>
              <FormInput
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter your new password"
              />
              <PasswordToggle
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </PasswordToggle>
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <FormLabel>Confirm New Password</FormLabel>
            <InputWrapper>
              <InputIcon>
                <LockOutlined />
              </InputIcon>
              <FormInput
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your new password"
              />
            </InputWrapper>
          </FormGroup>
        </SectionBody>
      </SettingsSection>

      {/* Save Button */}
      <div style={{ textAlign: 'center', marginTop: theme.spacing.xl }}>
        <SaveButton onClick={handleSave} disabled={isLoading}>
          <SaveOutlined />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </SaveButton>
      </div>
    </SettingsContainer>
  );
};

export default Settings;
