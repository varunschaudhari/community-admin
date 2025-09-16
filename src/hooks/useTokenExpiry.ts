import { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/AuthService';
import { systemAuthService } from '../services/SystemAuthService';

/**
 * Hook to handle automatic token expiry checking and logout
 * This hook provides utilities for checking token expiry and handling automatic logout
 */
export const useTokenExpiry = () => {
    const { user, logout } = useAuth();

    /**
     * Check if the current user's token is expired
     */
    const isTokenExpired = useCallback((): boolean => {
        if (!user) return false;

        if (user.userType === 'system') {
            return systemAuthService.isTokenExpired();
        } else {
            return authService.isTokenExpired();
        }
    }, [user]);

    /**
     * Get time until token expires in milliseconds
     */
    const getTimeUntilExpiry = useCallback((): number => {
        if (!user) return 0;

        if (user.userType === 'system') {
            return systemAuthService.getTimeUntilExpiry();
        } else {
            return authService.getTimeUntilExpiry();
        }
    }, [user]);

    /**
     * Get token expiry date
     */
    const getTokenExpiry = useCallback((): Date | null => {
        if (!user) return null;

        if (user.userType === 'system') {
            return systemAuthService.getTokenExpiry();
        } else {
            return authService.getTokenExpiry();
        }
    }, [user]);

    /**
     * Handle automatic logout when token expires
     */
    const handleTokenExpiry = useCallback(async () => {
        if (!user) return;

        console.log('⏰ Token expired - initiating automatic logout');
        await logout();
    }, [user, logout]);

    /**
     * Check token expiry and logout if expired
     */
    const checkAndHandleExpiry = useCallback(async () => {
        if (isTokenExpired()) {
            await handleTokenExpiry();
            return true; // Token was expired
        }
        return false; // Token is still valid
    }, [isTokenExpired, handleTokenExpiry]);

    /**
     * Get formatted time until expiry (e.g., "2 hours 30 minutes")
     */
    const getFormattedTimeUntilExpiry = useCallback((): string => {
        const timeUntilExpiry = getTimeUntilExpiry();
        if (timeUntilExpiry <= 0) return 'Expired';

        const hours = Math.floor(timeUntilExpiry / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntilExpiry % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
            return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        }
    }, [getTimeUntilExpiry]);

    /**
     * Get token expiry status with details
     */
    const getTokenStatus = useCallback(() => {
        if (!user) {
            return {
                isExpired: false,
                timeUntilExpiry: 0,
                expiryDate: null,
                formattedTime: 'Not logged in',
                isNearExpiry: false
            };
        }

        const isExpired = isTokenExpired();
        const timeUntilExpiry = getTimeUntilExpiry();
        const expiryDate = getTokenExpiry();
        const formattedTime = getFormattedTimeUntilExpiry();

        // Consider token "near expiry" if it expires within 30 minutes
        const isNearExpiry = timeUntilExpiry > 0 && timeUntilExpiry <= (30 * 60 * 1000);

        return {
            isExpired,
            timeUntilExpiry,
            expiryDate,
            formattedTime,
            isNearExpiry
        };
    }, [user, isTokenExpired, getTimeUntilExpiry, getTokenExpiry, getFormattedTimeUntilExpiry]);

    // Set up automatic token expiry checking
    useEffect(() => {
        if (!user) return;

        const checkTokenExpiry = async () => {
            await checkAndHandleExpiry();
        };

        // Check every minute
        const interval = setInterval(checkTokenExpiry, 60000);

        // Also check when the token is about to expire
        const timeUntilExpiry = getTimeUntilExpiry();
        let timeout: NodeJS.Timeout | null = null;

        if (timeUntilExpiry > 0) {
            timeout = setTimeout(checkTokenExpiry, timeUntilExpiry);
        }

        return () => {
            clearInterval(interval);
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [user, checkAndHandleExpiry, getTimeUntilExpiry]);

    return {
        isTokenExpired,
        getTimeUntilExpiry,
        getTokenExpiry,
        getFormattedTimeUntilExpiry,
        getTokenStatus,
        checkAndHandleExpiry,
        handleTokenExpiry
    };
};
