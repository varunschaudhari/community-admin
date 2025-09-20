import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FORMS, ERRORS, SUCCESS, MARITAL_STATUS, ROLES } from '../../constants';
import { userService } from '../../services/UserService';
import { roleService } from '../../services/RoleService';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  TeamOutlined,
  HomeOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  DownOutlined,
} from '@ant-design/icons';
import './User.css';

interface FormData {
  // Basic Information
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  dobAsPerDocument: string;

  // Identity Documents
  pan: string;
  adhar: string;

  // Role and Status
  role: string;
  maritalStatus: string;

  // Cultural Information
  kul: string;
  gotra: string;

  // Family Information
  fatherDetails: {
    fatherName: string;
    fatherId?: string;
    relationshipType: string;
    isAlive: boolean;
    dateOfDeath?: string;
  };
  motherDetails: {
    motherName: string;
    motherId?: string;
    relationshipType: string;
    isAlive: boolean;
    dateOfDeath?: string;
  };

  // Marriage Information
  marriages: Array<{
    spouseName: string;
    spouseId?: string;
    marriageDate: string;
    marriagePlace: {
      city: string;
      state: string;
      country: string;
    };
    marriageOrder: number;
    marriageStatus: string;
    marriageType: string;
    isCurrentSpouse: boolean;
  }>;

  // Children Information
  children: Array<{
    childName: string;
    childId?: string;
    relationshipType: string;
    birthDate: string;
    fromWhichMarriage: number;
    otherParentName?: string;
    otherParentId?: string;
  }>;
}

interface ValidationErrors {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  pan?: string;
  adhar?: string;
  maritalStatus?: string;
  dobAsPerDocument?: string;
  role?: string;
  kul?: string;
  gotra?: string;
  fatherName?: string;
  motherName?: string;
  marriageDate?: string;
}

interface ValidationState {
  firstName: 'neutral' | 'valid' | 'invalid';
  middleName: 'neutral' | 'valid' | 'invalid';
  lastName: 'neutral' | 'valid' | 'invalid';
  email: 'neutral' | 'valid' | 'invalid';
  phoneNumber: 'neutral' | 'valid' | 'invalid';
  password: 'neutral' | 'valid' | 'invalid';
  pan: 'neutral' | 'valid' | 'invalid';
  adhar: 'neutral' | 'valid' | 'invalid';
  maritalStatus: 'neutral' | 'valid' | 'invalid';
  dobAsPerDocument: 'neutral' | 'valid' | 'invalid';
  role: 'neutral' | 'valid' | 'invalid';
  kul: 'neutral' | 'valid' | 'invalid';
  gotra: 'neutral' | 'valid' | 'invalid';
  fatherName: 'neutral' | 'valid' | 'invalid';
  motherName: 'neutral' | 'valid' | 'invalid';
  marriageDate: 'neutral' | 'valid' | 'invalid';
}

interface AutocompleteOption {
  id: string;
  name: string;
  type: 'father' | 'mother' | 'children';
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  isSystem: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

const User: React.FC = () => {
  const { theme } = useTheme();
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState<FormData>({
    // Basic Information
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    dobAsPerDocument: '',

    // Identity Documents
    pan: '',
    adhar: '',

    // Role and Status
    role: ROLES.MEMBER, // Set Member as default role
    maritalStatus: MARITAL_STATUS.SINGLE,

    // Cultural Information
    kul: '',
    gotra: '',

    // Family Information
    fatherDetails: {
      fatherName: '',
      relationshipType: 'biological',
      isAlive: true,
    },
    motherDetails: {
      motherName: '',
      relationshipType: 'biological',
      isAlive: true,
    },

    // Marriage Information
    marriages: [],

    // Children Information
    children: [],
  });

  // Fetch roles from database
  const fetchRoles = async () => {
    try {
      const response = await roleService.getAllRoles();
      setRoles((response.data || []) as Role[]);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      setRoles([]);
    }
  };

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [validationState, setValidationState] = useState<ValidationState>({
    firstName: 'neutral',
    middleName: 'neutral',
    lastName: 'neutral',
    email: 'neutral',
    phoneNumber: 'neutral',
    password: 'neutral',
    pan: 'neutral',
    adhar: 'neutral',
    maritalStatus: 'neutral',
    dobAsPerDocument: 'neutral',
    role: 'valid', // Member is default, so it's valid
    kul: 'neutral',
    gotra: 'neutral',
    fatherName: 'neutral',
    motherName: 'neutral',
    marriageDate: 'neutral',
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
    validateField('phoneNumber', formData.phoneNumber);
  }, [formData.phoneNumber]);

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
    validateField('dobAsPerDocument', formData.dobAsPerDocument);
  }, [formData.dobAsPerDocument]);


  useEffect(() => {
    validateField('role', formData.role);
  }, [formData.role]);

  useEffect(() => {
    if (formData.maritalStatus === MARITAL_STATUS.MARRIED) {
      validateMarriageDate(formData.marriages[0]?.marriageDate || '');
    }
  }, [formData.marriages, formData.maritalStatus]);

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

      case 'phoneNumber':
        if (!value || typeof value === 'string' && !value.trim()) {
          newErrors.phoneNumber = ERRORS.REQUIRED_FIELD;
          newValidationState.phoneNumber = 'invalid';
        } else if (typeof value === 'string' && !/^[6-9]\d{9}$/.test(value.replace(/\D/g, ''))) {
          newErrors.phoneNumber = ERRORS.INVALID_PHONE;
          newValidationState.phoneNumber = 'invalid';
        } else {
          delete newErrors.phoneNumber;
          newValidationState.phoneNumber = 'valid';
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

      case 'dobAsPerDocument':
        if (value && typeof value === 'string' && value.trim()) {
          const date = new Date(value);
          const today = new Date();
          if (isNaN(date.getTime())) {
            newErrors.dobAsPerDocument = ERRORS.INVALID_DATE;
            newValidationState.dobAsPerDocument = 'invalid';
          } else if (date > today) {
            newErrors.dobAsPerDocument = ERRORS.FUTURE_DATE_NOT_ALLOWED;
            newValidationState.dobAsPerDocument = 'invalid';
          } else {
            delete newErrors.dobAsPerDocument;
            newValidationState.dobAsPerDocument = 'valid';
          }
        } else {
          delete newErrors.dobAsPerDocument;
          newValidationState.dobAsPerDocument = 'neutral';
        }
        break;


      case 'role':
        if (!value || typeof value === 'string' && !value.trim()) {
          newErrors.role = ERRORS.REQUIRED_FIELD;
          newValidationState.role = 'invalid';
        } else if (typeof value === 'string' && value === 'Member') {
          // Member is the default role, so it's always valid
          delete newErrors.role;
          newValidationState.role = 'valid';
        } else {
          delete newErrors.role;
          newValidationState.role = 'valid';
        }
        break;

    }

    setErrors(newErrors);
    setValidationState(newValidationState);
  };

  const validateMarriageDate = (value: string) => {
    const newErrors = { ...errors };
    const newValidationState = { ...validationState };

    if (formData.maritalStatus === MARITAL_STATUS.MARRIED) {
      if (!value || !value.trim()) {
        newErrors.marriageDate = 'Marriage date is required when marital status is married';
        newValidationState.marriageDate = 'invalid';
      } else if (value.trim()) {
        const date = new Date(value);
        const today = new Date();
        if (isNaN(date.getTime())) {
          newErrors.marriageDate = ERRORS.INVALID_DATE;
          newValidationState.marriageDate = 'invalid';
        } else if (date > today) {
          newErrors.marriageDate = ERRORS.FUTURE_DATE_NOT_ALLOWED;
          newValidationState.marriageDate = 'invalid';
        } else {
          delete newErrors.marriageDate;
          newValidationState.marriageDate = 'valid';
        }
      }
    } else {
      delete newErrors.marriageDate;
      newValidationState.marriageDate = 'neutral';
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

  const handleFamilyInputChange = (field: 'fatherName' | 'motherName', value: string) => {
    setFormData(prev => {
      if (field === 'fatherName') {
        return {
          ...prev,
          fatherDetails: {
            ...prev.fatherDetails,
            fatherName: value
          }
        };
      }
      if (field === 'motherName') {
        return {
          ...prev,
          motherDetails: {
            ...prev.motherDetails,
            motherName: value
          }
        };
      }
      return prev;
    });

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
      const response = await userService.searchUsers(query, field as 'father' | 'mother' | 'children');
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

  const handleAutocompleteInputChange = (field: string, value: string) => {
    // Map the field names to the correct FormData keys
    if (field === 'fatherName') {
      handleFamilyInputChange('fatherName', value);
    } else if (field === 'motherName') {
      handleFamilyInputChange('motherName', value);
    } else if (field === 'childrenName') {
      // For now, we'll handle children differently since it's an array
      // This will be updated when we implement the children management
      console.log('Children management not yet implemented');
    }
    debouncedSearch(field, value);
  };

  const handleAutocompleteSelect = (field: string, option: AutocompleteOption) => {
    if (field === 'fatherName') {
      handleFamilyInputChange('fatherName', option.name);
    } else if (field === 'motherName') {
      handleFamilyInputChange('motherName', option.name);
    } else if (field === 'childrenName') {
      // For now, we'll handle children differently since it's an array
      console.log('Children management not yet implemented');
    }
    setShowAutocomplete(prev => ({ ...prev, [field]: false }));
    setAutocompleteOptions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const newErrors: ValidationErrors = {};

    // Validate basic string fields
    if (!formData.firstName || !formData.firstName.trim()) {
      newErrors.firstName = ERRORS.REQUIRED_FIELD;
    }
    if (!formData.lastName || !formData.lastName.trim()) {
      newErrors.lastName = ERRORS.REQUIRED_FIELD;
    }
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = ERRORS.REQUIRED_FIELD;
    }
    if (!formData.phoneNumber || !formData.phoneNumber.trim()) {
      newErrors.phoneNumber = ERRORS.REQUIRED_FIELD;
    }
    if (!formData.password || !formData.password.trim()) {
      newErrors.password = ERRORS.REQUIRED_FIELD;
    }
    if (!formData.maritalStatus || !formData.maritalStatus.trim()) {
      newErrors.maritalStatus = ERRORS.REQUIRED_FIELD;
    }

    // Validate marriage date if marital status is married
    if (formData.maritalStatus === MARITAL_STATUS.MARRIED) {
      if (!formData.marriages[0]?.marriageDate || !formData.marriages[0].marriageDate.trim()) {
        newErrors.marriageDate = 'Marriage date is required when marital status is married';
      }
    }
    if (!formData.dobAsPerDocument || !formData.dobAsPerDocument.trim()) {
      newErrors.dobAsPerDocument = ERRORS.REQUIRED_FIELD;
    }
    if (!formData.role || !formData.role.trim()) {
      newErrors.role = ERRORS.REQUIRED_FIELD;
    } else if (formData.role === 'Member') {
      // Member is the default role, so it's always valid
      delete newErrors.role;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setSubmitMessage(null);

    try {
      // Prepare the data for submission
      const submissionData = {
        ...formData,
        // Clean up marriage data if not married
        marriages: formData.maritalStatus === MARITAL_STATUS.MARRIED
          ? formData.marriages.map(marriage => ({
            ...marriage,
            // Remove empty spouseId to avoid validation error
            spouseId: marriage.spouseId || undefined,
          }))
          : []
      };

      await userService.createUser(submissionData);
      setSubmitMessage({ type: 'success', message: SUCCESS.CREATED });
      // Reset form after successful submission
      setFormData({
        // Basic Information
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        dobAsPerDocument: '',

        // Identity Documents
        pan: '',
        adhar: '',

        // Role and Status
        role: ROLES.MEMBER, // Set Member as default role
        maritalStatus: MARITAL_STATUS.SINGLE,

        // Cultural Information
        kul: '',
        gotra: '',

        // Family Information
        fatherDetails: {
          fatherName: '',
          relationshipType: 'biological',
          isAlive: true,
        },
        motherDetails: {
          motherName: '',
          relationshipType: 'biological',
          isAlive: true,
        },

        // Marriage Information
        marriages: [],

        // Children Information
        children: [],
      });
      setErrors({});
      setValidationState({
        firstName: 'neutral',
        middleName: 'neutral',
        lastName: 'neutral',
        email: 'neutral',
        phoneNumber: 'neutral',
        password: 'neutral',
        pan: 'neutral',
        adhar: 'neutral',
        maritalStatus: 'neutral',
        dobAsPerDocument: 'neutral',
        role: 'valid', // Member is default, so it's valid
        kul: 'neutral',
        gotra: 'neutral',
        fatherName: 'neutral',
        motherName: 'neutral',
        marriageDate: 'neutral',
      });
    } catch (error) {
      setSubmitMessage({ type: 'error', message: ERRORS.SERVER_ERROR });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      // Basic Information
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      dobAsPerDocument: '',

      // Identity Documents
      pan: '',
      adhar: '',

      // Role and Status
      role: ROLES.MEMBER, // Set Member as default role
      maritalStatus: MARITAL_STATUS.SINGLE,

      // Cultural Information
      kul: '',
      gotra: '',

      // Family Information
      fatherDetails: {
        fatherName: '',
        relationshipType: 'biological',
        isAlive: true,
      },
      motherDetails: {
        motherName: '',
        relationshipType: 'biological',
        isAlive: true,
      },

      // Marriage Information
      marriages: [],

      // Children Information
      children: [],
    });
    setErrors({});
    setValidationState({
      firstName: 'neutral',
      middleName: 'neutral',
      lastName: 'neutral',
      email: 'neutral',
      phoneNumber: 'neutral',
      password: 'neutral',
      pan: 'neutral',
      adhar: 'neutral',
      maritalStatus: 'neutral',
      dobAsPerDocument: 'neutral',
      role: 'valid', // Member is default, so it's valid
      kul: 'neutral',
      gotra: 'neutral',
      fatherName: 'neutral',
      motherName: 'neutral',
      marriageDate: 'neutral',
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
              <div className="input-wrapper has-trailing-elements">
                <UserOutlined className="input-icon" />
                <input
                  style={{ paddingLeft: '40px' }}
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`form-input ${validationState.firstName}`}
                  placeholder="Enter first name"
                />
                <div className="trailing-elements">
                  {validationState.firstName === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                  {validationState.firstName === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
                </div>
              </div>
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="middleName" className="form-label">
                {FORMS.MIDDLE_NAME}
              </label>
              <div className="input-wrapper">
                <UserOutlined className="input-icon" />
                <input
                  style={{ paddingLeft: '40px' }}
                  type="text"
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  className="form-input"
                  placeholder="Enter middle name (optional)"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                {FORMS.LAST_NAME} <span className="required">*</span>
              </label>
              <div className="input-wrapper has-trailing-elements">
                <UserOutlined className="input-icon" />
                <input
                  style={{ paddingLeft: '40px' }}
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`form-input ${validationState.lastName}`}
                  placeholder="Enter last name"
                />
                <div className="trailing-elements">
                  {validationState.lastName === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                  {validationState.lastName === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
                </div>
              </div>
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {FORMS.EMAIL} <span className="required">*</span>
              </label>
              <div className="input-wrapper has-trailing-elements">
                <MailOutlined className="input-icon" />
                <input
                  style={{ paddingLeft: '40px' }}
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`form-input ${validationState.email}`}
                  placeholder="Enter email address"
                />
                <div className="trailing-elements">
                  {validationState.email === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                  {validationState.email === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
                </div>
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                {FORMS.PASSWORD} <span className="required">*</span>
              </label>
              <div className="input-wrapper password-input-wrapper has-trailing-elements">
                <LockOutlined className="input-icon" />
                <input
                  style={{ paddingLeft: '40px' }}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`form-input ${validationState.password}`}
                  placeholder="Enter password"
                />
                <div className="trailing-elements">
                  {validationState.password === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                  {validationState.password === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeInvisibleOutlined /> : <EyeTwoTone />}
                  </button>
                </div>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                {FORMS.PHONE} <span className="required">*</span>
              </label>
              <div className="input-wrapper has-trailing-elements">
                <PhoneOutlined className="input-icon" />
                <input
                  style={{ paddingLeft: '40px' }}
                  type="number"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={`form-input ${validationState.phoneNumber}`}
                  placeholder="Enter Phone Number"
                  maxLength={10}
                />
                <div className="trailing-elements">
                  {validationState.phoneNumber === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                  {validationState.phoneNumber === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
                </div>
              </div>
              {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
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
              <div className="input-wrapper has-trailing-elements">
                <IdcardOutlined className="input-icon" />
                <input
                  style={{ paddingLeft: '40px' }}
                  type="text"
                  id="pan"
                  value={formData.pan}
                  onChange={(e) => handleInputChange('pan', e.target.value.toUpperCase())}
                  className={`form-input ${validationState.pan}`}
                  placeholder="Enter PAN Number"
                  maxLength={10}
                />
                <div className="trailing-elements">
                  {validationState.pan === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                  {validationState.pan === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
                </div>
              </div>
              {errors.pan && <span className="error-message">{errors.pan}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="adhar" className="form-label">
                {FORMS.ADHAR}
              </label>
              <div className="input-wrapper has-trailing-elements">
                <IdcardOutlined className="input-icon" />
                <input
                  style={{ paddingLeft: '40px' }}
                  type="text"
                  id="adhar"
                  value={formData.adhar}
                  onChange={(e) => handleInputChange('adhar', e.target.value.replace(/\D/g, ''))}
                  className={`form-input ${validationState.adhar}`}
                  placeholder="Enter Aadhaar Number"
                  maxLength={12}
                />
                <div className="trailing-elements">
                  {validationState.adhar === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                  {validationState.adhar === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
                </div>
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
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                <DownOutlined className="select-arrow" />
              </div>
              {errors.maritalStatus && <span className="error-message">{errors.maritalStatus}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dobAsPerDocument" className="form-label">
                {FORMS.DOB} <span className="required">*</span>
              </label>
              <div className="input-wrapper has-trailing-elements">
                <CalendarOutlined className="input-icon" />
                <input
                  type="date"
                  id="dobAsPerDocument"
                  value={formData.dobAsPerDocument}
                  onChange={(e) => handleInputChange('dobAsPerDocument', e.target.value)}
                  className={`form-input ${validationState.dobAsPerDocument}`}
                />
                <div className="trailing-elements">
                  {validationState.dobAsPerDocument === 'valid' && <CheckCircleOutlined className="validation-icon valid" />}
                  {validationState.dobAsPerDocument === 'invalid' && <CloseCircleOutlined className="validation-icon invalid" />}
                </div>
              </div>
              {errors.dobAsPerDocument && <span className="error-message">{errors.dobAsPerDocument}</span>}
            </div>

          </div>
        </div>

        {/* Marriage Information Section */}
        {isMarried && (
          <div className="form-section">
            <h3 className="section-title">
              <TeamOutlined />
              Marriage Information
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="spouseName" className="form-label">
                  Spouse Name
                </label>
                <div className="autocomplete-wrapper">
                  <div className="input-wrapper">
                    <UserOutlined className="input-icon" />
                    <input
                      type="text"
                      id="spouseName"
                      value={formData.marriages[0]?.spouseName || ''}
                      onChange={(e) => {
                        const updatedMarriages = [...formData.marriages];
                        if (updatedMarriages.length === 0) {
                          updatedMarriages.push({
                            spouseName: e.target.value,
                            spouseId: '',
                            marriageDate: '',
                            marriagePlace: { city: '', state: '', country: '' },
                            marriageOrder: 1,
                            marriageStatus: 'current',
                            marriageType: 'arranged',
                            isCurrentSpouse: true
                          });
                        } else {
                          updatedMarriages[0].spouseName = e.target.value;
                        }
                        setFormData(prev => ({ ...prev, marriages: updatedMarriages }));
                      }}
                      className="form-input"
                      placeholder="Enter Spouse Name"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="marriageDate" className="form-label">
                  Marriage Date <span className="required">*</span>
                </label>
                <div className="input-wrapper has-trailing-elements">
                  <CalendarOutlined className="input-icon" />
                  <input
                    type="date"
                    id="marriageDate"
                    value={formData.marriages[0]?.marriageDate || ''}
                    onChange={(e) => {
                      const updatedMarriages = [...formData.marriages];
                      if (updatedMarriages.length === 0) {
                        updatedMarriages.push({
                          spouseName: '',
                          spouseId: '',
                          marriageDate: e.target.value,
                          marriagePlace: { city: '', state: '', country: '' },
                          marriageOrder: 1,
                          marriageStatus: 'current',
                          marriageType: 'arranged',
                          isCurrentSpouse: true
                        });
                      } else {
                        updatedMarriages[0].marriageDate = e.target.value;
                      }
                      setFormData(prev => ({ ...prev, marriages: updatedMarriages }));
                    }}
                    className="form-input"
                    placeholder="Select Marriage Date"
                    required
                  />
                  <div className="trailing-elements">
                    {formData.marriages[0]?.marriageDate && <CheckCircleOutlined className="validation-icon valid" />}
                  </div>
                </div>
                {errors.marriageDate && <span className="error-message">{errors.marriageDate}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Marriage Type</label>
                <div className="select-wrapper">
                  <select
                    value={formData.marriages[0]?.marriageType || 'arranged'}
                    onChange={(e) => {
                      const updatedMarriages = [...formData.marriages];
                      if (updatedMarriages.length === 0) {
                        updatedMarriages.push({
                          spouseName: '',
                          spouseId: '',
                          marriageDate: '',
                          marriagePlace: { city: '', state: '', country: '' },
                          marriageOrder: 1,
                          marriageStatus: 'current',
                          marriageType: e.target.value,
                          isCurrentSpouse: true
                        });
                      } else {
                        updatedMarriages[0].marriageType = e.target.value;
                      }
                      setFormData(prev => ({ ...prev, marriages: updatedMarriages }));
                    }}
                    className="form-select"
                  >
                    <option value="arranged">Arranged</option>
                    <option value="love">Love</option>
                    <option value="inter_caste">Inter-caste</option>
                    <option value="inter_religion">Inter-religion</option>
                    <option value="remarriage">Remarriage</option>
                  </select>
                  <DownOutlined className="select-arrow" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="marriageCity" className="form-label">
                  Marriage City
                </label>
                <input
                  type="text"
                  id="marriageCity"
                  value={formData.marriages[0]?.marriagePlace?.city || ''}
                  onChange={(e) => {
                    const updatedMarriages = [...formData.marriages];
                    if (updatedMarriages.length === 0) {
                      updatedMarriages.push({
                        spouseName: '',
                        spouseId: '',
                        marriageDate: '',
                        marriagePlace: { city: e.target.value, state: '', country: '' },
                        marriageOrder: 1,
                        marriageStatus: 'current',
                        marriageType: 'arranged',
                        isCurrentSpouse: true
                      });
                    } else {
                      updatedMarriages[0].marriagePlace = {
                        ...updatedMarriages[0].marriagePlace,
                        city: e.target.value
                      };
                    }
                    setFormData(prev => ({ ...prev, marriages: updatedMarriages }));
                  }}
                  className="form-input"
                  placeholder="Enter Marriage City"
                />
              </div>

              <div className="form-group">
                <label htmlFor="marriageState" className="form-label">
                  Marriage State
                </label>
                <input
                  type="text"
                  id="marriageState"
                  value={formData.marriages[0]?.marriagePlace?.state || ''}
                  onChange={(e) => {
                    const updatedMarriages = [...formData.marriages];
                    if (updatedMarriages.length === 0) {
                      updatedMarriages.push({
                        spouseName: '',
                        spouseId: '',
                        marriageDate: '',
                        marriagePlace: { city: '', state: e.target.value, country: '' },
                        marriageOrder: 1,
                        marriageStatus: 'current',
                        marriageType: 'arranged',
                        isCurrentSpouse: true
                      });
                    } else {
                      updatedMarriages[0].marriagePlace = {
                        ...updatedMarriages[0].marriagePlace,
                        state: e.target.value
                      };
                    }
                    setFormData(prev => ({ ...prev, marriages: updatedMarriages }));
                  }}
                  className="form-input"
                  placeholder="Enter Marriage State"
                />
              </div>

              <div className="form-group">
                <label htmlFor="marriageCountry" className="form-label">
                  Marriage Country
                </label>
                <input
                  type="text"
                  id="marriageCountry"
                  value={formData.marriages[0]?.marriagePlace?.country || ''}
                  onChange={(e) => {
                    const updatedMarriages = [...formData.marriages];
                    if (updatedMarriages.length === 0) {
                      updatedMarriages.push({
                        spouseName: '',
                        spouseId: '',
                        marriageDate: '',
                        marriagePlace: { city: '', state: '', country: e.target.value },
                        marriageOrder: 1,
                        marriageStatus: 'current',
                        marriageType: 'arranged',
                        isCurrentSpouse: true
                      });
                    } else {
                      updatedMarriages[0].marriagePlace = {
                        ...updatedMarriages[0].marriagePlace,
                        country: e.target.value
                      };
                    }
                    setFormData(prev => ({ ...prev, marriages: updatedMarriages }));
                  }}
                  className="form-input"
                  placeholder="Enter Marriage Country"
                />
              </div>
            </div>
          </div>
        )}

        {/* Community Information Section */}
        <div className="form-section">
          <h3 className="section-title">
            <TeamOutlined />
            Community Information
          </h3>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="role" className="form-label">
                {FORMS.ROLE} <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className={`form-select ${validationState.role}`}
                >
                  <option value="">Select role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <DownOutlined className="select-arrow" />
              </div>
              {errors.role && <span className="error-message">{errors.role}</span>}
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

          {/* Father Details Row */}
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fatherName" className="form-label">
                {FORMS.FATHER_NAME}
              </label>
              <div className="autocomplete-wrapper">
                <div className="input-wrapper has-trailing-elements">
                  <UserOutlined className="input-icon" />
                  <input
                    type="text"
                    id="fatherName"
                    value={formData.fatherDetails.fatherName}
                    onChange={(e) => handleAutocompleteInputChange('fatherName', e.target.value)}
                    className="form-input"
                    placeholder="Search for father's name"
                    onFocus={() => setShowAutocomplete(prev => ({ ...prev, fatherName: true }))}
                  />
                  <div className="trailing-elements">
                    {autocompleteLoading.fatherName && <LoadingOutlined className="loading-icon" />}
                  </div>
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
              <label className="form-label">Father's Relationship Type</label>
              <div className="select-wrapper">
                <select
                  value={formData.fatherDetails.relationshipType}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fatherDetails: { ...prev.fatherDetails, relationshipType: e.target.value }
                  }))}
                  className="form-select"
                >
                  <option value="biological">Biological</option>
                  <option value="adoptive">Adoptive</option>
                  <option value="step">Step</option>
                  <option value="foster">Foster</option>
                </select>
                <DownOutlined className="select-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Father's Status</label>
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="fatherAlive"
                  checked={formData.fatherDetails.isAlive}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fatherDetails: { ...prev.fatherDetails, isAlive: e.target.checked }
                  }))}
                  className="form-checkbox"
                />
                <label htmlFor="fatherAlive" className="checkbox-label">Alive</label>
              </div>
            </div>

            {!formData.fatherDetails.isAlive && (
              <div className="form-group">
                <label htmlFor="fatherDeathDate" className="form-label">Date of Death</label>
                <div className="input-wrapper">
                  <CalendarOutlined className="input-icon" />
                  <input
                    type="date"
                    id="fatherDeathDate"
                    value={formData.fatherDetails.dateOfDeath || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fatherDetails: { ...prev.fatherDetails, dateOfDeath: e.target.value }
                    }))}
                    className="form-input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Mother Details Row */}
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="motherName" className="form-label">
                {FORMS.MOTHER_NAME}
              </label>
              <div className="autocomplete-wrapper">
                <div className="input-wrapper has-trailing-elements">
                  <UserOutlined className="input-icon" />
                  <input
                    type="text"
                    id="motherName"
                    value={formData.motherDetails.motherName}
                    onChange={(e) => handleAutocompleteInputChange('motherName', e.target.value)}
                    className="form-input"
                    placeholder="Search for mother's name"
                    onFocus={() => setShowAutocomplete(prev => ({ ...prev, motherName: true }))}
                  />
                  <div className="trailing-elements">
                    {autocompleteLoading.motherName && <LoadingOutlined className="loading-icon" />}
                  </div>
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

            <div className="form-group">
              <label className="form-label">Mother's Relationship Type</label>
              <div className="select-wrapper">
                <select
                  value={formData.motherDetails.relationshipType}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    motherDetails: { ...prev.motherDetails, relationshipType: e.target.value }
                  }))}
                  className="form-select"
                >
                  <option value="biological">Biological</option>
                  <option value="adoptive">Adoptive</option>
                  <option value="step">Step</option>
                  <option value="foster">Foster</option>
                </select>
                <DownOutlined className="select-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mother's Status</label>
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="motherAlive"
                  checked={formData.motherDetails.isAlive}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    motherDetails: { ...prev.motherDetails, isAlive: e.target.checked }
                  }))}
                  className="form-checkbox"
                />
                <label htmlFor="motherAlive" className="checkbox-label">Alive</label>
              </div>
            </div>

            {!formData.motherDetails.isAlive && (
              <div className="form-group">
                <label htmlFor="motherDeathDate" className="form-label">Date of Death</label>
                <div className="input-wrapper">
                  <CalendarOutlined className="input-icon" />
                  <input
                    type="date"
                    id="motherDeathDate"
                    value={formData.motherDetails.dateOfDeath || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      motherDetails: { ...prev.motherDetails, dateOfDeath: e.target.value }
                    }))}
                    className="form-input"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Children Information Section */}
        <div className="form-section">
          <h3 className="section-title">
            <TeamOutlined />
            Children Information
          </h3>

          <div className="children-management">
            {formData.children.map((child, index) => (
              <div key={index} className="child-entry">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Child Name</label>
                    <input
                      type="text"
                      value={child.childName}
                      onChange={(e) => {
                        const updatedChildren = [...formData.children];
                        updatedChildren[index].childName = e.target.value;
                        setFormData(prev => ({ ...prev, children: updatedChildren }));
                      }}
                      className="form-input"
                      placeholder="Enter child name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Relationship Type</label>
                    <div className="select-wrapper">
                      <select
                        value={child.relationshipType}
                        onChange={(e) => {
                          const updatedChildren = [...formData.children];
                          updatedChildren[index].relationshipType = e.target.value;
                          setFormData(prev => ({ ...prev, children: updatedChildren }));
                        }}
                        className="form-select"
                      >
                        <option value="biological">Biological</option>
                        <option value="adopted">Adopted</option>
                        <option value="step">Step</option>
                        <option value="foster">Foster</option>
                      </select>
                      <DownOutlined className="select-arrow" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Birth Date</label>
                    <div className="input-wrapper">
                      <CalendarOutlined className="input-icon" />
                      <input
                        type="date"
                        value={child.birthDate || ''}
                        onChange={(e) => {
                          const updatedChildren = [...formData.children];
                          updatedChildren[index].birthDate = e.target.value;
                          setFormData(prev => ({ ...prev, children: updatedChildren }));
                        }}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Other Parent Name</label>
                    <input
                      type="text"
                      value={child.otherParentName || ''}
                      onChange={(e) => {
                        const updatedChildren = [...formData.children];
                        updatedChildren[index].otherParentName = e.target.value;
                        setFormData(prev => ({ ...prev, children: updatedChildren }));
                      }}
                      className="form-input"
                      placeholder="Enter other parent name"
                    />
                  </div>

                  <div className="form-group">
                    <button
                      type="button"
                      onClick={() => {
                        const updatedChildren = formData.children.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, children: updatedChildren }));
                      }}
                      className="btn btn-danger btn-sm"
                    >
                      Remove Child
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const newChild = {
                  childName: '',
                  childId: '',
                  relationshipType: 'biological',
                  birthDate: '',
                  fromWhichMarriage: 1,
                  otherParentName: '',
                  otherParentId: '',
                  isActive: true
                };
                setFormData(prev => ({ ...prev, children: [...prev.children, newChild] }));
              }}
              className="btn btn-secondary"
            >
              <UserAddOutlined />
              Add Child
            </button>
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
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
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
