import React, { useState } from 'react';
import { systemAuthService } from '../../services/SystemAuthService';
import './SystemLogin.css';

interface SystemLoginProps {
    onLoginSuccess: () => void;
    onCancel: () => void;
}

const SystemLogin: React.FC<SystemLoginProps> = ({ onLoginSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (error) {
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username.trim() || !formData.password.trim()) {
            setError('Please enter both username and password');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await systemAuthService.login(formData.username, formData.password);

            if (response.success) {
                // Store system user type in localStorage
                localStorage.setItem('systemUserType', 'system');
                onLoginSuccess();
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="system-login-overlay">
            <div className="system-login-modal">
                <div className="system-login-header">
                    <div className="system-login-icon">
                        <i className="fas fa-user-shield"></i>
                    </div>
                    <h2>System User Login</h2>
                    <p>Please login with your system credentials to access System User Management</p>
                </div>

                <form className="system-login-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="system-login-error">
                            <i className="fas fa-exclamation-triangle"></i>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Enter your system username"
                            disabled={loading}
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Enter your system password"
                            disabled={loading}
                            autoComplete="current-password"
                        />
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
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt"></i>
                                    Login
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="system-login-footer">
                    <p>
                        <i className="fas fa-info-circle"></i>
                        This is a separate login for system administrators and operators.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SystemLogin;
