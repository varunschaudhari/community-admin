import React from 'react';
import { useLocalStorageUser } from '../../hooks/useLocalStorageUser';
import './UserDisplay.css';

interface UserDisplayProps {
    showFullInfo?: boolean;
    showAvatar?: boolean;
    className?: string;
}

export const UserDisplay: React.FC<UserDisplayProps> = ({
    showFullInfo = false,
    showAvatar = true,
    className = ''
}) => {
    const {
        user,
        userName,
        firstName,
        lastName,
        username,
        email,
        role,
        isLoggedIn,
        isLoading
    } = useLocalStorageUser();

    if (isLoading) {
        return (
            <div className={`user-display loading ${className}`}>
                <div className="user-avatar skeleton"></div>
                <div className="user-info">
                    <div className="user-name skeleton-text"></div>
                    {showFullInfo && <div className="user-role skeleton-text"></div>}
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className={`user-display not-logged-in ${className}`}>
                <span>Not logged in</span>
            </div>
        );
    }

    // Generate initials for avatar
    const getInitials = () => {
        if (firstName && lastName) {
            return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        } else if (firstName) {
            return firstName.charAt(0).toUpperCase();
        } else if (username) {
            return username.charAt(0).toUpperCase();
        }
        return '?';
    };

    // Generate avatar background color based on username
    const getAvatarColor = () => {
        if (!username) return '#6c757d';
        const colors = [
            '#007bff', '#28a745', '#dc3545', '#ffc107',
            '#17a2b8', '#6f42c1', '#fd7e14', '#e83e8c'
        ];
        const index = username.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className={`user-display ${className}`}>
            {showAvatar && (
                <div
                    className="user-avatar"
                    style={{ backgroundColor: getAvatarColor() }}
                    title={`${userName} (${role})`}
                    aria-label={`Avatar for ${userName}`}
                >
                    <span className="avatar-initials">{getInitials()}</span>
                </div>
            )}

            <div className="user-info">
                <div className="user-name" title={userName}>
                    {userName}
                </div>

                {showFullInfo && (
                    <div className="user-details">
                        <div className="user-role">
                            <span className="role-badge">{role}</span>
                        </div>
                        <div className="user-email" title={email}>
                            {email}
                        </div>
                        <div className="user-username" title={username}>
                            @{username}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Simple component that just shows the user's name
export const UserName: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { userName, isLoggedIn, isLoading } = useLocalStorageUser();

    if (isLoading) {
        return <span className={`user-name-loading ${className}`}>Loading...</span>;
    }

    if (!isLoggedIn) {
        return <span className={`user-name-not-logged-in ${className}`}>Guest</span>;
    }

    return <span className={`user-name ${className}`}>{userName}</span>;
};

// Component that shows user's first name only
export const UserFirstName: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { firstName, isLoggedIn, isLoading } = useLocalStorageUser();

    if (isLoading) {
        return <span className={`user-first-name-loading ${className}`}>Loading...</span>;
    }

    if (!isLoggedIn) {
        return <span className={`user-first-name-not-logged-in ${className}`}>Guest</span>;
    }

    return <span className={`user-first-name ${className}`}>{firstName}</span>;
};

export default UserDisplay;
