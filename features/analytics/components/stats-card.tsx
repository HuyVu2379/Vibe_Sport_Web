"use client";

import React from "react"

import { GlassCard } from "@/components/shared/glass-card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  variant?: "default" | "primary" | "secondary";
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel = "vs last period",
  icon,
  variant = "default",
}: StatsCardProps) {
  const getTrend = () => {
    if (change === undefined || change === 0) return { icon: Minus, color: "text-muted-foreground" };
    if (change > 0) return { icon: TrendingUp, color: "text-green-400" };
    return { icon: TrendingDown, color: "text-red-400" };
  };

  const trend = getTrend();
  const TrendIcon = trend.icon;

  return (
    <GlassCard
      className={cn(
        "p-6 relative overflow-hidden",
        variant === "primary" && "border-primary/30",
        variant === "secondary" && "border-secondary/30"
      )}
    >
      {variant !== "default" && (
        <div
          className={cn(
            "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10",
            variant === "primary" && "bg-primary",
            variant === "secondary" && "bg-secondary"
          )}
        />
      )}

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5">
              <TrendIcon className={cn("w-4 h-4", trend.color)} />
              <span className={cn("text-sm font-medium", trend.color)}>
                {change > 0 ? "+" : ""}
                {change}%
              </span>
              <span className="text-xs text-muted-foreground">{changeLabel}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-xl",
            variant === "default" && "bg-muted",
            variant === "primary" && "bg-primary/10 text-primary",
            variant === "secondary" && "bg-secondary/10 text-secondary"
          )}
        >
          {icon}
        </div>
      </div>
    </GlassCard>
  );
}
