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
            const userData = localStorage.getItem('user');
            const token = localStorage.getItem('authToken');

            console.log('🔍 useLocalStorageUser - getUserFromStorage:');
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
                    console.log('  ✅ Valid user found:', userObject.firstName, userObject.lastName);
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
            setUser(storedUser);
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

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
            const storedUser = getUserFromStorage();
            setUser(storedUser);
        };

        window.addEventListener('userDataUpdated', handleUserUpdate);
        return () => window.removeEventListener('userDataUpdated', handleUserUpdate);
    }, []);

    const userName = user && user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.firstName || user?.username || 'Unknown User';

    const firstName = user?.firstName || 'Unknown';
    const lastName = user?.lastName || 'Unknown';
    const username = user?.username || 'Unknown';
    const email = user?.email || 'Unknown';
    const role = user?.role || 'Unknown';
    const isLoggedIn = !!(user && localStorage.getItem('authToken'));

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
