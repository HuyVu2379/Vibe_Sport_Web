import { z } from "zod";

export const createHoldSchema = z.object({
  courtId: z.string().min(1, "Court is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
});

export const bookingSearchSchema = z.object({
  status: z.enum(["HOLD", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().positive().optional(),
  limit: z.number().positive().max(100).optional(),
});

export type CreateHoldFormData = z.infer<typeof createHoldSchema>;
export type BookingSearchFormData = z.infer<typeof bookingSearchSchema>;
