import { useState, useEffect, useCallback } from 'react';
import { apiClient, API_ENDPOINTS } from '../api/client';
import {
    FavoriteStatusResponseDto,
    ToggleFavoriteResponseDto,
    FavoritesListResponseDto,
} from '../../domain/types';

export function useFavoriteStatus(venueId: string) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const checkStatus = useCallback(async () => {
        if (!venueId) return;
        setIsLoading(true);
        try {
            const res = await apiClient.get<FavoriteStatusResponseDto>(
                API_ENDPOINTS.FAVORITES.STATUS(venueId)
            );
            setIsFavorite(res.isFavorite);
        } catch {
            // Silently fail — user may not be logged in
        } finally {
            setIsLoading(false);
        }
    }, [venueId]);

    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    return { isFavorite, isLoading, refetch: checkStatus };
}

export function useToggleFavorite() {
    const [isLoading, setIsLoading] = useState(false);

    const toggleFavorite = async (venueId: string) => {
        setIsLoading(true);
        try {
            const res = await apiClient.post<ToggleFavoriteResponseDto>(
                API_ENDPOINTS.FAVORITES.TOGGLE(venueId)
            );
            return res.isFavorite;
        } finally {
            setIsLoading(false);
        }
    };

    return { toggleFavorite, isLoading };
}

export function useUserFavorites(page = 0, size = 20) {
    const [data, setData] = useState<FavoritesListResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchFavorites = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get<FavoritesListResponseDto>(
                `${API_ENDPOINTS.FAVORITES.USER_LIST}?page=${page}&size=${size}`
            );
            setData(res);
        } catch (err) {
            console.error('Failed to fetch favorites:', err);
        } finally {
            setIsLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    return {
        favorites: data?.items || [],
        total: data?.total || 0,
        isLoading,
        refetch: fetchFavorites,
    };
}
