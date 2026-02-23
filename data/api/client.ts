import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { storage } from '../storage';

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
                    // Optional: redirect to login
                    // window.location.href = '/login';
                }
            }

            return Promise.reject(data || { message: 'Unknown error', errorCode: 'UNKNOWN' });
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
