"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    _id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    steamId?: string;
    faceitId?: string;
    faceitNickname?: string;
    faceitElo?: number;
    faceitLevel?: number;
    isPrime?: boolean;
    isp?: string;
    city?: string;
    isPremium: boolean;
    audioEnabled?: boolean;
    theme?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, name: string) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: () => { },
    logout: () => { },
    updateUser: () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on mount
        const saved = localStorage.getItem("uz-cs2-user");
        if (saved) {
            try {
                setUser(JSON.parse(saved));
            } catch {
                localStorage.removeItem("uz-cs2-user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, name: string) => {
        const newUser: User = {
            _id: `user_${Date.now()}`,
            email,
            name,
            isPremium: false,
            audioEnabled: true,
            theme: "dark",
        };
        setUser(newUser);
        localStorage.setItem("uz-cs2-user", JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("uz-cs2-user");
    };

    const updateUser = (updates: Partial<User>) => {
        if (user) {
            const updated = { ...user, ...updates };
            setUser(updated);
            localStorage.setItem("uz-cs2-user", JSON.stringify(updated));
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}
