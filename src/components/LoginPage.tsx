import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { systemAuthService } from '../services/SystemAuthService';
import { authService } from '../services/AuthService';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  ArrowRightOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  PhoneOutlined
} from '@ant-design/icons';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.gradient.primary};
  padding: ${({ theme }) => theme.spacing.md};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
`;

const LoginCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  padding: ${({ theme }) => theme.spacing.xxl};
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.lg};
    margin: ${({ theme }) => theme.spacing.sm};
  }
`;

const BrandSection = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Logo = styled.div`
  width: 64px;
  height: 64px;
  background: ${({ theme }) => theme.colors.gradient.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  font-size: 24px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormGroup = styled.div`
  position: relative;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} 48px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all 0.3s ease;
  min-height: 48px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
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

const LoginButton = styled.button`
  background: ${({ theme }) => theme.colors.gradient.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};

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

const ForgotPassword = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const UserTypeSelector = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const UserTypeButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ active, theme }) =>
    active ? theme.colors.gradient.primary : 'transparent'};
  color: ${({ active, theme }) =>
    active ? 'white' : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};

  &:hover {
    background: ${({ active, theme }) =>
    active ? theme.colors.gradient.primary : theme.colors.background};
    color: ${({ active, theme }) =>
    active ? 'white' : theme.colors.text.primary};
  }
`;

const LoginInfo = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

const LoginInfoTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const LoginInfoList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const LoginInfoItem = styled.div`
  margin-bottom: 2px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
`;

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const { login, setUser, error: authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState<'community' | 'system'>('community');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(''); // Clear error when user starts typing
    clearError(); // Clear auth error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simple validation
      if (!formData.username || !formData.password) {
        setError(userType === 'community' ? 'Please enter your mobile number and password' : 'Please fill in all fields');
        return;
      }

      if (userType === 'community') {
        // Validate mobile number format for community users
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(formData.username)) {
          setError('Please enter a valid 10-digit mobile number');
          return;
        }
      } else {
        // Validate username for system users
        if (formData.username.length < 3) {
          setError('Username must be at least 3 characters long');
          return;
        }
      }

      if (userType === 'community') {
        // Call the community login function from auth context
        await login({
          username: formData.username,
          password: formData.password,
        });
        console.log('Community login successful');
      } else {
        // Call the system login function
        const response = await systemAuthService.login(formData.username, formData.password);

        if (response.success) {
          console.log('System login successful');

          // For system users, we'll use the community auth context to maintain session
          // Store the system user data in the same format as community users
          const systemUserData = {
            _id: response.data.user._id,
            username: response.data.user.username,
            email: response.data.user.email,
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            role: response.data.user.systemRole as 'Super Admin' | 'Admin' | 'Member' | 'Moderator' | 'Guest' | 'admin',
            userType: 'system' as const,
            department: response.data.user.department,
            employeeId: response.data.user.employeeId,
            accessLevel: response.data.user.accessLevel,
            verified: response.data.user.verified,
            isActive: response.data.user.isActive,
            createdAt: response.data.user.createdAt,
            updatedAt: response.data.user.updatedAt
          };

          // Debug: Log the system user data being stored
          console.log('🔍 System User Data to be stored:', systemUserData);
          console.log('🔍 Original response data:', response.data.user);

          // Follow the exact same pattern as community users
          // 1. Store token and user data using AuthService methods (this stores in 'authToken' and 'user' keys)
          authService.setToken(response.data.token);
          authService.setUser(systemUserData);

          // 2. Set token expiry time (8 hours for system users)
          const expiryTime = new Date();
          expiryTime.setHours(expiryTime.getHours() + 8);
          localStorage.setItem('tokenExpiry', expiryTime.toISOString());

          console.log('🔍 LoginPage - Set token expiry for system user:', expiryTime.toISOString());
          console.log('🔍 LoginPage - Current time:', new Date().toISOString());
          console.log('🔍 LoginPage - Time until expiry:', Math.round((expiryTime.getTime() - new Date().getTime()) / 60000), 'minutes');

          // 3. Update AuthContext state (same as community users)
          setUser(systemUserData);

          // 4. Also store system-specific data for System User Management
          localStorage.setItem('systemUserType', 'system');
          localStorage.setItem('systemUser', JSON.stringify(response.data.user));
          localStorage.setItem('systemAuthToken', response.data.token);

          // Debug: Check what's actually in localStorage
          console.log('🔍 LoginPage - Final localStorage check:');
          console.log('  user:', localStorage.getItem('user'));
          console.log('  authToken:', localStorage.getItem('authToken'));
          console.log('  tokenExpiry:', localStorage.getItem('tokenExpiry'));
        } else {
          throw new Error(response.message || 'System login failed');
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <BrandSection>
          <Logo>BW</Logo>
          <Title>Welcome Back</Title>
          <Subtitle>Sign in to your Bright Web Dashboard</Subtitle>
        </BrandSection>

        <Form onSubmit={handleSubmit}>
          <UserTypeSelector>
            <UserTypeButton
              type="button"
              active={userType === 'community'}
              onClick={() => setUserType('community')}
            >
              <TeamOutlined />
              Community User
            </UserTypeButton>
            <UserTypeButton
              type="button"
              active={userType === 'system'}
              onClick={() => setUserType('system')}
            >
              <UserSwitchOutlined />
              System User
            </UserTypeButton>
          </UserTypeSelector>

          <FormGroup>
            <InputWrapper>
              <InputIcon>
                {userType === 'community' ? <PhoneOutlined /> : <UserOutlined />}
              </InputIcon>
              <Input
                type={userType === 'community' ? 'tel' : 'text'}
                name="username"
                placeholder={userType === 'community' ? 'Enter your mobile number' : 'Enter your username'}
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <InputWrapper>
              <InputIcon>
                <LockOutlined />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              </PasswordToggle>
            </InputWrapper>
          </FormGroup>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
            <ArrowRightOutlined />
          </LoginButton>

          <ForgotPassword href="#forgot-password">
            Forgot your password?
          </ForgotPassword>

          {(error || authError) && <ErrorMessage>{error || authError}</ErrorMessage>}
        </Form>

        <LoginInfo>
          <LoginInfoTitle>
            <UserOutlined />
            {userType === 'community' ? 'Community User' : 'System User'} Login Credentials
          </LoginInfoTitle>
          {userType === 'community' ? (
            <LoginInfoList>
              <LoginInfoItem>Super Admin: 9876543211 / varun123</LoginInfoItem>
              <LoginInfoItem>Admin: 9876543210 / admin123</LoginInfoItem>
              <LoginInfoItem>Moderator: 9876543212 / moderator123</LoginInfoItem>
              <LoginInfoItem>Member: 9876543213 / member123</LoginInfoItem>
            </LoginInfoList>
          ) : (
            <LoginInfoList>
              <LoginInfoItem>System Admin: sysadmin / SystemAdmin123!@#</LoginInfoItem>
              <LoginInfoItem>System Manager: sysmanager / SystemManager123!@#</LoginInfoItem>
              <LoginInfoItem>System Operator: sysoperator / SystemOperator123!@#</LoginInfoItem>
              <LoginInfoItem>System Viewer: sysviewer / SystemViewer123!@#</LoginInfoItem>
            </LoginInfoList>
          )}
        </LoginInfo>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
