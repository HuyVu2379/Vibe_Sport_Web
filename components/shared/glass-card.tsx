"use client";

import React from "react"

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "subtle";
  glow?: "none" | "primary" | "secondary";
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glow = "none", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-300",
          variant === "default" && "glass-card",
          variant === "elevated" &&
            "glass-card shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30",
          variant === "subtle" && "glass bg-card/50",
          glow === "primary" && "glow-primary",
          glow === "secondary" && "glow-secondary",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
