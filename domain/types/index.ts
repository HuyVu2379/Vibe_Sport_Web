// ============================================
// COMMON
// ============================================

export type Role = 'CUSTOMER' | 'OWNER' | 'ADMIN' | 'STAFF';
export type BookingStatus = 'HOLD' | 'CONFIRMED' | 'CANCELLED_BY_USER' | 'CANCELLED_BY_OWNER' | 'EXPIRED' | 'COMPLETED';
export type SlotStatus = 'AVAILABLE' | 'UNAVAILABLE';
export type ConversationType = 'BOOKING' | 'VENUE_INQUIRY' | 'GENERAL';
export type MessageType = 'TEXT' | 'IMAGE' | 'SYSTEM';

export interface User {
    userId: string;
    role: Role;
    fullName?: string;
    phone?: string;
    email?: string;
    avatarUrl?: string;
}

// ============================================
// AUTH
// ============================================

export interface LoginDto {
    phoneOrEmail: string;
    otpOrPassword: string;
}

export interface LoginResponseDto {
    token: string;
    user: User;
}

export interface RegisterDto {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}

export interface RegisterResponseDto {
    token: string;
    user: User;
}

// ============================================
// USERS
// ============================================

export interface UpdateProfileDto {
    fullName?: string;
    avatarUrl?: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export interface ForgotPasswordRequestDto {
    emailOrPhone: string;
}

export interface ForgotPasswordVerifyDto {
    emailOrPhone: string;
    otp: string;
    newPassword: string;
}

export interface SuccessResponseDto {
    success: boolean;
    message: string;
}

// ============================================
// VENUES
// ============================================

export interface SearchVenuesQueryDto {
    lat?: number;
    lng?: number;
    radiusKm?: number;
    sportType?: string;
    q?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
}

export interface VenueListItemDto {
    venueId: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    distanceKm?: number;
    sportTypes: string[];
    totalCourts: number;
    totalReviews: number;
    ratingAvg: number;
    minPricePerHour: number;
    imageUrl?: string;
}

export interface VenueListResponseDto {
    items: VenueListItemDto[];
    page: number;
    size: number;
    total: number;
}

export interface AmenityDto {
    name: string;
    icon?: string;
}

export interface OpenHourDto {
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
}

export interface ContactDto {
    phone?: string;
    email?: string;
}

export interface PolicyDto {
    holdTTLMinutes: number;
    depositType: string;
    refundRule: string;
    depositPercentage: number;
    cancelBeforeHours: number;
}

export interface CourtItemDto {
    courtId: string;
    name: string;
    sportType: string;
    minPricePerHour?: number;
    imageUrls?: string[];
}

export interface ReviewItemDto {
    reviewId: string;
    userId: string;
    userFullName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface VenueDetailResponseDto {
    venueId: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    about?: string;
    imageUrls: string[];
    sportTypes: string[];
    amenities: AmenityDto[];
    openHours: OpenHourDto[];
    contact: ContactDto;
    policy: PolicyDto;
    ratingAvg: number;
    totalReviews: number;
    courts: CourtItemDto[];
}

// ============================================
// AVAILABILITY
// ============================================

export interface SlotDto {
    startTime: string;
    endTime: string;
    status: SlotStatus;
    price: number;
}

export interface AvailabilityResponseDto {
    courtId: string;
    date: string;
    slots: SlotDto[];
}

// ============================================
// BOOKINGS (Customer)
// ============================================

export interface CreateHoldDto {
    courtId: string;
    startTime: string;
    endTime: string;
}

export interface HoldResponseDto {
    bookingId: string;
    status: 'HOLD';
    holdExpiresAt: string;
    totalPrice: number;
}

export interface ConfirmBookingDto {
    note?: string;
}

export interface ConfirmResponseDto {
    bookingId: string;
    status: 'CONFIRMED';
    courtId: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
}

export interface CancelBookingDto {
    reason: string;
}

export interface CancelResponseDto {
    bookingId: string;
    status: 'CANCELLED_BY_USER' | 'CANCELLED_BY_OWNER';
}

export interface BookingItemDto {
    bookingId: string;
    status: BookingStatus;
    courtId: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    createdAt: string;
    venueName?: string;
    courtName?: string;
}

export interface BookingsListResponseDto {
    items: BookingItemDto[];
    page: number;
    size: number;
    total: number;
}

// ============================================
// OWNER
// ============================================

export interface OwnerBookingItemDto {
    bookingId: string;
    status: BookingStatus;
    courtId: string;
    courtName?: string;
    venueName?: string;
    startTime: string;
    endTime: string;
    totalPrice?: number;
    customer: {
        userId: string;
        fullName: string;
        phone: string;
    };
}

export interface OwnerBookingsListResponseDto {
    items: OwnerBookingItemDto[];
    page: number;
    size: number;
    total: number;
}

export interface OwnerCancelBookingDto {
    reason: string;
}

export interface VenueAnalyticsResponseDto {
    totalRevenue: number;
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
}

// ============================================
// REVIEWS
// ============================================

export interface CreateReviewDto {
    rating: number;
    comment: string;
}

export interface ReplyDto {
    comment: string;
}

export interface ReviewUserDto {
    userId: string;
    fullName: string;
    avatarUrl?: string;
}

export interface ReviewResponseDto {
    reviewId: string;
    bookingId: string;
    venueId: string;
    rating: number;
    comment: string;
    reply?: string;
    repliedAt?: string;
    createdAt: string;
    user: ReviewUserDto;
}

export interface VenueReviewsResponseDto {
    items: ReviewResponseDto[];
    page: number;
    size: number;
    total: number;
    averageRating: number;
}

// ============================================
// CHAT
// ============================================

export interface SendMessageDto {
    content: string;
}

export interface MessageResponseDto {
    messageId: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    content: string;
    type: MessageType;
    createdAt: string;
}

export interface ConversationResponseDto {
    conversationId: string;
    type: ConversationType;
    venueId: string;
    venueName: string;
    participants: {
        userId: string;
        fullName: string;
        avatarUrl?: string;
    }[];
    lastMessage?: MessageResponseDto;
    createdAt: string;
    updatedAt: string;
}

export interface ConversationsListResponseDto {
    items: ConversationResponseDto[];
    page: number;
    size: number;
    total: number;
}

export interface MessagesListResponseDto {
    items: MessageResponseDto[];
    page: number;
    size: number;
    total: number;
}

// ============================================
// FAVORITES
// ============================================

export interface FavoriteStatusResponseDto {
    isFavorite: boolean;
}

export interface ToggleFavoriteResponseDto {
    isFavorite: boolean;
}

export interface FavoritesListResponseDto {
    items: VenueListItemDto[];
    page: number;
    size: number;
    total: number;
}

// ============================================
// UPLOAD
// ============================================

export interface UploadResultDto {
    url: string;
    publicId: string;
}
