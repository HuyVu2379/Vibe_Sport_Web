import { apiClient, API_ENDPOINTS } from "@/lib/api";
import type {
  Booking,
  TimeSlot,
  CreateHoldInput,
  CreateHoldOutput,
  ConfirmBookingOutput,
  BookingListParams,
  BookingListResponse,
} from "./types";

export const bookingService = {
  async getSlots(courtId: string, date: string): Promise<TimeSlot[]> {
    return apiClient.get<TimeSlot[]>(
      API_ENDPOINTS.COURTS.AVAILABILITY(courtId, date)
    );
  },

  async createHold(input: CreateHoldInput): Promise<CreateHoldOutput> {
    return apiClient.post<CreateHoldOutput>(
      API_ENDPOINTS.BOOKINGS.CREATE_HOLD,
      input
    );
  },

  async confirmBooking(bookingId: string): Promise<ConfirmBookingOutput> {
    return apiClient.post<ConfirmBookingOutput>(
      API_ENDPOINTS.BOOKINGS.CONFIRM(bookingId)
    );
  },

  async cancelBooking(bookingId: string): Promise<Booking> {
    return apiClient.post<Booking>(API_ENDPOINTS.BOOKINGS.CANCEL(bookingId));
  },

  async getBookings(params?: BookingListParams): Promise<BookingListResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return apiClient.get<BookingListResponse>(
      `${API_ENDPOINTS.BOOKINGS.LIST}?${searchParams.toString()}`
    );
  },
};
