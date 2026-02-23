import { io, Socket } from 'socket.io-client';
import { storage } from '../storage';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

// ============================================
// APP GATEWAY (namespace: /)
// ============================================

class SocketService {
    private socket: Socket | null = null;

    connect() {
        if (this.socket?.connected) return;

        const token = storage.getToken();
        if (!token) {
            console.warn('Cannot connect to socket: No token found');
            return;
        }

        this.socket = io(SOCKET_URL, {
            query: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket?.id);
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        this.socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    on(event: string, callback: (...args: any[]) => void) {
        this.socket?.on(event, callback);
    }

    off(event: string, callback?: (...args: any[]) => void) {
        this.socket?.off(event, callback);
    }

    emit(event: string, ...args: any[]) {
        this.socket?.emit(event, ...args);
    }

    // Venue room actions
    joinVenue(venueId: string) {
        this.emit('join_venue', venueId);
    }

    leaveVenue(venueId: string) {
        this.emit('leave_venue', venueId);
    }
}

// ============================================
// CHAT GATEWAY (namespace: /chat)
// ============================================

class ChatSocketService {
    private socket: Socket | null = null;

    connect() {
        if (this.socket?.connected) return;

        this.socket = io(`${SOCKET_URL}/chat`, {
            transports: ['websocket', 'polling'],
            reconnection: true,
        });

        this.socket.on('connect', () => {
            console.log('Chat socket connected:', this.socket?.id);
        });

        this.socket.on('disconnect', () => {
            console.log('Chat socket disconnected');
        });

        this.socket.on('connect_error', (err) => {
            console.error('Chat socket connection error:', err);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Room management
    joinConversation(conversationId: string, userId: string) {
        this.socket?.emit('join_conversation', { conversationId, userId });
    }

    leaveConversation(conversationId: string) {
        this.socket?.emit('leave_conversation', { conversationId });
    }

    // Messaging
    sendMessage(conversationId: string, userId: string, content: string) {
        this.socket?.emit('send_message', { conversationId, userId, content });
    }

    // Typing indicator
    emitTyping(conversationId: string, userId: string, isTyping: boolean) {
        this.socket?.emit('typing', { conversationId, userId, isTyping });
    }

    // Event listeners
    onNewMessage(callback: (data: { conversationId: string; message: any }) => void) {
        this.socket?.on('new_message', callback);
    }

    offNewMessage(callback?: (...args: any[]) => void) {
        this.socket?.off('new_message', callback);
    }

    onUserTyping(callback: (data: { userId: string; isTyping: boolean }) => void) {
        this.socket?.on('user_typing', callback);
    }

    offUserTyping(callback?: (...args: any[]) => void) {
        this.socket?.off('user_typing', callback);
    }

    // Generic
    on(event: string, callback: (...args: any[]) => void) {
        this.socket?.on(event, callback);
    }

    off(event: string, callback?: (...args: any[]) => void) {
        this.socket?.off(event, callback);
    }
}

export const socketService = new SocketService();
export const chatSocketService = new ChatSocketService();
