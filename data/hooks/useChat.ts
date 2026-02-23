import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import {
    ConversationResponseDto,
    ConversationsListResponseDto,
    MessageResponseDto,
    MessagesListResponseDto,
    SendMessageDto,
} from '../../domain/types';

export function useConversations(page = 0, size = 20) {
    const [data, setData] = useState<ConversationsListResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchConversations = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get<ConversationsListResponseDto>(
                `/conversations?page=${page}&size=${size}`
            );
            setData(res);
        } catch (err) {
            console.error('Failed to fetch conversations:', err);
        } finally {
            setIsLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    return {
        conversations: data?.items || [],
        total: data?.total || 0,
        isLoading,
        refetch: fetchConversations,
    };
}

export function useMessages(conversationId: string, page = 0, size = 50) {
    const [data, setData] = useState<MessagesListResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMessages = useCallback(async () => {
        if (!conversationId) return;
        setIsLoading(true);
        try {
            const res = await apiClient.get<MessagesListResponseDto>(
                `/conversations/${conversationId}/messages?page=${page}&size=${size}`
            );
            setData(res);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        } finally {
            setIsLoading(false);
        }
    }, [conversationId, page, size]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    return {
        messages: data?.items || [],
        total: data?.total || 0,
        isLoading,
        refetch: fetchMessages,
    };
}

export function useSendMessage() {
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async (conversationId: string, data: SendMessageDto) => {
        setIsLoading(true);
        try {
            return await apiClient.post<MessageResponseDto>(
                `/conversations/${conversationId}/messages`,
                data
            );
        } finally {
            setIsLoading(false);
        }
    };

    return { sendMessage, isLoading };
}

export function useStartBookingChat() {
    const [isLoading, setIsLoading] = useState(false);

    const startChat = async (bookingId: string) => {
        setIsLoading(true);
        try {
            return await apiClient.post<ConversationResponseDto>(
                `/conversations/booking/${bookingId}`
            );
        } finally {
            setIsLoading(false);
        }
    };

    return { startChat, isLoading };
}

export function useStartVenueInquiry() {
    const [isLoading, setIsLoading] = useState(false);

    const startInquiry = async (venueId: string) => {
        setIsLoading(true);
        try {
            return await apiClient.post<ConversationResponseDto>(
                `/conversations/venue/${venueId}/inquiry`
            );
        } finally {
            setIsLoading(false);
        }
    };

    return { startInquiry, isLoading };
}
