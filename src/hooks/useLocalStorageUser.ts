import { useState, useEffect } from 'react';

interface User {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    phone?: string;
    pan?: string;
    adhar?: string;
    maritalStatus?: string;
    dateOfBirth?: string;
    dateOfMarriage?: string;
    kul?: string;
    gotra?: string;
    fatherName?: string;
    motherName?: string;
    childrenName?: string;
    role: 'Super Admin' | 'Admin' | 'Member' | 'Moderator' | 'Guest' | 'admin';
    roleId?: string;
    verified: boolean;
    isActive?: boolean;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
    fullName?: string;
    displayName?: string;
    id?: string;
    // System user specific fields
    userType?: 'system' | 'community';
    department?: string;
    employeeId?: string;
    accessLevel?: number;
    systemRole?: string;
}

interface UseLocalStorageUserReturn {
    user: User | null;
    userName: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: string;
    isLoggedIn: boolean;
    isLoading: boolean;
    refreshUser: () => void;
}

/**
 * React hook to get logged-in user information from localStorage
 * @returns Object containing user data and utility functions
 */
export const useLocalStorageUser = (): UseLocalStorageUserReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const getUserFromStorage = (): User | null => {
        try {
            // Check for system user first
            const systemUserType = localStorage.getItem('systemUserType');
            if (systemUserType === 'system') {
                const systemUserData = localStorage.getItem('systemUser');
                const systemToken = localStorage.getItem('systemAuthToken');

                console.log('🔍 useLocalStorageUser - System user detected:');
                console.log('  System User Data:', systemUserData);
                console.log('  System Token:', systemToken);

                if (systemUserData && systemToken) {
                    const parsedData = JSON.parse(systemUserData);
                    console.log('  Parsed System Data:', parsedData);

                    // Basic validation to ensure we have a valid system user object
                    if (parsedData && typeof parsedData === 'object' && parsedData._id) {
                        console.log('  ✅ Valid system user found:', parsedData.firstName, parsedData.lastName);
                        return parsedData;
                    } else {
                        console.log('  ❌ Invalid system user object structure');
                        console.log('  Expected: object with _id property');
                        console.log('  Got:', parsedData);
                    }
                } else {
                    console.log('  ❌ Missing system user data or token');
                }
            }

            // Fallback to community user data
            const userData = localStorage.getItem('user');
            const token = localStorage.getItem('authToken');

            console.log('🔍 useLocalStorageUser - Community user check:');
            console.log('  User Data:', userData);
            console.log('  Token:', token);

            if (userData && token) {
                const parsedData = JSON.parse(userData);
                console.log('  Parsed Data:', parsedData);

                // Handle both direct user object and nested user object structure
                let userObject = parsedData;

                // If the data has a nested 'user' property, extract it
                if (parsedData && typeof parsedData === 'object' && parsedData.user) {
                    userObject = parsedData.user;
                    console.log('  Extracted nested user object:', userObject);
                }

                // Basic validation to ensure we have a valid user object
                if (userObject && typeof userObject === 'object' && userObject._id) {
                    console.log('  ✅ Valid community user found:', userObject.firstName, userObject.lastName);
                    return userObject;
                } else {
                    console.log('  ❌ Invalid user object structure');
                    console.log('  Expected: object with _id property');
                    console.log('  Got:', userObject);
                }
            } else {
                console.log('  ❌ Missing user data or token');
            }
            return null;
        } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
            return null;
        }
    };

    const refreshUser = () => {
        const storedUser = getUserFromStorage();
        setUser(storedUser);
    };

    useEffect(() => {
        // Add a small delay to ensure localStorage is available
        const timer = setTimeout(() => {
            const storedUser = getUserFromStorage();
            console.log('🔍 useLocalStorageUser - Initial load:', storedUser);
            setUser(storedUser);
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Also check localStorage on every render to catch updates
    useEffect(() => {
        const storedUser = getUserFromStorage();
        if (storedUser && (!user || storedUser._id !== user._id)) {
            console.log('🔍 useLocalStorageUser - User data changed, updating:', storedUser);
            setUser(storedUser);
        }
    });

    // Listen for storage changes (when user logs in/out in another tab)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'user') {
                if (e.newValue) {
                    try {
                        const parsedData = JSON.parse(e.newValue);
                        let userObject = parsedData;

                        // Handle nested user object structure
                        if (parsedData && typeof parsedData === 'object' && parsedData.user) {
                            userObject = parsedData.user;
                        }

                        if (userObject && typeof userObject === 'object' && userObject._id) {
                            setUser(userObject);
                        } else {
                            setUser(null);
                        }
                    } catch (error) {
                        console.error('Error parsing user data from storage event:', error);
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Also listen for custom events (for same-tab updates)
    useEffect(() => {
        const handleUserUpdate = () => {
            console.log('🔍 useLocalStorageUser - userDataUpdated event received');
            const storedUser = getUserFromStorage();
            console.log('🔍 useLocalStorageUser - Retrieved user from storage:', storedUser);
            setUser(storedUser);
        };

        console.log('🔍 useLocalStorageUser - Setting up event listener for userDataUpdated');
        window.addEventListener('userDataUpdated', handleUserUpdate);
        return () => {
            console.log('🔍 useLocalStorageUser - Removing event listener for userDataUpdated');
            window.removeEventListener('userDataUpdated', handleUserUpdate);
        };
    }, []);

    // More robust userName calculation - check both system and community user data
    const getUserName = (): string => {
        if (user && user.firstName && user.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
        if (user?.firstName) return user.firstName;
        if (user?.username) return user.username;

        // Fallback: check localStorage directly
        try {
            // Check for system user first
            const systemUserType = localStorage.getItem('systemUserType');
            if (systemUserType === 'system') {
                const systemUserData = localStorage.getItem('systemUser');
                if (systemUserData) {
                    const parsedData = JSON.parse(systemUserData);
                    if (parsedData && parsedData.firstName && parsedData.lastName) {
                        return `${parsedData.firstName} ${parsedData.lastName}`;
                    }
                    if (parsedData?.firstName) return parsedData.firstName;
                    if (parsedData?.username) return parsedData.username;
                }
            }

            // Fallback to community user data
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedData = JSON.parse(userData);
                let userObject = parsedData;
                if (parsedData && typeof parsedData === 'object' && parsedData.user) {
                    userObject = parsedData.user;
                }
                if (userObject && userObject.firstName && userObject.lastName) {
                    return `${userObject.firstName} ${userObject.lastName}`;
                }
                if (userObject?.firstName) return userObject.firstName;
                if (userObject?.username) return userObject.username;
            }
        } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
        }

        return 'Unknown User';
    };

    const userName = getUserName();

    // Debug: Log the computed userName and user data
    console.log('🔍 useLocalStorageUser - User data:', user);
    console.log('🔍 useLocalStorageUser - Computed userName:', userName);

    // Make getUserFromStorage available globally for debugging
    if (typeof window !== 'undefined') {
        (window as any).debugGetUserFromStorage = getUserFromStorage;
        (window as any).debugLocalStorage = () => {
            console.log('🔍 Debug localStorage:');
            console.log('  user:', localStorage.getItem('user'));
            console.log('  authToken:', localStorage.getItem('authToken'));
            console.log('  tokenExpiry:', localStorage.getItem('tokenExpiry'));
        };
    }


    // More robust field calculations - check both system and community user data
    const getFieldValue = (field: string): string => {
        if (user && user[field as keyof User]) {
            return user[field as keyof User] as string;
        }

        // Fallback: check localStorage directly
        try {
            // Check for system user first
            const systemUserType = localStorage.getItem('systemUserType');
            if (systemUserType === 'system') {
                const systemUserData = localStorage.getItem('systemUser');
                if (systemUserData) {
                    const parsedData = JSON.parse(systemUserData);
                    if (parsedData && parsedData[field]) {
                        return parsedData[field];
                    }
                }
            }

            // Fallback to community user data
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedData = JSON.parse(userData);
                let userObject = parsedData;
                if (parsedData && typeof parsedData === 'object' && parsedData.user) {
                    userObject = parsedData.user;
                }
                if (userObject && userObject[field]) {
                    return userObject[field];
                }
            }
        } catch (error) {
            console.error(`Error parsing ${field} from localStorage:`, error);
        }

        return 'Unknown';
    };

    const firstName = getFieldValue('firstName');
    const lastName = getFieldValue('lastName');
    const username = getFieldValue('username');
    const email = getFieldValue('email');
    const role = getFieldValue('role');
    // More robust isLoggedIn calculation - check both system and community user data
    const isLoggedIn = (() => {
        // Check for system user first
        const systemUserType = localStorage.getItem('systemUserType');
        if (systemUserType === 'system') {
            return !!(localStorage.getItem('systemUser') && localStorage.getItem('systemAuthToken'));
        }
        // Fallback to community user
        return !!(localStorage.getItem('user') && localStorage.getItem('authToken'));
    })();

    return {
        user,
        userName,
        firstName,
        lastName,
        username,
        email,
        role,
        isLoggedIn,
        isLoading,
        refreshUser
    };
};

/**
 * Simple hook to just get the user's name from localStorage
 * @returns The user's full name or fallback text
 */
export const useUserName = (): string => {
    const { userName } = useLocalStorageUser();
    return userName;
};

/**
 * Hook to get user's first name from localStorage
 * @returns The user's first name or fallback text
 */
export const useUserFirstName = (): string => {
    const { firstName } = useLocalStorageUser();
    return firstName;
};

/**
 * Hook to check if user is logged in
 * @returns Boolean indicating if user is logged in
 */
export const useIsLoggedIn = (): boolean => {
    const { isLoggedIn } = useLocalStorageUser();
    return isLoggedIn;
};
