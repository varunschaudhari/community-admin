import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FORMS, ERRORS, SUCCESS } from '../../constants';
import { userService } from '../../services/UserService';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import './User.css';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface ValidationState {
  firstName: 'neutral' | 'valid' | 'invalid';
  lastName: 'neutral' | 'valid' | 'invalid';
  email: 'neutral' | 'valid' | 'invalid';
  password: 'neutral' | 'valid' | 'invalid';
  confirmPassword: 'neutral' | 'valid' | 'invalid';
}

const User: React.FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [validationState, setValidationState] = useState<ValidationState>({
    firstName: 'neutral',
    lastName: 'neutral',
    email: 'neutral',
    password: 'neutral',
    confirmPassword: 'neutral',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Real-time validation
  useEffect(() => {
    validateField('firstName', formData.firstName);
  }, [formData.firstName]);

  useEffect(() => {
    validateField('lastName', formData.lastName);
  }, [formData.lastName]);

  useEffect(() => {
    validateField('email', formData.email);
  }, [formData.email]);

  useEffect(() => {
    validateField('password', formData.password);
  }, [formData.password]);

  useEffect(() => {
    validateField('confirmPassword', formData.confirmPassword);
  }, [formData.confirmPassword]);

  const validateField = (field: keyof FormData, value: string) => {
    const newErrors = { ...errors };
    const newValidationState = { ...validationState };

    switch (field) {
      case 'firstName':
        if (!value.trim()) {
          newErrors.firstName = ERRORS.REQUIRED_FIELD;
          newValidationState.firstName = 'invalid';
        } else if (value.trim().length < 2) {
          newErrors.firstName = 'First name must be at least 2 characters';
          newValidationState.firstName = 'invalid';
        } else {
          delete newErrors.firstName;
          newValidationState.firstName = 'valid';
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          newErrors.lastName = ERRORS.REQUIRED_FIELD;
          newValidationState.lastName = 'invalid';
        } else if (value.trim().length < 2) {
          newErrors.lastName = 'Last name must be at least 2 characters';
          newValidationState.lastName = 'invalid';
        } else {
          delete newErrors.lastName;
          newValidationState.lastName = 'valid';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = ERRORS.REQUIRED_FIELD;
          newValidationState.email = 'invalid';
        } else if (!emailRegex.test(value)) {
          newErrors.email = ERRORS.INVALID_EMAIL;
          newValidationState.email = 'invalid';
        } else {
          delete newErrors.email;
          newValidationState.email = 'valid';
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = ERRORS.REQUIRED_FIELD;
          newValidationState.password = 'invalid';
        } else if (value.length < 8) {
          newErrors.password = ERRORS.PASSWORD_TOO_SHORT;
          newValidationState.password = 'invalid';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          newErrors.password = 'Password must contain uppercase, lowercase, and number';
          newValidationState.password = 'invalid';
        } else {
          delete newErrors.password;
          newValidationState.password = 'valid';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = ERRORS.REQUIRED_FIELD;
          newValidationState.confirmPassword = 'invalid';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = ERRORS.PASSWORDS_DONT_MATCH;
          newValidationState.confirmPassword = 'invalid';
        } else {
          delete newErrors.confirmPassword;
          newValidationState.confirmPassword = 'valid';
        }
        break;
    }

    setErrors(newErrors);
    setValidationState(newValidationState);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setSubmitMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      validateField(key as keyof FormData, formData[key as keyof FormData]);
    });

    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsLoading(true);
    setSubmitMessage(null);

    try {
      const response = await userService.createUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response.success) {
        setSubmitMessage({
          type: 'success',
          message: SUCCESS.CREATED
        });
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        setValidationState({
          firstName: 'neutral',
          lastName: 'neutral',
          email: 'neutral',
          password: 'neutral',
          confirmPassword: 'neutral',
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        message: error instanceof Error ? error.message : ERRORS.NETWORK_ERROR
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
    setValidationState({
      firstName: 'neutral',
      lastName: 'neutral',
      email: 'neutral',
      password: 'neutral',
      confirmPassword: 'neutral',
    });
    setSubmitMessage(null);
  };

  const getInputClassName = (field: keyof FormData) => {
    const baseClass = 'form-input';
    const state = validationState[field];
    
    if (state === 'valid') return `${baseClass} success`;
    if (state === 'invalid') return `${baseClass} error`;
    return baseClass;
  };

  const getValidationIcon = (state: 'neutral' | 'valid' | 'invalid') => {
    switch (state) {
      case 'valid':
        return <CheckCircleOutlined style={{ color: theme.colors.success }} />;
      case 'invalid':
        return <CloseCircleOutlined style={{ color: theme.colors.error }} />;
      default:
        return null;
    }
  };

  const isFormValid = () => {
    return Object.keys(errors).length === 0 && 
           Object.values(validationState).every(state => state === 'valid');
  };

  return (
    <div className="user-container">
      <div className="user-header">
        <h1 className="user-title">Create New User</h1>
        <p className="user-subtitle">Add a new user to the system with their details</p>
      </div>

      {submitMessage && (
        <div className={submitMessage.type === 'success' ? 'success-message' : 'error-message'}>
          <span className={submitMessage.type === 'success' ? 'success-icon' : 'error-icon'}>
            {submitMessage.type === 'success' ? '✅' : '⚠️'}
          </span>
          {submitMessage.message}
        </div>
      )}

      <form className="user-form" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              {FORMS.FIRST_NAME} *
            </label>
            <div className="input-wrapper">
              <UserOutlined className="input-icon" />
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={`${getInputClassName('firstName')} input-with-icon`}
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                aria-describedby="firstName-error"
              />
            </div>
            {errors.firstName && (
              <div className="validation-message invalid" id="firstName-error">
                {getValidationIcon(validationState.firstName)}
                {errors.firstName}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              {FORMS.LAST_NAME} *
            </label>
            <div className="input-wrapper">
              <UserOutlined className="input-icon" />
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={`${getInputClassName('lastName')} input-with-icon`}
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                aria-describedby="lastName-error"
              />
            </div>
            {errors.lastName && (
              <div className="validation-message invalid" id="lastName-error">
                {getValidationIcon(validationState.lastName)}
                {errors.lastName}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            {FORMS.EMAIL} *
          </label>
          <div className="input-wrapper">
            <MailOutlined className="input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              className={`${getInputClassName('email')} input-with-icon`}
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleInputChange}
              required
              aria-describedby="email-error"
            />
          </div>
          {errors.email && (
            <div className="validation-message invalid" id="email-error">
              {getValidationIcon(validationState.email)}
              {errors.email}
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {FORMS.PASSWORD} *
            </label>
            <div className="input-wrapper">
              <LockOutlined className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`${getInputClassName('password')} input-with-icon password-input`}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                required
                aria-describedby="password-error"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeTwoTone />}
              </button>
            </div>
            {errors.password && (
              <div className="validation-message invalid" id="password-error">
                {getValidationIcon(validationState.password)}
                {errors.password}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              {FORMS.CONFIRM_PASSWORD} *
            </label>
            <div className="input-wrapper">
              <LockOutlined className="input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className={`${getInputClassName('confirmPassword')} input-with-icon password-input`}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                aria-describedby="confirmPassword-error"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeTwoTone />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="validation-message invalid" id="confirmPassword-error">
                {getValidationIcon(validationState.confirmPassword)}
                {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isLoading}
          >
            {FORMS.RESET}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <>
                <LoadingOutlined className="loading-spinner" />
                Creating...
              </>
            ) : (
              <>
                <UserOutlined />
                {FORMS.CREATE} User
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default User;
