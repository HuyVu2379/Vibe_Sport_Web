import { apiClient, API_ENDPOINTS } from "@/lib/api";
import type { Venue, VenueSearchParams, VenueListResponse } from "./types";

export const venueService = {
  async searchVenues(params: VenueSearchParams): Promise<VenueListResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    return apiClient.get<VenueListResponse>(
      `${API_ENDPOINTS.VENUES.LIST}?${searchParams.toString()}`
    );
  },

  async getVenues(params?: VenueSearchParams): Promise<VenueListResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    return apiClient.get<VenueListResponse>(
      `${API_ENDPOINTS.VENUES.LIST}?${searchParams.toString()}`
    );
  },

  async getVenueById(id: string): Promise<Venue> {
    return apiClient.get<Venue>(API_ENDPOINTS.VENUES.DETAIL(id));
  },
};
