import type { BookingStatus, SlotStatus } from "@/lib/constants";
import type { Court, Venue } from "@/features/venue/types";
import type { User } from "@/features/auth/types";

export interface TimeSlot {
  startTime: string;
  endTime: string;
  status: SlotStatus;
  price: number;
}

export interface Booking {
  bookingId: string;
  status: BookingStatus;
  courtId: string;
  courtName?: string;
  venueName?: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  createdAt: string;
  holdExpiresAt?: string;
  holdTTLMinutes?: number;
}

export interface CreateHoldInput {
  courtId: string;
  startTime: string;
  endTime: string;
}

export interface CreateHoldOutput {
  bookingId: string;
  status: "HOLD";
  holdExpiresAt: string;
  totalPrice: number;
}

export interface ConfirmBookingInput {
  note?: string;
}

export interface ConfirmBookingOutput {
  bookingId: string;
  status: "CONFIRMED";
  courtId: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
}

export interface CancelBookingInput {
  reason: string;
}

export interface CancelBookingOutput {
  bookingId: string;
  status: "CANCELLED_BY_USER" | "CANCELLED_BY_OWNER";
}

export interface BookingListParams {
  status?: BookingStatus;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}

export interface BookingListResponse {
  items: Booking[];
  page: number;
  size: number;
  total: number;
}

// WebSocket events
export interface SlotUpdateEvent {
  courtId: string;
  startTime: string;
  endTime: string;
}
