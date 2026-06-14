"use client";

import { useBookingHold } from "@/features/booking/context/booking-hold-context";
import { HoldHUD } from "@/features/booking/components/hold-hud";

/**
 * Renders the HoldHUD globally at the root layout level.
 * When on the booking page → full HUD.
 * When on any other page → minimized pill that expands on hover / click to go back.
 */
export function GlobalHoldHUD() {
  const { activeHold, clearHold, onConfirmHold, isConfirming, bookingVenueId } = useBookingHold();

  if (!activeHold) return null;

  const handleConfirm = async () => {
    if (onConfirmHold) {
      return await onConfirmHold();
    }
  };

  const bookingUrl = bookingVenueId
    ? `/booking?venue=${bookingVenueId}`
    : "/booking";

  return (
    <HoldHUD
      booking={activeHold}
      onConfirm={handleConfirm}
      onCancel={clearHold}
      isConfirming={isConfirming}
      bookingUrl={bookingUrl}
    />
  );
}
