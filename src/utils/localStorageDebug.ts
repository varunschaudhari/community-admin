/**
 * Utility functions to debug and fix localStorage issues
 */

export interface LocalStorageDebugInfo {
    hasUser: boolean;
    hasToken: boolean;
    userData: any;
    token: string | null;
    isValidUser: boolean;
    issues: string[];
}

/**
 * Debug localStorage state
 */
export const debugLocalStorage = (): LocalStorageDebugInfo => {
    const issues: string[] = [];
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');

    const hasUser = !!userData;
    const hasToken = !!token;
    let parsedUser = null;
    let isValidUser = false;

    if (hasUser) {
        try {
            parsedUser = JSON.parse(userData!);
            isValidUser = parsedUser &&
                typeof parsedUser === 'object' &&
                parsedUser._id &&
                (parsedUser.firstName || parsedUser.username);
        } catch (error) {
            issues.push('Failed to parse user data from localStorage');
        }
    }

    if (!hasUser) {
        issues.push('No user data found in localStorage');
    }

    if (!hasToken) {
        issues.push('No auth token found in localStorage');
    }

    if (hasUser && !isValidUser) {
        issues.push('User data is invalid or incomplete');
    }

    if (hasUser && hasToken && !isValidUser) {
        issues.push('User data exists but is malformed');
    }

    return {
        hasUser,
        hasToken,
        userData: parsedUser,
        token,
        isValidUser,
        issues
    };
};

/**
 * Fix common localStorage issues
 */
export const fixLocalStorage = (): { success: boolean; message: string } => {
    const debug = debugLocalStorage();

    if (debug.issues.length === 0) {
        return { success: true, message: 'LocalStorage is healthy' };
    }

    // If we have invalid user data, clear it
    if (debug.hasUser && !debug.isValidUser) {
        localStorage.removeItem('user');
        console.log('Cleared invalid user data from localStorage');
    }

    // If we have user but no token, clear user
    if (debug.hasUser && !debug.hasToken) {
        localStorage.removeItem('user');
        console.log('Cleared user data due to missing token');
    }

    // If we have token but no user, clear token
    if (debug.hasToken && !debug.hasUser) {
        localStorage.removeItem('authToken');
        console.log('Cleared token due to missing user data');
    }

    return {
        success: true,
        message: `Fixed ${debug.issues.length} localStorage issues`
    };
};

/**
 * Restore user data from backup (if available)
 */
export const restoreUserData = (): { success: boolean; message: string } => {
    const backup = localStorage.getItem('userBackup');

    if (!backup) {
        return { success: false, message: 'No backup data available' };
    }

    try {
        const userData = JSON.parse(backup);
        if (userData && userData._id) {
            localStorage.setItem('user', backup);
            window.dispatchEvent(new CustomEvent('userDataUpdated'));
            return { success: true, message: 'User data restored from backup' };
        }
    } catch (error) {
        return { success: false, message: 'Failed to restore from backup' };
    }

    return { success: false, message: 'Invalid backup data' };
};

/**
 * Create backup of current user data
 */
export const backupUserData = (): { success: boolean; message: string } => {
    const userData = localStorage.getItem('user');

    if (!userData) {
        return { success: false, message: 'No user data to backup' };
    }

    try {
        const parsed = JSON.parse(userData);
        if (parsed && parsed._id) {
            localStorage.setItem('userBackup', userData);
            return { success: true, message: 'User data backed up successfully' };
        }
    } catch (error) {
        return { success: false, message: 'Failed to backup user data' };
    }

    return { success: false, message: 'Invalid user data for backup' };
};

/**
 * Force refresh user data from localStorage
 */
export const forceRefreshUserData = (): void => {
    window.dispatchEvent(new CustomEvent('userDataUpdated'));
};

/**
 * Check if localStorage is working properly
 */
export const testLocalStorage = (): { success: boolean; message: string } => {
    try {
        const testKey = '__test__';
        const testValue = 'test';

        localStorage.setItem(testKey, testValue);
        const retrieved = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);

        if (retrieved === testValue) {
            return { success: true, message: 'LocalStorage is working properly' };
        } else {
            return { success: false, message: 'LocalStorage read/write test failed' };
        }
    } catch (error) {
        return { success: false, message: 'LocalStorage is not available' };
    }
};

/**
 * Get comprehensive localStorage status
 */
export const getLocalStorageStatus = () => {
    const debug = debugLocalStorage();
    const test = testLocalStorage();

    console.log('🔍 LocalStorage Debug Information:');
    console.log('   Has User Data:', debug.hasUser);
    console.log('   Has Token:', debug.hasToken);
    console.log('   Valid User:', debug.isValidUser);
    console.log('   Storage Test:', test.success ? '✅ Passed' : '❌ Failed');

    if (debug.issues.length > 0) {
        console.log('   Issues Found:');
        debug.issues.forEach(issue => console.log(`     - ${issue}`));
    }

    if (debug.userData) {
        console.log('   User Data:', debug.userData);
    }

    return { debug, test };
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
    (window as any).debugLocalStorage = debugLocalStorage;
    (window as any).fixLocalStorage = fixLocalStorage;
    (window as any).restoreUserData = restoreUserData;
    (window as any).backupUserData = backupUserData;
    (window as any).forceRefreshUserData = forceRefreshUserData;
    (window as any).testLocalStorage = testLocalStorage;
    (window as any).getLocalStorageStatus = getLocalStorageStatus;
}
