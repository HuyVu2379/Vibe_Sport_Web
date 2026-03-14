import { useState } from 'react';
import { apiClient } from '../api/client';
import { storage } from '../storage';
import {
    UpdateProfileDto,
    ChangePasswordDto,
    ForgotPasswordRequestDto,
    ForgotPasswordVerifyDto,
    SuccessResponseDto,
    User,
    GetMeResponseDto,
} from '../../domain/types';

export function useUpdateProfile() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { getMe } = useGetMe();

    const updateProfile = async (data: UpdateProfileDto) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.patch<SuccessResponseDto>('/users/profile', data);
            if (response && response.message) {
                await getMe();
            }
            return response;
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { updateProfile, isLoading, error };
}

export function useChangePassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const changePassword = async (data: ChangePasswordDto) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<SuccessResponseDto>('/users/change-password', data);
            return response;
        } catch (err: any) {
            setError(err.message || 'Failed to change password');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { changePassword, isLoading, error };
}

export function useForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestOtp = async (data: ForgotPasswordRequestDto) => {
        setIsLoading(true);
        setError(null);
        try {
            return await apiClient.post<SuccessResponseDto>('/users/forgot-password/request', data);
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const verifyAndReset = async (data: ForgotPasswordVerifyDto) => {
        setIsLoading(true);
        setError(null);
        try {
            return await apiClient.post<SuccessResponseDto>('/users/forgot-password/verify', data);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };
    return { requestOtp, verifyAndReset, isLoading, error };
}

export function useGetMe() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getMe = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<GetMeResponseDto>('/users/me');
            if (response) {
                storage.setUser(response);
            }
            return response;
        } catch (err: any) {
            setError(err.message || 'Failed to get user');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { getMe, isLoading, error };
};