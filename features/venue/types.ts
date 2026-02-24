import type { DepositType, SportType } from "@/lib/constants";

export interface Venue {
  venueId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  about?: string;
  imageUrl: string;
  sportTypes: SportType[];
  ratingAvg: number;
  totalReviews: number;
  totalCourts: number;
  minPricePerHour: number;
  distanceKm: number;
}

export interface VenueAmenity {
  name: string;
  icon?: string;
}

export interface VenueContact {
  phone?: string;
  email?: string;
}

export interface VenuePolicy {
  holdTtlMinutes: number;
  cancelBeforeHours: number;
  depositType: DepositType;
  depositPercent?: number;
}

export interface OperatingHours {
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface Court {
  courtId: string;
  name: string;
  sportType: SportType;
  minPricePerHour?: number;
  imageUrls?: string[];
}

export interface VenueSearchParams {
  q?: string;
  sportType?: SportType;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
}

export interface VenueListItem {
  venueId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  sportTypes: SportType[];
  totalCourts: number;
  totalReviews: number;
  ratingAvg: number;
  minPricePerHour: number;
  imageUrl?: string;
}

export interface VenueListResponse {
  items: VenueListItem[];
  page: number;
  size: number;
  total: number;
}
