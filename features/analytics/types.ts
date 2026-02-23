export interface AnalyticsSummary {
  totalRevenue: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

export interface AnalyticsParams {
  from: string;
  to: string;
  venueId: string;
}

export interface AnalyticsResponse {
  totalRevenue: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType =
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "BOOKING_REMINDER"
  | "HOLD_EXPIRING"
  | "PAYMENT_RECEIVED"
  | "VENUE_UPDATE";
