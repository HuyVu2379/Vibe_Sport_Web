"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  minDate?: string;
  maxDays?: number;
}

export function DatePicker({
  selectedDate,
  onDateSelect,
  minDate = new Date().toISOString().split("T")[0],
  maxDays = 14,
}: DatePickerProps) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleDays = 7;

  // Generate dates array
  const dates = Array.from({ length: maxDays }, (_, i) => {
    const date = new Date(minDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDisplay = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate.getTime() === today.getTime()) return "Today";
    if (targetDate.getTime() === tomorrow.getTime()) return "Tomorrow";

    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const visibleDates = dates.slice(startIndex, startIndex + visibleDays);

  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + visibleDays < dates.length;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setStartIndex(Math.max(0, startIndex - 1))}
        disabled={!canScrollLeft}
        className="hidden sm:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex-1 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {visibleDates.map((date) => {
            const dateStr = formatDate(date);
            const isSelected = dateStr === selectedDate;

            return (
              <button
                key={dateStr}
                onClick={() => onDateSelect(dateStr)}
                className={cn(
                  "flex flex-col items-center px-4 py-3 rounded-xl transition-all min-w-[80px]",
                  "border hover:border-primary/50",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:bg-muted/50"
                )}
              >
                <span className="text-xs font-medium opacity-80">
                  {formatDisplay(date)}
                </span>
                <span className="text-lg font-bold">{date.getDate()}</span>
                <span className="text-xs opacity-70">
                  {date.toLocaleDateString("en-US", { month: "short" })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setStartIndex(Math.min(dates.length - visibleDays, startIndex + 1))}
        disabled={!canScrollRight}
        className="hidden sm:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
