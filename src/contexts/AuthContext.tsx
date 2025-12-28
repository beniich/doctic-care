import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, PERMISSIONS } from '@/lib/constants';

// ============================================================================
// CONFIGURATION & TYPES
// ============================================================================

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (role: string) => void;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const savedUser = JSON.parse(localStorage.getItem('userData') || '{}');
            setUser(savedUser);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (role: string) => {
        const mockUser = {
            id: '1',
            email: 'medecin@doctic.com',
            name: 'Dr. Dupont',
            role,
            permissions: Object.entries(PERMISSIONS)
                .filter(([, roles]) => roles.includes(role))
                .map(([perm]) => perm)
        };
        localStorage.setItem('accessToken', 'mock-token');
        localStorage.setItem('userData', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        setUser(null);
        setIsAuthenticated(false);
    };

    const hasPermission = (permission: string) => user?.permissions?.includes(permission) ?? false;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
