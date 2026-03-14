import { GetMeResponseDto } from "@/domain/types";

const TOKEN_KEY = 'vibe_auth_token';
const USER_KEY = 'vibe_user_info';

export const storage = {
    getToken: () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(TOKEN_KEY);
    },
    setToken: (token: string) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(TOKEN_KEY, token);
    },
    removeToken: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(TOKEN_KEY);
    },
    getUser: () => {
        if (typeof window === 'undefined') return null;
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },
    setUser: (user: GetMeResponseDto) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    removeUser: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(USER_KEY);
    },
    clear: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
};
