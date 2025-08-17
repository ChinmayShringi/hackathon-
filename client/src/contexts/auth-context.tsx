import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

interface User {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    credits: number;
    accountType: number;
    accessRole: number;
    handle?: string;
    createdAt: string;
    lastSeenAt: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user: dynamicUser, isAuthenticated: isDynamicAuthenticated } = useDynamicContext();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserProfile = async () => {
        if (!isDynamicAuthenticated || !dynamicUser) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            // Try to get user profile from your backend
            const response = await fetch('/api/auth/user', {
                credentials: 'include',
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else if (response.status === 401) {
                // User not found in backend, create new user
                await createUserFromDynamic();
            } else {
                console.error('Failed to fetch user profile:', response.statusText);
                setUser(null);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const createUserFromDynamic = async () => {
        if (!dynamicUser) return;

        try {
            const response = await fetch('/api/auth/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: dynamicUser.email,
                    firstName: dynamicUser.firstName,
                    lastName: dynamicUser.lastName,
                    profileImageUrl: dynamicUser.profileImageUrl,
                    dynamicUserId: dynamicUser.id,
                }),
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                console.error('Failed to create user:', response.statusText);
                setUser(null);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            setUser(null);
        }
    };

    const refreshUser = async () => {
        await fetchUserProfile();
    };

    const login = () => {
        // Dynamic Labs handles the login flow
    };

    const logout = () => {
        // Dynamic Labs handles the logout flow
        setUser(null);
    };

    useEffect(() => {
        fetchUserProfile();
    }, [isDynamicAuthenticated, dynamicUser]);

    const value: AuthContextType = {
        user,
        isAuthenticated: isDynamicAuthenticated && !!user,
        isLoading,
        login,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
