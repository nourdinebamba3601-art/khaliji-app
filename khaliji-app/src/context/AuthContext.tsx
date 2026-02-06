'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export type User = {
    id: string;
    name: string;
    phone: string;
    address?: string;
};

type AuthContextType = {
    user: User | null;
    isAdminLogged: boolean;
    login: (name: string, phone: string, address?: string) => void;
    logout: () => void;
    updateProfile: (data: Partial<User>) => void;
    adminLogin: (email: string, pass: string) => boolean;
    adminLogout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAdminLogged, setIsAdminLogged] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('khaliji_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        const adminAuth = localStorage.getItem('khaliji_admin_auth') === 'true';
        setIsAdminLogged(adminAuth);

        setLoading(false);
    }, []);

    const login = (name: string, phone: string, address?: string) => {
        const newUser: User = {
            id: `USER-${phone.replace(/\s+/g, '')}`, // ID is based on phone for simplicity
            name,
            phone,
            address
        };
        setUser(newUser);
        localStorage.setItem('khaliji_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('khaliji_user');
    };

    const adminLogin = (email: string, pass: string) => {
        // Owner Credentials
        const ADMIN_EMAIL = "nourdinebamba36@gmail.com";
        const ADMIN_PASS = "36010201Ndr";

        if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
            setIsAdminLogged(true);
            localStorage.setItem('khaliji_admin_auth', 'true');
            // set cookie for middleware protection if any
            document.cookie = `auth_token=admin-token; path=/; max-age=86400; SameSite=Strict`;
            return true;
        }
        return false;
    };


    const adminLogout = () => {
        setIsAdminLogged(false);
        localStorage.removeItem('khaliji_admin_auth');
    };

    const updateProfile = (data: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('khaliji_user', JSON.stringify(updatedUser));
    };

    if (loading) return null;

    return (
        <AuthContext.Provider value={{ user, isAdminLogged, login, logout, updateProfile, adminLogin, adminLogout }}>
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
