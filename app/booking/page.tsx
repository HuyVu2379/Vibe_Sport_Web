"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlotGrid, SlotLegend } from "@/features/booking/components/slot-grid";
import { HoldHUD } from "@/features/booking/components/hold-hud";
import { DatePicker } from "@/features/booking/components/date-picker";
import { SlotGridSkeleton } from "@/components/shared/loading-skeleton";
import { ChevronLeft, MapPin, Clock, Info } from "lucide-react";
import { SLOT_STATUS } from "@/lib/constants";
import type { TimeSlot, Booking } from "@/features/booking/types";

import { useVenueDetail } from "@/data/hooks/useVenues";
import { useRealTimeSlots, useBookingActions } from "@/data/hooks/useBooking";
import { useAuth } from "@/data/hooks/useAuth";

function BookingContent() {
  const searchParams = useSearchParams();
  const venueId = searchParams.get("venue") || "1";
  const courtIdParam = searchParams.get("court");
  const { user } = useAuth();

  // 1. Fetch Venue Data
  const { venue } = useVenueDetail(venueId);
  const courts = venue?.courts || [];

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Default to first court if available
  const [selectedCourtId, setSelectedCourtId] = useState<string>("");

  // Sync selectedCourtId when courts load or param changes
  useState(() => {
    if (courtIdParam) setSelectedCourtId(courtIdParam);
  });

  // If courts loaded and no selection, select first
  if (courts.length > 0 && !selectedCourtId) {
    setSelectedCourtId(courts[0].courtId);
  }

  // 2. Fetch Slots (Real-time)
  const { slots: slotDtos, isLoading: isLoadingSlots, refetch: reloadSlots } = useRealTimeSlots(
    selectedCourtId,
    selectedDate,
    venueId
  );

  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [activeHold, setActiveHold] = useState<Booking | null>(null);

  const { createHold, confirmBooking, isProcessing: isConfirming } = useBookingActions();

  const selectedCourt = courts.find((c) => c.courtId === selectedCourtId);

  // Map Backend Slots to UI TimeSlot (using startTime as unique key)
  const slots: TimeSlot[] = slotDtos.map(s => ({
    courtId: selectedCourtId,
    date: selectedDate,
    startTime: s.startTime.substring(0, 5),
    endTime: s.endTime.substring(0, 5),
    status: s.isLocked ? (s.holderId === user?.userId ? SLOT_STATUS.HOLD : SLOT_STATUS.BOOKED) : SLOT_STATUS.AVAILABLE,
    price: s.price
  }));

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlots([]);
  };

  const handleCourtChange = (courtId: string) => {
    setSelectedCourtId(courtId);
    setSelectedSlots([]);
  };

  const handleSlotSelect = (slotStartTime: string) => {
    if (!selectedCourtId) return;

    setSelectedSlots((prev) => {
      if (prev.includes(slotStartTime)) {
        return prev.filter((t) => t !== slotStartTime);
      }
      // Only allow contiguous slot selection
      if (prev.length > 0) {
        const selectedSlotObjs = slots.filter((s) => prev.includes(s.startTime));
        const newSlot = slots.find((s) => s.startTime === slotStartTime);
        if (newSlot) {
          selectedSlotObjs.sort((a, b) => a.startTime.localeCompare(b.startTime));

          const lastSelected = selectedSlotObjs[selectedSlotObjs.length - 1];
          const firstSelected = selectedSlotObjs[0];

          const newIndex = slots.findIndex(s => s.startTime === slotStartTime);
          const firstIndex = slots.findIndex(s => s.startTime === firstSelected.startTime);
          const lastIndex = slots.findIndex(s => s.startTime === lastSelected.startTime);

          if (newIndex === lastIndex + 1 || newIndex === firstIndex - 1) {
            return [...prev, slotStartTime];
          }
        }
        return [slotStartTime]; // Start new selection
      }
      return [...prev, slotStartTime];
    });
  };

  const handleCreateHold = async () => {
    if (selectedSlots.length === 0 || !selectedCourt) return;

    const selectedSlotObjs = slots.filter((s) => selectedSlots.includes(s.startTime));
    selectedSlotObjs.sort((a, b) => a.startTime.localeCompare(b.startTime));

    const startTime = selectedSlotObjs[0].startTime;
    const endTime = selectedSlotObjs[selectedSlotObjs.length - 1].endTime;
    const totalPrice = selectedSlotObjs.reduce((sum, s) => sum + s.price, 0);

    try {
      const res = await createHold({
        courtId: selectedCourtId,
        startTime: `${selectedDate}T${startTime}:00`,
        endTime: `${selectedDate}T${endTime}:00`,
      });

      // Transform to UI Booking object for HoldHUD
      const bookingUI: Booking = {
        bookingId: res.bookingId,
        courtId: selectedCourtId,
        courtName: selectedCourt.name,
        venueName: venue?.name || "Venue",
        startTime,
        endTime,
        status: "HOLD",
        totalPrice: res.totalPrice,
        holdExpiresAt: res.holdExpiresAt,
        createdAt: new Date().toISOString(),
      };

      setActiveHold(bookingUI);
    } catch (err: any) {
      alert("Failed to hold slot: " + err.message);
    }
  };

  const handleConfirm = async () => {
    if (!activeHold) return;
    try {
      await confirmBooking(activeHold.bookingId, { note: "Booking via Web" });
      alert("Booking Confirmed!");
      setActiveHold(null);
      setSelectedSlots([]);
      reloadSlots();
    } catch (err: any) {
      alert("Confirmation failed: " + err.message);
    }
  };

  const handleCancelHold = () => {
    setActiveHold(null);
    setSelectedSlots([]);
    reloadSlots();
  };

  const selectedSlotObjs = slots.filter((s) => selectedSlots.includes(s.startTime));
  const totalPrice = selectedSlotObjs.reduce((sum, s) => sum + s.price, 0);

  // Policy values from venue
  const holdTTL = venue?.policy?.holdTtlMinutes || 15;
  const cancelBeforeHours = venue?.policy?.cancelBeforeHours || 24;

  return (
    <main className="min-h-screen bg-background pb-32">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" className="mb-4" asChild>
              <Link href={`/venues/${venueId}`}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Venue
              </Link>
            </Button>

            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Book a <span className="text-primary">Time Slot</span>
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{venue?.name || "Loading Venue..."}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Court Selection */}
              <GlassCard variant="elevated" className="p-6">
                <h2 className="font-semibold mb-4">Select Court</h2>
                <Select value={selectedCourtId} onValueChange={handleCourtChange}>
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="Select a court" />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    {courts.map((court) => (
                      <SelectItem key={court.courtId} value={court.courtId}>
                        {court.name} - ${court.minPricePerHour}/hr
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </GlassCard>

              {/* Date Selection */}
              <GlassCard variant="elevated" className="p-6">
                <h2 className="font-semibold mb-4">Select Date</h2>
                <DatePicker
                  selectedDate={selectedDate}
                  onDateSelect={handleDateChange}
                />
              </GlassCard>

              {/* Time Slots */}
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Available Time Slots</h2>
                  <SlotLegend />
                </div>

                {isLoadingSlots ? (
                  <SlotGridSkeleton />
                ) : (
                  <SlotGrid
                    slots={slots}
                    selectedSlots={selectedSlots}
                    onSlotSelect={handleSlotSelect}
                    disabled={!!activeHold}
                  />
                )}

                {/* Tip */}
                <div className="mt-4 pt-4 border-t border-border/50 flex items-start gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Click on available slots to select. You can select multiple
                    contiguous slots for longer sessions. Peak hours (5-9 PM)
                    have higher rates.
                  </span>
                </div>
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Summary */}
              <GlassCard
                variant="elevated"
                glow={selectedSlots.length > 0 ? "primary" : "none"}
                className="p-6 sticky top-24"
              >
                <h2 className="font-semibold text-lg mb-4">Booking Summary</h2>

                {selectedSlots.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Court</span>
                        <span className="font-medium">{selectedCourt?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">
                          {new Date(selectedDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">
                          {selectedSlotObjs.length > 0 && (
                            <>
                              {selectedSlotObjs.sort((a, b) =>
                                a.startTime.localeCompare(b.startTime)
                              )[0].startTime}
                              {" - "}
                              {selectedSlotObjs.sort((a, b) =>
                                b.endTime.localeCompare(a.endTime)
                              )[0].endTime}
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">
                          {selectedSlots.length} hour{selectedSlots.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-border/50 pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">${totalPrice}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full glow-primary"
                      size="lg"
                      onClick={handleCreateHold}
                      disabled={!!activeHold}
                    >
                      <Clock className="h-5 w-5 mr-2" />
                      Hold Slot ({holdTTL} min)
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Holding a slot reserves it for {holdTTL} minutes
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select time slots to see your booking summary</p>
                  </div>
                )}
              </GlassCard>

              {/* Policies */}
              {venue && (
                <GlassCard variant="subtle" className="p-6">
                  <h3 className="font-medium mb-3 text-sm">Booking Policies</h3>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li>• Hold expires in {holdTTL} minutes</li>
                    <li>
                      • Free cancellation up to {cancelBeforeHours}h before
                    </li>
                  </ul>
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hold HUD */}
      {activeHold && (
        <HoldHUD
          booking={activeHold}
          onConfirm={handleConfirm}
          onCancel={handleCancelHold}
          isConfirming={isConfirming}
        />
      )}

      <Footer />
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
