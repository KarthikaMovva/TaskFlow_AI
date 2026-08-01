import api from "../lib/axios";
import {
    LoginRequest,
    RegisterRequest,
    LoginResponse,
    RegisterResponse
} from "../types/auth";

class AuthService {
    async login(data: LoginRequest) {
        const response = await api.post<LoginResponse>(
            "/auth/login",
            data
        );
        return response.data;
    }

    async register(data: RegisterRequest) {
        const response = await api.post<RegisterResponse>(
            "/auth/register",
            data
        );
        return response.data;
    }
}

export default new AuthService();