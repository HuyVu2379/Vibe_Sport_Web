import { useState, useEffect, useCallback } from 'react';
import { apiClient, API_ENDPOINTS } from '../api/client';
import {
    CreateReviewDto,
    ReplyDto,
    ReviewResponseDto,
    VenueReviewsResponseDto,
} from '../../domain/types';

export function useVenueReviews(venueId: string, page = 0, size = 10) {
    const [data, setData] = useState<VenueReviewsResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = useCallback(async () => {
        if (!venueId) return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get<VenueReviewsResponseDto>(
                `${API_ENDPOINTS.REVIEWS.VENUE_LIST(venueId)}?page=${page}&size=${size}`
            );
            setData(res);
        } catch (err: any) {
            setError(err.message || 'Failed to load reviews');
        } finally {
            setIsLoading(false);
        }
    }, [venueId, page, size]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    return {
        reviews: data?.items || [],
        total: data?.total || 0,
        averageRating: data?.averageRating || 0,
        isLoading,
        error,
        refetch: fetchReviews,
    };
}

export function useCreateReview() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createReview = async (bookingId: string, data: CreateReviewDto) => {
        setIsLoading(true);
        setError(null);
        try {
            return await apiClient.post<ReviewResponseDto>(
                API_ENDPOINTS.REVIEWS.CREATE(bookingId),
                data
            );
        } catch (err: any) {
            setError(err.message || 'Failed to submit review');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createReview, isLoading, error };
}

export function useAddReply() {
    const [isLoading, setIsLoading] = useState(false);

    const addReply = async (reviewId: string, data: ReplyDto) => {
        setIsLoading(true);
        try {
            return await apiClient.post<ReviewResponseDto>(
                API_ENDPOINTS.REVIEWS.REPLY(reviewId),
                data
            );
        } finally {
            setIsLoading(false);
        }
    };

    return { addReply, isLoading };
}
