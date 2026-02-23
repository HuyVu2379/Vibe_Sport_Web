import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import {
    SearchVenuesQueryDto,
    VenueListResponseDto,
    VenueDetailResponseDto
} from '../../domain/types';

export function useVenues() {
    const [data, setData] = useState<VenueListResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchVenues = useCallback(async (params: SearchVenuesQueryDto = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            const query = new URLSearchParams();
            if (params.q) query.append('q', params.q);
            if (params.sportType && params.sportType !== 'all') query.append('sportType', params.sportType);
            if (params.lat) query.append('lat', params.lat.toString());
            if (params.lng) query.append('lng', params.lng.toString());
            if (params.radiusKm) query.append('radiusKm', params.radiusKm.toString());
            if (params.page !== undefined) query.append('page', params.page.toString());
            if (params.size !== undefined) query.append('size', params.size.toString());

            const response = await apiClient.get<VenueListResponseDto>(`/venues?${query.toString()}`);
            setData(response);
        } catch (err: any) {
            console.error('Search venues error:', err);
            setError(err.message || 'Failed to load venues');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { venues: data?.items || [], total: data?.total || 0, isLoading, error, searchVenues };
}

export function useVenueDetail(venueId: string) {
    const [venue, setVenue] = useState<VenueDetailResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start loading immediately
    const [error, setError] = useState<string | null>(null);

    const fetchVenue = useCallback(async () => {
        if (!venueId) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<VenueDetailResponseDto>(`/venues/${venueId}`);
            setVenue(response);
        } catch (err: any) {
            console.error('Get venue detail error:', err);
            setError(err.message || 'Failed to load venue details');
        } finally {
            setIsLoading(false);
        }
    }, [venueId]);

    useEffect(() => {
        fetchVenue();
    }, [fetchVenue]);

    return { venue, isLoading, error, refetch: fetchVenue };
}
