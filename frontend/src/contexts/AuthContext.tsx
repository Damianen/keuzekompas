import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginData, RegisterData } from '../types';
import { authApi, userApi } from '../services/api';
import { AuthContext, type AuthContextType } from './AuthContextType';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        }

        setIsLoading(false);
    }, []);

    const login = async (data: LoginData) => {
        const response = await authApi.login(data);
        localStorage.setItem('authToken', response.token);

        // Fetch user data with the token
        const userData = await userApi.getById(response.id);

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const register = async (data: RegisterData) => {
        const response = await authApi.register(data);
        localStorage.setItem('authToken', response.token);

        // Fetch user data with the token
        const userData = await userApi.getById(response.id);

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    const refreshUser = async () => {
        if (!user?.id) return;

        try {
            const userData = await userApi.getById(user.id);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error('Error refreshing user data:', error);
            // If we can't refresh user data, they might need to re-login
            logout();
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
