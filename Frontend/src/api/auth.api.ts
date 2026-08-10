import api from "./client";
import { User } from "@/src/types";

export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    user?: User;
    tokens?: {
        accessToken: string;
        refreshToken: string;
    };
}

export const authApi = {
    register: async (data: RegisterDTO): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/register", data);
        return response.data;
    },

    login: async (data: LoginDTO): Promise<{ success: boolean; tokens: { accessToken: string; refreshToken: string } }> => {
        const response = await api.post<{ success: boolean; tokens: { accessToken: string; refreshToken: string } }>("/auth/login", data);
        return response.data;
    },

    refreshToken: async (refreshToken: string): Promise<{ success: boolean; accessToken: string }> => {
        const response = await api.post<{ success: boolean; accessToken: string }>("/auth/refresh", { refreshToken });
        return response.data;
    },

    logout: async (refreshToken: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.post<{ success: boolean; message: string }>("/auth/logout", { refreshToken });
        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<{ message: string; user: User }>("/test-auth");
        return response.data.user;
    },
};
