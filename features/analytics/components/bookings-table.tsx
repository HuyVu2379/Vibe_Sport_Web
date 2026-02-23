"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Interface for dashboard display bookings (different from API Booking type)
interface DashboardBooking {
  id: string;
  userId: string;
  venueId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  userName?: string;
  userEmail?: string;
  fieldName?: string;
  venueName?: string;
}

interface BookingsTableProps {
  bookings: DashboardBooking[];
  onViewDetails?: (booking: DashboardBooking) => void;
  onConfirm?: (booking: DashboardBooking) => void;
  onCancel?: (booking: DashboardBooking) => void;
}

export function BookingsTable({
  bookings,
  onViewDetails,
  onConfirm,
  onCancel,
}: BookingsTableProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Bookings</h3>
          <p className="text-sm text-muted-foreground">
            Manage and track all venue bookings
          </p>
        </div>
        <Button variant="outline" size="sm" className="bg-transparent">
          View All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Booking ID</TableHead>
              <TableHead className="text-muted-foreground">Customer</TableHead>
              <TableHead className="text-muted-foreground">Field</TableHead>
              <TableHead className="text-muted-foreground">Date & Time</TableHead>
              <TableHead className="text-muted-foreground">Amount</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id} className="border-border/50 hover:bg-muted/20">
                <TableCell className="font-mono text-sm text-muted-foreground">
                  #{booking.id.slice(0, 8)}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{booking.userName}</p>
                    <p className="text-xs text-muted-foreground">{booking.userEmail}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{booking.fieldName}</p>
                    <p className="text-xs text-muted-foreground">{booking.venueName}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{formatDate(booking.date)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  ${booking.totalPrice.toFixed(2)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onViewDetails?.(booking)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {booking.status === "hold" && (
                        <DropdownMenuItem onClick={() => onConfirm?.(booking)}>
                          Confirm Booking
                        </DropdownMenuItem>
                      )}
                      {(booking.status === "hold" || booking.status === "confirmed") && (
                        <DropdownMenuItem
                          onClick={() => onCancel?.(booking)}
                          className="text-destructive focus:text-destructive"
                        >
                          Cancel Booking
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </GlassCard>
  );
}
