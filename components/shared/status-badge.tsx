"use client";

import { cn } from "@/lib/utils";
import type { BookingStatus, SlotStatus } from "@/lib/constants";
import { STATUS_COLORS, SLOT_COLORS } from "@/lib/constants";

interface StatusBadgeProps {
  status: BookingStatus | SlotStatus | string;
  type?: "booking" | "slot";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusBadge({
  status,
  type = "booking",
  size = "md",
  className,
}: StatusBadgeProps) {
  const colors =
    type === "booking"
      ? STATUS_COLORS[status as BookingStatus]
      : SLOT_COLORS[status as SlotStatus];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        colors?.class || "",
        sizeClasses[size],
        className
      )}
    >
      {status}
    </span>
  );
}
