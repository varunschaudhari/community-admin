import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const { login, isLoading, error, clearError } = useAuth();
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
      await login({
        username: formData.email,
        password: formData.password
      });
    } catch (err) {
      // Error is handled by the auth context
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

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-wrapper">
              <MailOutlined className="input-icon" />
              <input
                type="email"
                name="email"
                className="input"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
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
