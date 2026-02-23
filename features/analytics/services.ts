import { apiClient, API_ENDPOINTS } from "@/lib/api";
import type { AnalyticsParams, AnalyticsResponse } from "./types";

export const analyticsService = {
  async getAnalytics(
    venueId: string,
    params: AnalyticsParams
  ): Promise<AnalyticsResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    return apiClient.get<AnalyticsResponse>(
      `${API_ENDPOINTS.OWNER.ANALYTICS(venueId)}?${searchParams.toString()}`
    );
  },
};
