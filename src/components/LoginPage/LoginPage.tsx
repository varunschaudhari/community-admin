import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { systemAuthService } from '../../services/SystemAuthService';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  PhoneOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const { login, isLoading, error, clearError, setUser } = useAuth();
  const [userType, setUserType] = useState<'community' | 'system'>('community');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userType === 'system') {
        // System user login
        const response = await systemAuthService.login(
          formData.email,
          formData.password
        );

        if (response.success && response.data) {
          // Store system user data
          const systemUserData = {
            ...response.data.user,
            userType: 'system' as const,
            role: response.data.user.systemRole as 'Super Admin' | 'Admin' | 'Member' | 'Moderator' | 'Guest' | 'admin'
          };

          // Store in localStorage
          localStorage.setItem('systemUserType', 'system');
          localStorage.setItem('systemUser', JSON.stringify(response.data.user));
          localStorage.setItem('systemAuthToken', response.data.token);

          // Also store in standard keys for compatibility
          localStorage.setItem('user', JSON.stringify(systemUserData));
          localStorage.setItem('authToken', response.data.token);

          // Set token expiry
          const expiryTime = new Date();
          expiryTime.setHours(expiryTime.getHours() + 8);
          localStorage.setItem('tokenExpiry', expiryTime.toISOString());

          // Update auth context
          setUser(systemUserData);

          // Dispatch event for other components
          window.dispatchEvent(new CustomEvent('userDataUpdated'));

          console.log('✅ System user logged in successfully:', systemUserData.firstName, systemUserData.lastName);
        } else {
          throw new Error(response.message || 'System login failed');
        }
      } else {
        // Community user login
        await login({
          username: formData.email,
          password: formData.password
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      // Error is handled by the auth context for community users
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-section">
          <div className="logo">TC</div>
          <h1 className="title">Welcome Back</h1>
          <p className="subtitle">Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* User Type Selector */}
        <div className="user-type-selector">
          <button
            type="button"
            className={`user-type-btn ${userType === 'community' ? 'active' : ''}`}
            onClick={() => setUserType('community')}
          >
            Community User
          </button>
          <button
            type="button"
            className={`user-type-btn ${userType === 'system' ? 'active' : ''}`}
            onClick={() => setUserType('system')}
          >
            System User
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-wrapper">
              {userType === 'community' ? (
                <>
                  <PhoneOutlined className="input-icon" />
                  <input
                    type="tel"
                    name="email"
                    className="input"
                    placeholder="Mobile number (10 digits)"
                    value={formData.email}
                    onChange={handleInputChange}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                  />
                </>
              ) : (
                <>
                  <UserOutlined className="input-icon" />
                  <input
                    type="text"
                    name="email"
                    className="input"
                    placeholder="Username"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </>
              )}
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <LockOutlined className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="input"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeTwoTone />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                className="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkbox-label">Remember me</span>
            </label>
            <a href="#forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            <div className="button-content">
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRightOutlined />
                </>
              )}
            </div>
          </button>
        </form>

        <div className="divider">or continue with</div>

        <div className="social-login">
          <button className="social-button">
            <span className="social-icon">🔍</span>
            Continue with Google
          </button>
          <button className="social-button">
            <span className="social-icon">📘</span>
            Continue with Facebook
          </button>
        </div>

        <div className="signup-section">
          <p className="signup-text">Don't have an account?</p>
          <a href="#signup" className="signup-link">
            Sign up for free
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
