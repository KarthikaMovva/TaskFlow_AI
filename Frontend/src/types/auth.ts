export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}