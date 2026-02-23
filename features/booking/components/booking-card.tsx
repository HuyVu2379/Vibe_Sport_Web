"use client";

import Link from "next/link";
import { GlassCard } from "@/components/shared/glass-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, MoreVertical, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BOOKING_STATUS } from "@/lib/constants";
import type { Booking } from "../types";

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const canCancel =
    booking.status === BOOKING_STATUS.HOLD ||
    booking.status === BOOKING_STATUS.CONFIRMED;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <GlassCard variant="elevated" className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Main Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {booking.courtName || "Court"}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>{booking.venueName || "Venue"}</span>
              </div>
            </div>
            <StatusBadge status={booking.status} type="booking" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(booking.startTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {booking.startTime} - {booking.endTime}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Total: </span>
              <span className="font-semibold text-primary">
                ${booking.totalPrice}
              </span>
            </div>
          </div>

          {/* HOLD specific info */}
          {booking.status === BOOKING_STATUS.HOLD && booking.holdExpiresAt && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-status-hold/10 text-status-hold text-sm">
              <Clock className="h-4 w-4" />
              <span>
                Hold expires at{" "}
                {new Date(booking.holdExpiresAt).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {booking.status === BOOKING_STATUS.HOLD && (
            <Button asChild>
              <Link href={`/booking/confirm/${booking.bookingId}`}>Pay & Confirm</Link>
            </Button>
          )}

          {canCancel && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass">
                <DropdownMenuItem asChild>
                  <Link href={`/bookings/${booking.bookingId}`}>View Details</Link>
                </DropdownMenuItem>
                {canCancel && onCancel && (
                  <DropdownMenuItem
                    onClick={() => onCancel(booking.bookingId)}
                    className="text-destructive"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Booking
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
