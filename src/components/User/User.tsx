import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FORMS, ERRORS, SUCCESS, ROLES, MARITAL_STATUS } from '../../constants';
import { userService } from '../../services/UserService';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  TeamOutlined,
  HomeOutlined,
  HeartOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SearchOutlined,
  DownOutlined,
} from '@ant-design/icons';
import './User.css';

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  pan: string;
  adhar: string;
  maritalStatus: string;
  dateOfBirth: string;
  roles: string;
  kul: string;
  gotra: string;
  fatherName: string;
  motherName: string;
  childrenName: string;
  dateOfMarriage: string;
}

interface ValidationErrors {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  pan?: string;
  adhar?: string;
  maritalStatus?: string;
  dateOfBirth?: string;
  roles?: string;
  kul?: string;
  gotra?: string;
  fatherName?: string;
  motherName?: string;
  childrenName?: string;
  dateOfMarriage?: string;
}

interface ValidationState {
  firstName: 'neutral' | 'valid' | 'invalid';
  middleName: 'neutral' | 'valid' | 'invalid';
  lastName: 'neutral' | 'valid' | 'invalid';
  email: 'neutral' | 'valid' | 'invalid';
  phone: 'neutral' | 'valid' | 'invalid';
  password: 'neutral' | 'valid' | 'invalid';
  pan: 'neutral' | 'valid' | 'invalid';
  adhar: 'neutral' | 'valid' | 'invalid';
  maritalStatus: 'neutral' | 'valid' | 'invalid';
  dateOfBirth: 'neutral' | 'valid' | 'invalid';
  roles: 'neutral' | 'valid' | 'invalid';
  kul: 'neutral' | 'valid' | 'invalid';
  gotra: 'neutral' | 'valid' | 'invalid';
  fatherName: 'neutral' | 'valid' | 'invalid';
  motherName: 'neutral' | 'valid' | 'invalid';
  childrenName: 'neutral' | 'valid' | 'invalid';
  dateOfMarriage: 'neutral' | 'valid' | 'invalid';
}

interface AutocompleteOption {
  id: string;
  name: string;
  type: 'father' | 'mother' | 'children';
}

const User: React.FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    pan: '',
    adhar: '',
    maritalStatus: '',
    dateOfBirth: '',
    roles: '',
    kul: '',
    gotra: '',
    fatherName: '',
    motherName: '',
    childrenName: '',
    dateOfMarriage: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [validationState, setValidationState] = useState<ValidationState>({
    firstName: 'neutral',
    middleName: 'neutral',
    lastName: 'neutral',
    email: 'neutral',
    phone: 'neutral',
    password: 'neutral',
    pan: 'neutral',
    adhar: 'neutral',
    maritalStatus: 'neutral',
    dateOfBirth: 'neutral',
    roles: 'neutral',
    kul: 'neutral',
    gotra: 'neutral',
    fatherName: 'neutral',
    motherName: 'neutral',
    childrenName: 'neutral',
    dateOfMarriage: 'neutral',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Autocomplete states
  const [autocompleteOptions, setAutocompleteOptions] = useState<AutocompleteOption[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState<{ [key: string]: boolean }>({});
  const [autocompleteLoading, setAutocompleteLoading] = useState<{ [key: string]: boolean }>({});

  // Debounced search for autocomplete
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Real-time validation effects
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
    validateField('phone', formData.phone);
  }, [formData.phone]);

  useEffect(() => {
    validateField('password', formData.password);
  }, [formData.password]);

  useEffect(() => {
    validateField('pan', formData.pan);
  }, [formData.pan]);

  useEffect(() => {
    validateField('adhar', formData.adhar);
  }, [formData.adhar]);

  useEffect(() => {
    validateField('dateOfBirth', formData.dateOfBirth);
  }, [formData.dateOfBirth]);

  useEffect(() => {
    validateField('dateOfMarriage', formData.dateOfMarriage);
  }, [formData.dateOfMarriage]);

  useEffect(() => {
    validateField('roles', formData.roles);
  }, [formData.roles]);

  const validateField = (field: keyof FormData, value: string | string[]) => {
    const newErrors = { ...errors };
    const newValidationState = { ...validationState };

    switch (field) {
      case 'firstName':
        if (!value || typeof value === 'string' && !value.trim()) {
          newErrors.firstName = ERRORS.REQUIRED_FIELD;
          newValidationState.firstName = 'invalid';
        } else if (typeof value === 'string' && value.trim().length < 2) {
          newErrors.firstName = 'First name must be at least 2 characters';
          newValidationState.firstName = 'invalid';
        } else {
          delete newErrors.firstName;
          newValidationState.firstName = 'valid';
        }
        break;

      case 'lastName':
        if (!value || typeof value === 'string' && !value.trim()) {
          newErrors.lastName = ERRORS.REQUIRED_FIELD;
          newValidationState.lastName = 'invalid';
        } else if (typeof value === 'string' && value.trim().length < 2) {
          newErrors.lastName = 'Last name must be at least 2 characters';
          newValidationState.lastName = 'invalid';
        } else {
          delete newErrors.lastName;
          newValidationState.lastName = 'valid';
        }
        break;

      case 'email':
        if (!value || typeof value === 'string' && !value.trim()) {
          newErrors.email = ERRORS.REQUIRED_FIELD;
          newValidationState.email = 'invalid';
        } else if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = ERRORS.INVALID_EMAIL;
          newValidationState.email = 'invalid';
        } else {
          delete newErrors.email;
          newValidationState.email = 'valid';
        }
        break;

      case 'phone':
        if (!value || typeof value === 'string' && !value.trim()) {
          newErrors.phone = ERRORS.REQUIRED_FIELD;
          newValidationState.phone = 'invalid';
        } else if (typeof value === 'string' && !/^[6-9]\d{9}$/.test(value.replace(/\D/g, ''))) {
          newErrors.phone = ERRORS.INVALID_PHONE;
          newValidationState.phone = 'invalid';
        } else {
          delete newErrors.phone;
          newValidationState.phone = 'valid';
        }
        break;

      case 'password':
        if (!value || typeof value === 'string' && !value.trim()) {
          newErrors.password = ERRORS.REQUIRED_FIELD;
          newValidationState.password = 'invalid';
        } else if (typeof value === 'string' && value.length < 8) {
          newErrors.password = ERRORS.PASSWORD_TOO_SHORT;
          newValidationState.password = 'invalid';
        } else {
          delete newErrors.password;
          newValidationState.password = 'valid';
        }
        break;

      case 'pan':
        if (value && typeof value === 'string' && value.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase())) {
          newErrors.pan = ERRORS.INVALID_PAN;
          newValidationState.pan = 'invalid';
        } else {
          delete newErrors.pan;
          newValidationState.pan = value && typeof value === 'string' && value.trim() ? 'valid' : 'neutral';
        }
        break;

      case 'adhar':
        if (value && typeof value === 'string' && value.trim() && !/^\d{12}$/.test(value.replace(/\D/g, ''))) {
          newErrors.adhar = ERRORS.INVALID_ADHAR;
          newValidationState.adhar = 'invalid';
        } else {
          delete newErrors.adhar;
          newValidationState.adhar = value && typeof value === 'string' && value.trim() ? 'valid' : 'neutral';
        }
        break;

      case 'dateOfBirth':
        if (value && typeof value === 'string' && value.trim()) {
          const date = new Date(value);
          const today = new Date();
          if (isNaN(date.getTime())) {
            newErrors.dateOfBirth = ERRORS.INVALID_DATE;
            newValidationState.dateOfBirth = 'invalid';
          } else if (date > today) {
            newErrors.dateOfBirth = ERRORS.FUTURE_DATE_NOT_ALLOWED;
            newValidationState.dateOfBirth = 'invalid';
          } else {
            delete newErrors.dateOfBirth;
            newValidationState.dateOfBirth = 'valid';
          }
        } else {
          delete newErrors.dateOfBirth;
          newValidationState.dateOfBirth = 'neutral';
        }
        break;

      case 'dateOfMarriage':
        if (value && typeof value === 'string' && value.trim()) {
          const date = new Date(value);
          const today = new Date();
          if (isNaN(date.getTime())) {
            newErrors.dateOfMarriage = ERRORS.INVALID_DATE;
            newValidationState.dateOfMarriage = 'invalid';
          } else if (date > today) {
            newErrors.dateOfMarriage = ERRORS.FUTURE_DATE_NOT_ALLOWED;
            newValidationState.dateOfMarriage = 'invalid';
          } else {
            delete newErrors.dateOfMarriage;
            newValidationState.dateOfMarriage = 'valid';
          }
        } else {
          delete newErrors.dateOfMarriage;
          newValidationState.dateOfMarriage = 'neutral';
        }
        break;

      case 'roles':
        if (!value || typeof value === 'string' && !value.trim()) {
          newErrors.roles = ERRORS.REQUIRED_FIELD;
          newValidationState.roles = 'invalid';
        } else {
          delete newErrors.roles;
          newValidationState.roles = 'valid';
        }
        break;
    }

    setErrors(newErrors);
    setValidationState(newValidationState);
  };

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear submit message when user starts typing
    if (submitMessage) {
      setSubmitMessage(null);
    }
  };

  const handleAutocompleteSearch = useCallback(async (field: string, query: string) => {
    if (!query.trim()) {
      setAutocompleteOptions([]);
      setShowAutocomplete(prev => ({ ...prev, [field]: false }));
      return;
    }

    setAutocompleteLoading(prev => ({ ...prev, [field]: true }));

    try {
      // Simulate API call - replace with actual API endpoint
      const response = await userService.searchMembers(query, field as 'father' | 'mother' | 'children');
      setAutocompleteOptions(response);
      setShowAutocomplete(prev => ({ ...prev, [field]: true }));
    } catch (error) {
      console.error('Autocomplete search error:', error);
      setAutocompleteOptions([]);
    } finally {
      setAutocompleteLoading(prev => ({ ...prev, [field]: false }));
    }
  }, []);

  const debouncedSearch = useCallback((field: string, query: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      handleAutocompleteSearch(field, query);
    }, 300);

    setSearchTimeout(timeout);
  }, [handleAutocompleteSearch, searchTimeout]);

  const handleAutocompleteInputChange = (field: keyof FormData, value: string) => {
    handleInputChange(field, value);
    debouncedSearch(field, value);
  };

  const handleAutocompleteSelect = (field: keyof FormData, option: AutocompleteOption) => {
    handleInputChange(field, option.name);
    setShowAutocomplete(prev => ({ ...prev, [field]: false }));
    setAutocompleteOptions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const requiredFields: (keyof FormData)[] = ['firstName', 'lastName', 'email', 'phone', 'password', 'maritalStatus', 'dateOfBirth', 'roles'];
    const newErrors: ValidationErrors = {};

    requiredFields.forEach(field => {
      const value = formData[field];
      if (!value || (typeof value === 'string' && !value.trim())) {
        newErrors[field] = ERRORS.REQUIRED_FIELD;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setSubmitMessage(null);

    try {
      await userService.createMember(formData);
      setSubmitMessage({ type: 'success', message: SUCCESS.CREATED });
      // Reset form after successful submission
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        pan: '',
        adhar: '',
        maritalStatus: '',
        dateOfBirth: '',
        roles: '',
        kul: '',
        gotra: '',
        fatherName: '',
        motherName: '',
        childrenName: '',
        dateOfMarriage: '',
      });
      setErrors({});
      setValidationState({
        firstName: 'neutral',
        middleName: 'neutral',
        lastName: 'neutral',
        email: 'neutral',
        phone: 'neutral',
        password: 'neutral',
        pan: 'neutral',
        adhar: 'neutral',
        maritalStatus: 'neutral',
        dateOfBirth: 'neutral',
        roles: 'neutral',
        kul: 'neutral',
        gotra: 'neutral',
        fatherName: 'neutral',
        motherName: 'neutral',
        childrenName: 'neutral',
        dateOfMarriage: 'neutral',
      });
    } catch (error) {
      setSubmitMessage({ type: 'error', message: ERRORS.SERVER_ERROR });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      pan: '',
      adhar: '',
      maritalStatus: '',
      dateOfBirth: '',
      roles: '',
      kul: '',
      gotra: '',
      fatherName: '',
      motherName: '',
      childrenName: '',
      dateOfMarriage: '',
    });
    setErrors({});
    setValidationState({
      firstName: 'neutral',
      middleName: 'neutral',
      lastName: 'neutral',
      email: 'neutral',
      phone: 'neutral',
      password: 'neutral',
      pan: 'neutral',
      adhar: 'neutral',
      maritalStatus: 'neutral',
      dateOfBirth: 'neutral',
      roles: 'neutral',
      kul: 'neutral',
      gotra: 'neutral',
      fatherName: 'neutral',
      motherName: 'neutral',
      childrenName: 'neutral',
      dateOfMarriage: 'neutral',
    });
    setSubmitMessage(null);
  };

  const isMarried = formData.maritalStatus === MARITAL_STATUS.MARRIED;

  return (
    <div className="user-container">
      <div className="user-header">
        <h1 className="user-title">{FORMS.CREATE_USER}</h1>
        <p className="user-subtitle">{FORMS.USER_CREATION_SUBTITLE}</p>
      </div>

      {submitMessage && (
        <div className={`submit-message ${submitMessage.type}`}>
          {submitMessage.type === 'success' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          <span>{submitMessage.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="user-form">
        {/* Personal Information Section */}
        <div className="form-section">
          <h3 className="section-title">
            <UserOutlined />
            Personal Information
          </h3>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                {FORMS.FIRST_NAME} <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`form-input ${validationState.firstName}`}
                  placeholder="Enter first name"
                />
                {validationState.firstName === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                {validationState.firstName === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
              </div>
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="middleName" className="form-label">
                {FORMS.MIDDLE_NAME}
              </label>
              <input
                type="text"
                id="middleName"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                className="form-input"
                placeholder="Enter middle name (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                {FORMS.LAST_NAME} <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`form-input ${validationState.lastName}`}
                  placeholder="Enter last name"
                />
                {validationState.lastName === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                {validationState.lastName === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
              </div>
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {FORMS.EMAIL} <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                {/* <MailOutlined className="input-icon" /> */}
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`form-input ${validationState.email}`}
                  placeholder="Enter email address"
                />
                {validationState.email === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                {validationState.email === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                {FORMS.PASSWORD} <span className="required">*</span>
              </label>
              <div className="input-wrapper password-input-wrapper">
                {/* <LockOutlined className="input-icon" /> */}
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`form-input ${validationState.password}`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeTwoTone />}
                </button>
                {validationState.password === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                {validationState.password === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                {FORMS.PHONE} <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <PhoneOutlined className="input-icon" />
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`form-input ${validationState.phone}`}
                  placeholder="Enter phone number"
                  maxLength={10}
                />
                {validationState.phone === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                {validationState.phone === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
              </div>
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>
        </div>

        {/* Identity Documents Section */}
        <div className="form-section">
          <h3 className="section-title">
            <IdcardOutlined />
            Identity Documents
          </h3>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="pan" className="form-label">
                {FORMS.PAN}
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="pan"
                  value={formData.pan}
                  onChange={(e) => handleInputChange('pan', e.target.value.toUpperCase())}
                  className={`form-input ${validationState.pan}`}
                  placeholder="Enter PAN number"
                  maxLength={10}
                />
                {validationState.pan === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                {validationState.pan === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
              </div>
              {errors.pan && <span className="error-message">{errors.pan}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="adhar" className="form-label">
                {FORMS.ADHAR}
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="adhar"
                  value={formData.adhar}
                  onChange={(e) => handleInputChange('adhar', e.target.value.replace(/\D/g, ''))}
                  className={`form-input ${validationState.adhar}`}
                  placeholder="Enter Aadhaar number"
                  maxLength={12}
                />
                {validationState.adhar === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                {validationState.adhar === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
              </div>
              {errors.adhar && <span className="error-message">{errors.adhar}</span>}
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="form-section">
          <h3 className="section-title">
            <CalendarOutlined />
            Personal Details
          </h3>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="maritalStatus" className="form-label">
                {FORMS.MARITAL_STATUS} <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                  className={`form-select ${validationState.maritalStatus}`}
                >
                  <option value="">Select marital status</option>
                  {Object.values(MARITAL_STATUS).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <DownOutlined className="select-arrow" />
              </div>
              {errors.maritalStatus && <span className="error-message">{errors.maritalStatus}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth" className="form-label">
                {FORMS.DOB} <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <CalendarOutlined className="input-icon" />
                <input
                  type="date"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className={`form-input ${validationState.dateOfBirth}`}
                />
                {validationState.dateOfBirth === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                {validationState.dateOfBirth === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
              </div>
              {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
            </div>

            {isMarried && (
              <div className="form-group">
                <label htmlFor="dateOfMarriage" className="form-label">
                  {FORMS.DATE_OF_MARRIAGE}
                </label>
                <div className="input-wrapper">
                  <CalendarOutlined className="input-icon" />
                  <input
                    type="date"
                    id="dateOfMarriage"
                    value={formData.dateOfMarriage}
                    onChange={(e) => handleInputChange('dateOfMarriage', e.target.value)}
                    className={`form-input ${validationState.dateOfMarriage}`}
                  />
                  {validationState.dateOfMarriage === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                  {validationState.dateOfMarriage === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
                </div>
                {errors.dateOfMarriage && <span className="error-message">{errors.dateOfMarriage}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Community Information Section */}
        <div className="form-section">
          <h3 className="section-title">
            <TeamOutlined />
            Community Information
          </h3>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="roles" className="form-label">
                {FORMS.ROLE} <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="roles"
                  value={formData.roles}
                  onChange={(e) => handleInputChange('roles', e.target.value)}
                  className={`form-select ${validationState.roles}`}
                >
                  <option value="">Select role</option>
                  {Object.values(ROLES).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <DownOutlined className="select-arrow" />
              </div>
              {errors.roles && <span className="error-message">{errors.roles}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="kul" className="form-label">
                {FORMS.KUL}
              </label>
              <input
                type="text"
                id="kul"
                value={formData.kul}
                onChange={(e) => handleInputChange('kul', e.target.value)}
                className="form-input"
                placeholder="Enter Kul (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gotra" className="form-label">
                {FORMS.GOTRA}
              </label>
              <input
                type="text"
                id="gotra"
                value={formData.gotra}
                onChange={(e) => handleInputChange('gotra', e.target.value)}
                className="form-input"
                placeholder="Enter Gotra (optional)"
              />
            </div>
          </div>
        </div>

        {/* Family Information Section */}
        <div className="form-section">
          <h3 className="section-title">
            <HomeOutlined />
            Family Information
          </h3>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fatherName" className="form-label">
                {FORMS.FATHER_NAME}
              </label>
              <div className="autocomplete-wrapper">
                <div className="input-wrapper">
                  <UserOutlined className="input-icon" />
                  <input
                    type="text"
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => handleAutocompleteInputChange('fatherName', e.target.value)}
                    className="form-input"
                    placeholder="Search for father's name"
                    onFocus={() => setShowAutocomplete(prev => ({ ...prev, fatherName: true }))}
                  />
                  {autocompleteLoading.fatherName && <LoadingOutlined className="loading-icon" />}
                </div>
                {showAutocomplete.fatherName && autocompleteOptions.length > 0 && (
                  <div className="autocomplete-dropdown">
                    {autocompleteOptions.map(option => (
                      <div
                        key={option.id}
                        className="autocomplete-option"
                        onClick={() => handleAutocompleteSelect('fatherName', option)}
                      >
                        {option.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="motherName" className="form-label">
                {FORMS.MOTHER_NAME}
              </label>
              <div className="autocomplete-wrapper">
                <div className="input-wrapper">
                  <UserOutlined className="input-icon" />
                  <input
                    type="text"
                    id="motherName"
                    value={formData.motherName}
                    onChange={(e) => handleAutocompleteInputChange('motherName', e.target.value)}
                    className="form-input"
                    placeholder="Search for mother's name"
                    onFocus={() => setShowAutocomplete(prev => ({ ...prev, motherName: true }))}
                  />
                  {autocompleteLoading.motherName && <LoadingOutlined className="loading-icon" />}
                </div>
                {showAutocomplete.motherName && autocompleteOptions.length > 0 && (
                  <div className="autocomplete-dropdown">
                    {autocompleteOptions.map(option => (
                      <div
                        key={option.id}
                        className="autocomplete-option"
                        onClick={() => handleAutocompleteSelect('motherName', option)}
                      >
                        {option.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {isMarried && (
              <div className="form-group">
                <label htmlFor="childrenName" className="form-label">
                  {FORMS.CHILDREN_NAME}
                </label>
                <div className="autocomplete-wrapper">
                  <div className="input-wrapper">
                    <UserOutlined className="input-icon" />
                    <input
                      type="text"
                      id="childrenName"
                      value={formData.childrenName}
                      onChange={(e) => handleAutocompleteInputChange('childrenName', e.target.value)}
                      className="form-input"
                      placeholder="Search for children's name"
                      onFocus={() => setShowAutocomplete(prev => ({ ...prev, childrenName: true }))}
                    />
                    {autocompleteLoading.childrenName && <LoadingOutlined className="loading-icon" />}
                  </div>
                  {showAutocomplete.childrenName && autocompleteOptions.length > 0 && (
                    <div className="autocomplete-dropdown">
                      {autocompleteOptions.map(option => (
                        <div
                          key={option.id}
                          className="autocomplete-option"
                          onClick={() => handleAutocompleteSelect('childrenName', option)}
                        >
                          {option.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            {FORMS.RESET}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingOutlined />
                Creating...
              </>
            ) : (
              <>
                <UserAddOutlined />
                {FORMS.CREATE}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default User;
