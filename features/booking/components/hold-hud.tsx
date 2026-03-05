"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, CreditCard, X } from "lucide-react";
import { cn, formatCurrency, formatLocalDateFromISO, formatLocalTime } from "@/lib/utils";
import type { Booking } from "../types";
import { DepositType } from "../types";
import { log } from "console";

interface HoldHUDProps {
  booking: Booking;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

export function HoldHUD({
  booking,
  onConfirm,
  onCancel,
  isConfirming = false,
}: HoldHUDProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  const calculateTimeRemaining = useCallback(() => {
    if (!booking.holdExpiresAt) return 0;
    const expiresAt = new Date(booking.holdExpiresAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((expiresAt - now) / 1000));
  }, [booking.holdExpiresAt]);

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining());

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining === 0) {
        setIsExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 60) return "text-destructive";
    if (timeRemaining <= 180) return "text-status-hold";
    return "text-primary";
  };

  const getProgressColor = () => {
    if (timeRemaining <= 60) return "bg-destructive";
    if (timeRemaining <= 180) return "bg-status-hold";
    return "bg-primary";
  };

  // holdTTLMinutes is in minutes; timeRemaining is in seconds → convert to same unit
  const totalHoldSeconds = (booking.holdTTLMinutes ?? 15) * 60;
  const progress = Math.min((timeRemaining / totalHoldSeconds) * 100, 100);

  // --- Confirm button label & icon ---
  const depositType = booking.depositType ?? DepositType.FULL;
  let confirmLabel: string;
  let showPayIcon: boolean;

  console.log("booking information", booking);
  switch (depositType) {
    case DepositType.NONE:
      confirmLabel = "Confirm Booking";
      showPayIcon = false;
      break;
    case DepositType.PERCENT: {
      const depositAmount = booking.depositAmount ?? 0;
      confirmLabel = `Pay Deposit ${formatCurrency(depositAmount)}`;
      showPayIcon = true;
      break;
    }
    case DepositType.FULL:
    default:
      confirmLabel = `Pay ${formatCurrency(booking.totalPrice)}`;
      showPayIcon = true;
      break;
  }

  if (isExpired) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
        <GlassCard
          variant="elevated"
          className="max-w-2xl mx-auto p-6 border-destructive/50"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Hold Expired</h3>
              <p className="text-muted-foreground text-sm">
                Your hold has expired. Please select your slots again.
              </p>
            </div>
            <Button onClick={onCancel}>Try Again</Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      {/* Progress Bar at top */}
      <div className="max-w-2xl mx-auto mb-2">
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full transition-all duration-1000", getProgressColor())}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <GlassCard variant="elevated" glow="primary" className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Timer */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                timeRemaining <= 60 ? "bg-destructive/20" : "bg-primary/20"
              )}
            >
              <Clock className={cn("h-6 w-6", getTimeColor())} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Time Remaining
              </p>
              <p className={cn("text-2xl font-bold font-mono", getTimeColor())}>
                {formatTime(timeRemaining)}
              </p>
            </div>
          </div>

          {/* Booking Info */}
          <div className="flex-1 sm:border-l sm:border-border/50 sm:pl-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-muted-foreground">Court:</span>
              <span className="font-medium">{booking.courtName}</span>
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{formatLocalDateFromISO(booking.startTime)}</span>
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">
                {formatLocalTime(booking.startTime)} - {formatLocalTime(booking.endTime)}
              </span>
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold text-primary">{formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-5 w-5" />
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isConfirming}
              className="flex-1 sm:flex-none glow-primary"
            >
              {isConfirming ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  {showPayIcon && <CreditCard className="h-4 w-4 mr-2" />}
                  {confirmLabel}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Warning for low time */}
        {timeRemaining <= 120 && timeRemaining > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-sm text-status-hold">
            <AlertTriangle className="h-4 w-4" />
            <span>Hurry! Your hold will expire soon.</span>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
