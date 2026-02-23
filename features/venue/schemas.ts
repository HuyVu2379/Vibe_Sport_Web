import { z } from "zod";

export const venueSearchSchema = z.object({
  query: z.string().optional(),
  sportType: z.string().optional(),
  date: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radius: z.number().positive().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().positive().optional(),
  page: z.number().positive().optional(),
  limit: z.number().positive().max(50).optional(),
});

export const venuePolicySchema = z.object({
  holdTTL: z.number().min(1).max(60),
  cancelBeforeHours: z.number().min(0).max(72),
  depositType: z.enum(["NONE", "PERCENTAGE", "FULL"]),
  depositPercentage: z.number().min(0).max(100).optional(),
});

export const operatingHoursSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  openTime: z.string().regex(/^\d{2}:\d{2}$/),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/),
  isOpen: z.boolean(),
});

export const courtSchema = z.object({
  name: z.string().min(1, "Court name is required"),
  description: z.string().optional(),
  sportType: z.string().min(1, "Sport type is required"),
  pricePerHour: z.number().positive("Price must be positive"),
  peakPricePerHour: z.number().positive().optional(),
});

export type VenueSearchFormData = z.infer<typeof venueSearchSchema>;
export type VenuePolicyFormData = z.infer<typeof venuePolicySchema>;
export type OperatingHoursFormData = z.infer<typeof operatingHoursSchema>;
export type CourtFormData = z.infer<typeof courtSchema>;
