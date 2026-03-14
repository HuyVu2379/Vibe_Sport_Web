import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../api/client';
import { storage } from '../storage';
import { useGetMe } from './useUsers';
import {
    LoginDto,
    RegisterDto,
    LoginResponseDto,
    RegisterResponseDto,
    GetMeResponseDto,
} from '../../domain/types';

export function useAuth() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<GetMeResponseDto | null>(null);
    const { getMe } = useGetMe();
    // Initial load
    const initUser = () => {
        setUser(storage.getUser());
    };

    const login = async (data: LoginDto) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<LoginResponseDto>('/auth/login', {
                phoneOrEmail: data.phoneOrEmail,
                otpOrPassword: data.otpOrPassword,
            });

            if (response.token) {
                storage.setToken(response.token);
                getMe();
                router.push('/venues');
            }
            return response;
        } catch (err: any) {
            const message = err.message || 'Login failed. Please check your credentials.';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterDto) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<RegisterResponseDto>('/auth/register', data);
            if (response.token) {
                storage.setToken(response.token);
                getMe();
                router.push('/venues');
            }
            return response;
        } catch (err: any) {
            const message = err.message || 'Registration failed.';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await apiClient.post('/users/logout');
        } catch {
            // Best effort — clear local state regardless
        }
        storage.clear();
        setUser(null);
        router.push('/login');
    };

    return { login, register, logout, isLoading, error, user, initUser };
}
