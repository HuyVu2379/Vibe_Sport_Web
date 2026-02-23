// API Configuration and base utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // For JWT cookies
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: "An error occurred",
        statusCode: response.status,
      }));
      throw error;
    }

    return response.json();
  }

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  // Users
  USERS: {
    PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
    FORGOT_PASSWORD_REQUEST: "/users/forgot-password/request",
    FORGOT_PASSWORD_VERIFY: "/users/forgot-password/verify",
    LOGOUT: "/users/logout",
  },
  // Venues
  VENUES: {
    LIST: "/venues",
    DETAIL: (id: string) => `/venues/${id}`,
  },
  // Courts
  COURTS: {
    AVAILABILITY: (courtId: string, date: string) =>
      `/courts/${courtId}/availability?date=${date}`,
  },
  // Bookings (Customer)
  BOOKINGS: {
    LIST: "/me/bookings",
    CREATE_HOLD: "/bookings/hold",
    CONFIRM: (id: string) => `/bookings/${id}/confirm`,
    CANCEL: (id: string) => `/bookings/${id}/cancel`,
  },
  // Reviews
  REVIEWS: {
    CREATE: (bookingId: string) => `/bookings/${bookingId}/review`,
    VENUE_LIST: (venueId: string) => `/venues/${venueId}/reviews`,
    REPLY: (reviewId: string) => `/reviews/${reviewId}/reply`,
    DETAIL: (reviewId: string) => `/reviews/${reviewId}`,
  },
  // Chat
  CHAT: {
    CONVERSATIONS: "/conversations",
    CONVERSATION_DETAIL: (id: string) => `/conversations/${id}`,
    MESSAGES: (id: string) => `/conversations/${id}/messages`,
    START_BOOKING_CHAT: (bookingId: string) =>
      `/conversations/booking/${bookingId}`,
    START_VENUE_INQUIRY: (venueId: string) =>
      `/conversations/venue/${venueId}/inquiry`,
  },
  // Favorites
  FAVORITES: {
    ADD: (venueId: string) => `/venues/${venueId}/favorite`,
    REMOVE: (venueId: string) => `/venues/${venueId}/favorite`,
    TOGGLE: (venueId: string) => `/venues/${venueId}/favorite/toggle`,
    STATUS: (venueId: string) => `/venues/${venueId}/favorite/status`,
    USER_LIST: "/favorites",
  },
  // Upload
  UPLOAD: {
    IMAGE: "/upload/image",
    IMAGES: "/upload/images",
    VIDEO: "/upload/video",
    FILE: "/upload/file",
    DELETE: "/upload",
  },
  // Owner
  OWNER: {
    ANALYTICS: (venueId: string) => `/owner/analytics/${venueId}`,
    BOOKINGS: "/owner/bookings",
    CANCEL_BOOKING: (bookingId: string) =>
      `/owner/bookings/${bookingId}/cancel`,
  },
} as const;
