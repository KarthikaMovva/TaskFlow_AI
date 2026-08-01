"use client";
import {
    createContext,
    useEffect,
    useState,
    ReactNode
} from "react";
import {
    clearTokens,
    getAccessToken,
    saveTokens
} from "@/src/lib/token";

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

export const AuthContext =
    createContext<AuthContextType | null>(null);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {

    const [
        isAuthenticated,
        setAuthenticated
    ] = useState(false);

    const [
        loading,
        setLoading
    ] = useState(true);

    useEffect(() => {
        const token = getAccessToken();
        setAuthenticated(!!token);
        setLoading(false);
    }, []);

    function login(accessToken: string, refreshToken: string) {
        saveTokens(accessToken, refreshToken);
        setAuthenticated(true);
    }

    function logout() {
        clearTokens();
        setAuthenticated(false);
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}