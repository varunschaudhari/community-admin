/**
 * Utility functions for testing token expiry functionality
 * These can be used in the browser console for testing
 */

import { authService } from '../services/AuthService';
import { systemAuthService } from '../services/SystemAuthService';

export const tokenExpiryTestUtils = {
    /**
     * Set a test token expiry for community users (expires in 1 minute)
     */
    setTestCommunityTokenExpiry: () => {
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 1); // 1 minute from now
        localStorage.setItem('tokenExpiry', expiryTime.toISOString());
        console.log('✅ Set community token to expire in 1 minute:', expiryTime.toLocaleString());
    },

    /**
     * Set a test token expiry for system users (expires in 1 minute)
     */
    setTestSystemTokenExpiry: () => {
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 1); // 1 minute from now
        localStorage.setItem('systemTokenExpiry', expiryTime.toISOString());
        console.log('✅ Set system token to expire in 1 minute:', expiryTime.toLocaleString());
    },

    /**
     * Set token to expire immediately (for testing immediate logout)
     */
    setImmediateExpiry: (userType: 'community' | 'system' = 'community') => {
        const expiryTime = new Date();
        expiryTime.setSeconds(expiryTime.getSeconds() - 10); // 10 seconds ago

        if (userType === 'system') {
            localStorage.setItem('systemTokenExpiry', expiryTime.toISOString());
            console.log('✅ Set system token to expire immediately');
        } else {
            localStorage.setItem('tokenExpiry', expiryTime.toISOString());
            console.log('✅ Set community token to expire immediately');
        }
    },

    /**
     * Check current token status
     */
    checkTokenStatus: () => {
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;

        if (!user) {
            console.log('❌ No user logged in');
            return;
        }

        console.log('🔍 Token Status for:', user.firstName, user.lastName);
        console.log('User Type:', user.userType);

        if (user.userType === 'system') {
            const isExpired = systemAuthService.isTokenExpired();
            const timeUntilExpiry = systemAuthService.getTimeUntilExpiry();
            const expiryDate = systemAuthService.getTokenExpiry();

            console.log('System Token Status:');
            console.log('  Is Expired:', isExpired);
            console.log('  Time Until Expiry:', Math.round(timeUntilExpiry / 60000), 'minutes');
            console.log('  Expiry Date:', expiryDate?.toLocaleString());
        } else {
            const isExpired = authService.isTokenExpired();
            const timeUntilExpiry = authService.getTimeUntilExpiry();
            const expiryDate = authService.getTokenExpiry();

            console.log('Community Token Status:');
            console.log('  Is Expired:', isExpired);
            console.log('  Time Until Expiry:', Math.round(timeUntilExpiry / 60000), 'minutes');
            console.log('  Expiry Date:', expiryDate?.toLocaleString());
        }
    },

    /**
     * Reset token expiry to normal (24 hours for community, 8 hours for system)
     */
    resetTokenExpiry: (userType: 'community' | 'system' = 'community') => {
        const expiryTime = new Date();

        if (userType === 'system') {
            expiryTime.setHours(expiryTime.getHours() + 8);
            localStorage.setItem('systemTokenExpiry', expiryTime.toISOString());
            console.log('✅ Reset system token expiry to 8 hours from now');
        } else {
            expiryTime.setHours(expiryTime.getHours() + 24);
            localStorage.setItem('tokenExpiry', expiryTime.toISOString());
            console.log('✅ Reset community token expiry to 24 hours from now');
        }
    },

    /**
     * Show all localStorage auth data
     */
    showAuthData: () => {
        console.log('🔍 All Auth Data in localStorage:');
        console.log('user:', localStorage.getItem('user'));
        console.log('authToken:', localStorage.getItem('authToken'));
        console.log('tokenExpiry:', localStorage.getItem('tokenExpiry'));
        console.log('systemUser:', localStorage.getItem('systemUser'));
        console.log('systemAuthToken:', localStorage.getItem('systemAuthToken'));
        console.log('systemTokenExpiry:', localStorage.getItem('systemTokenExpiry'));
        console.log('systemUserType:', localStorage.getItem('systemUserType'));
    }
};

// Make it available globally for testing
if (typeof window !== 'undefined') {
    (window as any).tokenExpiryTest = tokenExpiryTestUtils;
}
