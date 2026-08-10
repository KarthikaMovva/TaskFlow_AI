"use client";
import {
    createContext,
    useEffect,
    useState,
    ReactNode,
    useCallback
} from "react";
import {
    clearTokens,
    getAccessToken,
    saveTokens
} from "@/src/lib/token";
import { authApi } from "@/src/api/auth.api";
import { User } from "@/src/types";

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    user: User | null;
    login: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    const fetchUser = useCallback(async () => {
        const token = getAccessToken();
        if (!token) {
            setAuthenticated(false);
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const currentUser = await authApi.getCurrentUser();
            setUser(currentUser);
            setAuthenticated(true);
        } catch (error) {
            console.error("Failed to restore session", error);
            clearTokens();
            setAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    async function login(accessToken: string, refreshToken: string) {
        saveTokens(accessToken, refreshToken);
        setAuthenticated(true);
        await fetchUser();
    }

    function logout() {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            authApi.logout(refreshToken).catch(() => {});
        }
        clearTokens();
        setAuthenticated(false);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                loading,
                user,
                login,
                logout,
                refreshUser: fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}