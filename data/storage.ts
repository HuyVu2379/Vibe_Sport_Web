import { GetMeResponseDto } from "@/domain/types";

const VERSION = 'v1';
const TOKEN_KEY = `vibe_auth_token:${VERSION}`;
const USER_KEY = `vibe_user_info:${VERSION}`;

// Migration from unversioned to versioned
if (typeof window !== 'undefined') {
    try {
        const oldToken = localStorage.getItem('vibe_auth_token');
        if (oldToken) {
            localStorage.setItem(TOKEN_KEY, oldToken);
            localStorage.removeItem('vibe_auth_token');
        }
        const oldUser = localStorage.getItem('vibe_user_info');
        if (oldUser) {
            localStorage.setItem(USER_KEY, oldUser);
            localStorage.removeItem('vibe_user_info');
        }
    } catch {
        // ignore
    }
}

const dispatchAuthChange = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-change'));
    }
};

export const storage = {
    getToken: () => {
        if (typeof window === 'undefined') return null;
        try {
            return localStorage.getItem(TOKEN_KEY);
        } catch { return null; }
    },
    setToken: (token: string) => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(TOKEN_KEY, token);
            dispatchAuthChange();
        } catch { }
    },
    removeToken: () => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.removeItem(TOKEN_KEY);
            dispatchAuthChange();
        } catch { }
    },
    getUser: () => {
        if (typeof window === 'undefined') return null;
        try {
            const user = localStorage.getItem(USER_KEY);
            return user ? JSON.parse(user) : null;
        } catch { return null; }
    },
    setUser: (user: GetMeResponseDto) => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            dispatchAuthChange();
        } catch { }
    },
    removeUser: () => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.removeItem(USER_KEY);
            dispatchAuthChange();
        } catch { }
    },
    clear: () => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            dispatchAuthChange();
        } catch { }
    }
};
