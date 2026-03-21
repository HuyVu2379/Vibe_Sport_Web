"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { BookingCard } from "@/features/booking/components/booking-card";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { BOOKING_STATUS } from "@/lib/constants";
import type { Booking } from "@/features/booking/types";

import { useMyBookings, useBookingActions } from "@/data/hooks/useBooking";
import { useAuth } from "@/data/hooks/useAuth";

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { user } = useAuth();

  // Fetch all to compute counts locally
  const { bookings, isLoading, refetch } = useMyBookings({ status: undefined, size: 100 });
  const { cancelBooking } = useBookingActions();

  // Cast to UI Booking type (backend DTO already matches)
  const mappedBookings = bookings as unknown as Booking[];

  const filterBookings = (status?: string) => {
    if (!status || status === "all") return mappedBookings;
    return mappedBookings.filter((b) => b.status === status);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel?")) {
      try {
        await cancelBooking(bookingId, { reason: "User cancelled" });
        refetch();
      } catch (error) {
        alert("Failed to cancel booking");
      }
    }
  };

  const tabCounts = {
    all: mappedBookings.length,
    [BOOKING_STATUS.HOLD]: mappedBookings.filter(
      (b) => b.status === BOOKING_STATUS.HOLD
    ).length,
    [BOOKING_STATUS.CONFIRMED]: mappedBookings.filter(
      (b) => b.status === BOOKING_STATUS.CONFIRMED
    ).length,
    [BOOKING_STATUS.COMPLETED]: mappedBookings.filter(
      (b) => b.status === BOOKING_STATUS.COMPLETED
    ).length,
    [BOOKING_STATUS.CANCELLED]: mappedBookings.filter(
      (b) => b.status === BOOKING_STATUS.CANCELLED
    ).length,
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                My <span className="text-primary">Bookings</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your sports field bookings
              </p>
            </div>
            <Button asChild>
              <Link href="/venues">
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Link>
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full glass mb-6 flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="all" className="flex-1 min-w-[80px]">
                All ({tabCounts.all})
              </TabsTrigger>
              <TabsTrigger value={BOOKING_STATUS.HOLD} className="flex-1 min-w-[80px]">
                Hold ({tabCounts[BOOKING_STATUS.HOLD]})
              </TabsTrigger>
              <TabsTrigger value={BOOKING_STATUS.CONFIRMED} className="flex-1 min-w-[80px]">
                Confirmed ({tabCounts[BOOKING_STATUS.CONFIRMED]})
              </TabsTrigger>
              <TabsTrigger value={BOOKING_STATUS.COMPLETED} className="flex-1 min-w-[80px]">
                Completed ({tabCounts[BOOKING_STATUS.COMPLETED]})
              </TabsTrigger>
              <TabsTrigger value={BOOKING_STATUS.CANCELLED} className="flex-1 min-w-[80px]">
                Cancelled ({tabCounts[BOOKING_STATUS.CANCELLED]})
              </TabsTrigger>
            </TabsList>

            {/* Content */}
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <TabsContent value="all" className="mt-0 space-y-4">
                  {filterBookings().map((booking) => (
                    <BookingCard
                      key={booking.bookingId}
                      booking={booking}
                      onCancel={handleCancelBooking}
                    />
                  ))}
                </TabsContent>

                {Object.values(BOOKING_STATUS).map((status) => (
                  <TabsContent key={status} value={status} className="mt-0 space-y-4">
                    {filterBookings(status).length > 0 ? (
                      filterBookings(status).map((booking) => (
                        <BookingCard
                          key={booking.bookingId}
                          booking={booking}
                          onCancel={handleCancelBooking}
                        />
                      ))
                    ) : (
                      <GlassCard variant="elevated" className="p-12 text-center">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No {status.toLowerCase()} bookings
                        </p>
                      </GlassCard>
                    )}
                  </TabsContent>
                ))}
              </>
            )}
          </Tabs>
        </div>
      </div>

      <Footer />
    </main>
  );
}
