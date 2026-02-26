"use client";

import { cn, formatCurrency } from "@/lib/utils";
import { SLOT_STATUS, SLOT_COLORS } from "@/lib/constants";
import type { TimeSlot } from "../types";

interface SlotGridProps {
  slots: TimeSlot[];
  selectedSlots: string[];
  onSlotSelect: (slotId: string) => void;
  disabled?: boolean;
}

export function SlotGrid({
  slots,
  selectedSlots,
  onSlotSelect,
  disabled = false,
}: SlotGridProps) {
  const getSlotClasses = (slot: TimeSlot) => {
    const isSelected = selectedSlots.includes(slot.startTime);
    const colors = SLOT_COLORS[slot.status];
    const isAvailable = slot.status === SLOT_STATUS.AVAILABLE;

    return cn(
      "relative p-3 rounded-lg border text-center transition-all duration-200",
      "flex flex-col items-center justify-center min-h-[60px]",
      colors.bg,
      colors.text,
      colors.border,
      isAvailable && !disabled && colors.hover,
      isAvailable && !disabled && "cursor-pointer",
      !isAvailable && "opacity-60 cursor-not-allowed",
      isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      disabled && "pointer-events-none opacity-50"
    );
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    const vnHours = (date.getUTCHours() + 7) % 24;
    const minutes = date.getUTCMinutes();
    return `${String(vnHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };



  return (
    <div
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2"
      role="grid"
      aria-label="Available time slots"
    >
      {slots.map((slot) => {
        const isAvailable = slot.status === SLOT_STATUS.AVAILABLE;
        const isSelected = selectedSlots.includes(slot.startTime);

        return (
          <button
            key={slot.startTime}
            type="button"
            className={getSlotClasses(slot)}
            onClick={() => isAvailable && onSlotSelect(slot.startTime)}
            disabled={!isAvailable || disabled}
            aria-pressed={isSelected}
            aria-label={`${formatTime(slot.startTime)} - ${slot.status}${isSelected ? ", selected" : ""}`}
          >
            <span className="text-sm font-medium">{formatTime(slot.startTime)}</span>
            <span className="text-xs opacity-75">{formatCurrency(slot.price)}</span>
            {slot.status === SLOT_STATUS.HOLD && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-status-hold animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// Legend component
export function SlotLegend() {
  const statuses = [
    { status: SLOT_STATUS.AVAILABLE, label: "Available" },
    { status: SLOT_STATUS.HOLD, label: "On Hold" },
    { status: SLOT_STATUS.BOOKED, label: "Booked" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      {statuses.map(({ status, label }) => {
        const colors = SLOT_COLORS[status];
        return (
          <div key={status} className="flex items-center gap-2">
            <div
              className={cn(
                "w-4 h-4 rounded border",
                colors.bg,
                colors.border
              )}
            />
            <span className="text-muted-foreground">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
