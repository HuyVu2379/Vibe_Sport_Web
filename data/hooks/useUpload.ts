import { useState } from 'react';
import { apiClient, API_ENDPOINTS } from '../api/client';
import { UploadResultDto } from '../../domain/types';

export function useUploadImage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (file: File, folder: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);
            const res = await apiClient.post<UploadResultDto>(API_ENDPOINTS.UPLOAD.IMAGE, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res;
        } catch (err: any) {
            setError(err.message || 'Upload failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const uploadImages = async (files: File[]) => {
        setIsLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            files.forEach((file) => formData.append('files', file));

            const res = await apiClient.post<UploadResultDto[]>(API_ENDPOINTS.UPLOAD.IMAGES, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res;
        } catch (err: any) {
            setError(err.message || 'Upload failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { uploadImage, uploadImages, isLoading, error };
}

export function useDeleteFile() {
    const [isLoading, setIsLoading] = useState(false);

    const deleteFile = async (publicId: string) => {
        setIsLoading(true);
        try {
            await apiClient.delete(`${API_ENDPOINTS.UPLOAD.DELETE}?publicId=${publicId}`);
        } finally {
            setIsLoading(false);
        }
    };

    return { deleteFile, isLoading };
}
