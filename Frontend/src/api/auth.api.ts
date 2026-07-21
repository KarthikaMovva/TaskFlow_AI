import api from "./axios";

export async function registerUser(data: {
    name: string;
    email: string;
    password: string;
}) {
    const response = await api.post(
        "/auth/register",
        data
    );
    return response.data;
}


export async function loginUser(data: {
    email: string;
    password: string;
}) {
    const response = await api.post(
        "/auth/login",
        data
    );
    return response.data;
}

export async function logoutUser() {
    const response = await api.post(
        "/auth/logout"
    );
    return response.data;
}

export async function refreshUserToken() {
    const response = await api.post(
        "/auth/refresh"
    );
    return response.data;
}