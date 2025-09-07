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
        systemRole: 'System Viewer',
        accessLevel: 2,
        permissions: [] as string[],
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
                systemRole: user.systemRole,
                accessLevel: user.accessLevel,
                permissions: user.permissions,
            });
        }
    }, [user]);

    // Get options
    const departmentOptions = systemUserManagementService.getDepartmentOptions();
    const roleOptions = systemUserManagementService.getSystemRoleOptions();
    const permissionOptions = systemUserManagementService.getPermissionOptions();

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
            systemRole: selectedRole,
            accessLevel: role?.accessLevel || 2
        }));
    };

    // Handle permission toggle
    const handlePermissionToggle = (permission: string) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }));
    };

    // Handle category permission toggle
    const handleCategoryToggle = (category: string) => {
        const categoryPermissions = permissionOptions
            .filter(p => p.category === category)
            .map(p => p.value);

        const allSelected = categoryPermissions.every(p => formData.permissions.includes(p));

        setFormData(prev => ({
            ...prev,
            permissions: allSelected
                ? prev.permissions.filter(p => !categoryPermissions.includes(p))
                : Array.from(new Set([...prev.permissions, ...categoryPermissions]))
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

    // Group permissions by category
    const permissionsByCategory = permissionOptions.reduce((acc, permission) => {
        if (!acc[permission.category]) {
            acc[permission.category] = [];
        }
        acc[permission.category].push(permission);
        return acc;
    }, {} as { [key: string]: typeof permissionOptions });

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
                        <label htmlFor="systemRole">System Role *</label>
                        <select
                            id="systemRole"
                            name="systemRole"
                            value={formData.systemRole}
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
                <h4>Permissions</h4>
                <p className="form-text text-muted">
                    Select the permissions this system user should have. You can select individual permissions or entire categories.
                </p>

                <div className="permissions-container">
                    {Object.entries(permissionsByCategory).map(([category, permissions]) => {
                        const allSelected = permissions.every(p => formData.permissions.includes(p.value));
                        const someSelected = permissions.some(p => formData.permissions.includes(p.value));

                        return (
                            <div key={category} className="permission-category">
                                <div className="permission-category-header">
                                    <label className="permission-category-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            ref={(input) => {
                                                if (input) input.indeterminate = someSelected && !allSelected;
                                            }}
                                            onChange={() => handleCategoryToggle(category)}
                                        />
                                        <span className="permission-category-title">{category}</span>
                                    </label>
                                </div>

                                <div className="permission-list">
                                    {permissions.map(permission => (
                                        <label key={permission.value} className="permission-item">
                                            <input
                                                type="checkbox"
                                                checked={formData.permissions.includes(permission.value)}
                                                onChange={() => handlePermissionToggle(permission.value)}
                                            />
                                            <span className="permission-label">{permission.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
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
