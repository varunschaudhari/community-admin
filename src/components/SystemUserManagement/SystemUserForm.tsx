import React, { useState, useEffect } from 'react';
import { SystemUser, CreateSystemUserData, UpdateSystemUserData } from '../../services/SystemUserManagementService';
import { systemUserManagementService } from '../../services/SystemUserManagementService';
import './SystemUserForm.css';

interface SystemUserFormProps {
    user?: SystemUser | null;
    onSubmit: (data: CreateSystemUserData | UpdateSystemUserData) => Promise<void>;
    onCancel: () => void;
}

const SystemUserForm: React.FC<SystemUserFormProps> = ({ user, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        employeeId: '',
        department: 'IT',
        designation: '',
        firstName: '',
        middleName: '',
        lastName: '',
        phone: '',
        role: 'Member',
        accessLevel: 2,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const isEditing = !!user;

    // Initialize form data
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                password: '', // Don't pre-fill password
                email: user.email,
                employeeId: user.employeeId,
                department: user.department,
                designation: user.designation,
                firstName: user.firstName,
                middleName: user.middleName || '',
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
                accessLevel: user.accessLevel,
            });
        }
    }, [user]);

    // Get options
    const departmentOptions = systemUserManagementService.getDepartmentOptions();
    const roleOptions = systemUserManagementService.getSystemRoleOptions();

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle role change
    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRole = e.target.value;
        const role = roleOptions.find(r => r.value === selectedRole);

        setFormData(prev => ({
            ...prev,
            role: selectedRole,
            accessLevel: role?.accessLevel || 2
        }));
    };


    // Validate form
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!isEditing && !formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (!isEditing && formData.password.length < 12) {
            newErrors.password = 'Password must be at least 12 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.employeeId.trim()) {
            newErrors.employeeId = 'Employee ID is required';
        } else if (!/^[A-Z]{2,4}\d{4,6}$/.test(formData.employeeId)) {
            newErrors.employeeId = 'Employee ID must be in format: ABC1234 or ABCD123456';
        }

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.designation.trim()) {
            newErrors.designation = 'Designation is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

      const submitData: any = { ...formData };
      
      // Remove password if editing and not provided
      if (isEditing && !submitData.password) {
        delete submitData.password;
      }

            await onSubmit(submitData);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <form className="system-user-form" onSubmit={handleSubmit}>
            <div className="form-section">
                <h4>Basic Information</h4>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="username">Username *</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                            disabled={isEditing}
                            placeholder="Enter username"
                        />
                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="Enter email address"
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="employeeId">Employee ID *</label>
                        <input
                            type="text"
                            id="employeeId"
                            name="employeeId"
                            value={formData.employeeId}
                            onChange={handleInputChange}
                            className={`form-control ${errors.employeeId ? 'is-invalid' : ''}`}
                            disabled={isEditing}
                            placeholder="e.g., SYS0001"
                            style={{ textTransform: 'uppercase' }}
                        />
                        {errors.employeeId && <div className="invalid-feedback">{errors.employeeId}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                            placeholder="Enter 10-digit phone number"
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                </div>

                {!isEditing && (
                    <div className="form-group">
                        <label htmlFor="password">Password *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            placeholder="Enter password (min 12 characters)"
                            minLength={12}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        <small className="form-text text-muted">
                            Password must be at least 12 characters long
                        </small>
                    </div>
                )}
            </div>

            <div className="form-section">
                <h4>Personal Information</h4>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                            placeholder="Enter first name"
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="middleName">Middle Name</label>
                        <input
                            type="text"
                            id="middleName"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Enter middle name (optional)"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name *</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                            placeholder="Enter last name"
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h4>Work Information</h4>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="department">Department *</label>
                        <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            {departmentOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="designation">Designation *</label>
                        <input
                            type="text"
                            id="designation"
                            name="designation"
                            value={formData.designation}
                            onChange={handleInputChange}
                            className={`form-control ${errors.designation ? 'is-invalid' : ''}`}
                            placeholder="Enter job designation"
                        />
                        {errors.designation && <div className="invalid-feedback">{errors.designation}</div>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="role">System Role *</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleRoleChange}
                            className="form-control"
                        >
                            {roleOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label} (Level {option.accessLevel})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="accessLevel">Access Level</label>
                        <input
                            type="number"
                            id="accessLevel"
                            name="accessLevel"
                            value={formData.accessLevel}
                            onChange={handleInputChange}
                            className="form-control"
                            min="1"
                            max="5"
                            readOnly
                        />
                        <small className="form-text text-muted">
                            Access level is automatically set based on system role
                        </small>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h4>Role Information</h4>
                <p className="form-text text-muted">
                    The user's permissions are determined by their assigned role. To modify permissions, update the role in the Roles module.
                </p>
                <div className="alert alert-info">
                    <i className="fas fa-info-circle"></i>
                    <strong>Note:</strong> Individual permissions are managed in the Roles module. Users inherit permissions from their assigned role.
                </div>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <i className="fas fa-spinner fa-spin"></i>
                            {isEditing ? 'Updating...' : 'Creating...'}
                        </>
                    ) : (
                        <>
                            <i className={`fas fa-${isEditing ? 'save' : 'plus'}`}></i>
                            {isEditing ? 'Update User' : 'Create User'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default SystemUserForm;
