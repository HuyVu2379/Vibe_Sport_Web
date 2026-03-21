import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { storage } from '../storage';
import { toast } from "sonner";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface ApiErrorResponse {
    errorCode: string;
    message: string;
    traceId: string;
}

axiosInstance.interceptors.request.use(
    (config) => {
        const token = storage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError<ApiErrorResponse>) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                storage.clear();
                if (typeof window !== 'undefined') {
                    toast.error("Phiên đăng nhập đã hết hạn hoặc bạn chưa đăng nhập.", {
                        description: "Vui lòng đăng nhập lại để tiếp tục.",
                    });
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 3000);
                }
            }

            const apiError = new Error(data?.message || 'Unknown error');
            (apiError as any).errorCode = data?.errorCode || 'UNKNOWN';
            (apiError as any).traceId = data?.traceId;
            (apiError as any).response = data;

            return Promise.reject(apiError);
        }
        return Promise.reject(error);
    }
);

// Typed wrapper to match the interceptor's behavior (returning data directly)
export const apiClient = {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
        axiosInstance.get<T>(url, config).then(res => res as unknown as T),

    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        axiosInstance.post<T>(url, data, config).then(res => res as unknown as T),

    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        axiosInstance.put<T>(url, data, config).then(res => res as unknown as T),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
        axiosInstance.delete<T>(url, config).then(res => res as unknown as T),

    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        axiosInstance.patch<T>(url, data, config).then(res => res as unknown as T),
};

export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
    },
    // Users
    USERS: {
        PROFILE: "/users/profile",
        GET_ME: "/users/me",
        CHANGE_PASSWORD: "/users/change-password",
        FORGOT_PASSWORD_REQUEST: "/users/forgot-password/request",
        FORGOT_PASSWORD_VERIFY: "/users/forgot-password/verify",
        LOGOUT: "/users/logout",
    },
    // Venues
    VENUES: {
        LIST: "/venues",
        DETAIL: (id: string) => `/venues/${id}`,
    },
    // Courts
    COURTS: {
        AVAILABILITY: (courtId: string, date: string) =>
            `/courts/${courtId}/availability?date=${date}`,
    },
    // Bookings (Customer)
    BOOKINGS: {
        LIST: "/me/bookings",
        CREATE_HOLD: "/bookings/hold",
        CONFIRM: (id: string) => `/bookings/${id}/confirm`,
        CANCEL: (id: string) => `/bookings/${id}/cancel`,
    },
    // Reviews
    REVIEWS: {
        CREATE: (bookingId: string) => `/bookings/${bookingId}/review`,
        VENUE_LIST: (venueId: string) => `/venues/${venueId}/reviews`,
        REPLY: (reviewId: string) => `/reviews/${reviewId}/reply`,
        DETAIL: (reviewId: string) => `/reviews/${reviewId}`,
    },
    // Chat
    CHAT: {
        CONVERSATIONS: "/conversations",
        CONVERSATION_DETAIL: (id: string) => `/conversations/${id}`,
        MESSAGES: (id: string) => `/conversations/${id}/messages`,
        START_BOOKING_CHAT: (bookingId: string) =>
            `/conversations/booking/${bookingId}`,
        START_VENUE_INQUIRY: (venueId: string) =>
            `/conversations/venue/${venueId}/inquiry`,
    },
    // Favorites
    FAVORITES: {
        ADD: (venueId: string) => `/venues/${venueId}/favorite`,
        REMOVE: (venueId: string) => `/venues/${venueId}/favorite`,
        TOGGLE: (venueId: string) => `/venues/${venueId}/favorite/toggle`,
        STATUS: (venueId: string) => `/venues/${venueId}/favorite/status`,
        USER_LIST: "/favorites",
    },
    // Upload
    UPLOAD: {
        IMAGE: "/upload/image",
        IMAGES: "/upload/images",
        VIDEO: "/upload/video",
        FILE: "/upload/file",
        DELETE: "/upload",
    },
    // Owner
    OWNER: {
        ANALYTICS: (venueId: string) => `/owner/analytics/${venueId}`,
        BOOKINGS: "/owner/bookings",
        CANCEL_BOOKING: (bookingId: string) =>
            `/owner/bookings/${bookingId}/cancel`,
    },
} as const;
