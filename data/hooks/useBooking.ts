import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../api/client';
import { socketService } from '../socket/socket';
import { storage } from '../storage';
import {
    AvailabilityResponseDto,
    CreateHoldDto,
    HoldResponseDto,
    ConfirmBookingDto,
    ConfirmResponseDto,
    SlotDto,
    CancelBookingDto,
    CancelResponseDto,
    BookingsListResponseDto
} from '../../domain/types';

// Extended Slot type for UI
export interface EISlot extends SlotDto {
    isLocked?: boolean;
    holderId?: string;
}

export function useRealTimeSlots(courtId: string | null, date: string, venueId: string | null) {
    const [slots, setSlots] = useState<EISlot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSlots = useCallback(async () => {
        if (!courtId || !date) return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get<AvailabilityResponseDto>(
                `/courts/${courtId}/availability?date=${date}`
            );
            setSlots(res.slots.map(s => ({ ...s, isLocked: s.status === 'UNAVAILABLE' })));
        } catch (err: any) {
            console.error('Fetch slots error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [courtId, date]);

    // Initial fetch
    useEffect(() => {
        fetchSlots();
    }, [fetchSlots]);

    // Socket Integration
    useEffect(() => {
        if (!venueId) return;

        socketService.connect();
        socketService.joinVenue(venueId);

        const handleSlotLocked = (payload: any) => {
            // payload: { courtId, startTime, endTime, holderId }
            if (payload.courtId !== courtId) return;

            setSlots(prev => prev.map(slot => {
                if (slot.startTime === payload.startTime) {
                    return { ...slot, status: 'UNAVAILABLE', isLocked: true, holderId: payload.holderId };
                }
                return slot;
            }));
        };

        const handleSlotReleased = (payload: any) => {
            if (payload.courtId !== courtId) return;
            setSlots(prev => prev.map(slot => {
                if (slot.startTime === payload.startTime) {
                    return { ...slot, status: 'AVAILABLE', isLocked: false, holderId: undefined };
                }
                return slot;
            }));
        };

        const handleSlotUpdated = (payload: any) => {
            if (payload.courtId !== courtId) return;
            setSlots(prev => prev.map(slot => {
                if (slot.startTime === payload.startTime) {
                    return { ...slot, status: 'UNAVAILABLE', isLocked: true }; // Confirmed
                }
                return slot;
            }));
        };

        socketService.on('slot.locked', handleSlotLocked);
        socketService.on('slot.released', handleSlotReleased);
        socketService.on('slot.updated', handleSlotUpdated);

        return () => {
            socketService.off('slot.locked', handleSlotLocked);
            socketService.off('slot.released', handleSlotReleased);
            socketService.off('slot.updated', handleSlotUpdated);
            socketService.leaveVenue(venueId);
        };
    }, [venueId, courtId]);

    return { slots, isLoading, error, refetch: fetchSlots };
}

export function useBookingActions() {
    const [isProcessing, setIsProcessing] = useState(false);

    const createHold = async (data: CreateHoldDto) => {
        setIsProcessing(true);
        try {
            return await apiClient.post<HoldResponseDto>('/bookings/hold', data);
        } finally {
            setIsProcessing(false);
        }
    };

    const confirmBooking = async (bookingId: string, data: ConfirmBookingDto = {}) => {
        setIsProcessing(true);
        try {
            return await apiClient.post<ConfirmResponseDto>(`/bookings/${bookingId}/confirm`, data);
        } finally {
            setIsProcessing(false);
        }
    };

    const cancelBooking = async (bookingId: string, data: CancelBookingDto) => {
        setIsProcessing(true);
        try {
            return await apiClient.post<CancelResponseDto>(`/bookings/${bookingId}/cancel`, data);
        } finally {
            setIsProcessing(false);
        }
    };

    return { createHold, confirmBooking, cancelBooking, isProcessing };
}

export function useMyBookings(params: any = {}) {
    const [data, setData] = useState<BookingsListResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchBookings = useCallback(async () => {
        setIsLoading(true);
        try {
            const query = new URLSearchParams();
            if (params.status && params.status !== 'all') query.append('status', params.status);

            const res = await apiClient.get<BookingsListResponseDto>(`/me/bookings?${query.toString()}`);
            setData(res);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [params.status]); // Add other dependencies as needed

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    return { bookings: data?.items || [], isLoading, refetch: fetchBookings };
}
