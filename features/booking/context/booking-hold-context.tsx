"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Booking } from "../types";

interface BookingHoldContextValue {
  activeHold: Booking | null;
  setActiveHold: (booking: Booking | null) => void;
  clearHold: () => void;
  onConfirmHold: (() => Promise<{ paymentUrl?: string } | void>) | null;
  setOnConfirmHold: (fn: (() => Promise<{ paymentUrl?: string } | void>) | null) => void;
  isConfirming: boolean;
  setIsConfirming: (v: boolean) => void;
  /** venueId dùng để navigate về trang booking khi bấm mini pill */
  bookingVenueId: string | null;
  setBookingVenueId: (id: string | null) => void;
}

const BookingHoldContext = createContext<BookingHoldContextValue | null>(null);

export function BookingHoldProvider({ children }: { children: ReactNode }) {
  const [activeHold, setActiveHoldState] = useState<Booking | null>(null);
  const [onConfirmHold, setOnConfirmHoldState] = useState<
    (() => Promise<{ paymentUrl?: string } | void>) | null
  >(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [bookingVenueId, setBookingVenueId] = useState<string | null>(null);

  const setActiveHold = useCallback((booking: Booking | null) => {
    setActiveHoldState(booking);
  }, []);

  const clearHold = useCallback(() => {
    setActiveHoldState(null);
    setOnConfirmHoldState(null);
    setIsConfirming(false);
    setBookingVenueId(null);
  }, []);

  // Wrapper to allow storing a function in state (React requires functional update pattern)
  const setOnConfirmHold = useCallback(
    (fn: (() => Promise<{ paymentUrl?: string } | void>) | null) => {
      setOnConfirmHoldState(() => fn);
    },
    []
  );

  return (
    <BookingHoldContext.Provider
      value={{
        activeHold,
        setActiveHold,
        clearHold,
        onConfirmHold,
        setOnConfirmHold,
        isConfirming,
        setIsConfirming,
        bookingVenueId,
        setBookingVenueId,
      }}
    >
      {children}
    </BookingHoldContext.Provider>
  );
}

export function useBookingHold() {
  const ctx = useContext(BookingHoldContext);
  if (!ctx) {
    throw new Error("useBookingHold must be used within BookingHoldProvider");
  }
  return ctx;
}
