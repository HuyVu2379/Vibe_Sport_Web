"use client";

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "default" | "card" | "text" | "avatar" | "button";
  count?: number;
}

export function LoadingSkeleton({
  className,
  variant = "default",
  count = 1,
}: LoadingSkeletonProps) {
  const variants = {
    default: "h-4 w-full",
    card: "h-48 w-full rounded-xl",
    text: "h-4 w-3/4",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24 rounded-lg",
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse bg-muted/50 rounded",
            variants[variant],
            className
          )}
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-4 space-y-4 rounded-xl">
      <LoadingSkeleton variant="card" className="h-40" />
      <div className="space-y-2">
        <LoadingSkeleton className="h-5 w-2/3" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-4/5" />
      </div>
      <div className="flex gap-2">
        <LoadingSkeleton variant="button" />
        <LoadingSkeleton variant="button" className="w-16" />
      </div>
    </div>
  );
}

export function SlotGridSkeleton() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="h-12 rounded-lg animate-pulse bg-muted/30"
        />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-4 pb-3 border-b border-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-4" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-4 py-3">
          {Array.from({ length: 5 }).map((_, j) => (
            <LoadingSkeleton key={j} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  );
}
