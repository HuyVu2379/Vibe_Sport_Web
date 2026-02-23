import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import {
    VenueAnalyticsResponseDto,
    OwnerBookingsListResponseDto,
    CancelResponseDto,
    OwnerCancelBookingDto
} from '../../domain/types';

export function useOwnerAnalytics(venueId: string, from: string, to: string) {
    const [analytics, setAnalytics] = useState<VenueAnalyticsResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!venueId || !from || !to) return;

        const fetchAnalytics = async () => {
            setIsLoading(true);
            try {
                const res = await apiClient.get<VenueAnalyticsResponseDto>(
                    `/owner/analytics/${venueId}?from=${from}&to=${to}`
                );
                setAnalytics(res);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [venueId, from, to]);

    return { analytics, isLoading };
}

export function useOwnerBookings(params: any = {}) {
    const [data, setData] = useState<OwnerBookingsListResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchBookings = useCallback(async () => {
        setIsLoading(true);
        try {
            const query = new URLSearchParams(params).toString();
            const res = await apiClient.get<OwnerBookingsListResponseDto>(`/owner/bookings?${query}`);
            setData(res);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [JSON.stringify(params)]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    return { bookings: data?.items || [], isLoading, refetch: fetchBookings };
}

export function useOwnerActions() {
    const cancelBooking = async (bookingId: string, data: OwnerCancelBookingDto) => {
        return apiClient.post<CancelResponseDto>(`/owner/bookings/${bookingId}/cancel`, data);
    };

    return { cancelBooking };
}
