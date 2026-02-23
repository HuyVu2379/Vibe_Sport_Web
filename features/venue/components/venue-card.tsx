"use client";

import Link from "next/link";
import Image from "next/image";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, ArrowRight } from "lucide-react";
import type { Venue } from "../types";
import { SPORT_TYPES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  const getSportLabel = (id: string) => {
    return SPORT_TYPES.find((s) => s.id === id)?.label || id;
  };

  return (
    <GlassCard
      variant="elevated"
      className="overflow-hidden group hover:scale-[1.02] transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {venue.imageUrl ? (
          <Image
            src={venue.imageUrl || "/placeholder.svg"}
            alt={venue.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full glass text-sm font-medium">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span>{venue.ratingAvg.toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {venue.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{venue.address}</span>
          </div>
        </div>

        {/* Sport Types */}
        <div className="flex flex-wrap gap-1.5">
          {venue.sportTypes.slice(0, 3).map((sport) => (
            <Badge key={sport} variant="secondary" className="text-xs">
              {getSportLabel(sport)}
            </Badge>
          ))}
          {venue.sportTypes.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{venue.sportTypes.length - 3}
            </Badge>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{venue.totalCourts || 0} courts</span>
          </div>
          <span>{venue.totalReviews} reviews</span>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-border/50 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">From</span>
            <div className="font-semibold text-primary">
              {formatCurrency(venue.minPricePerHour)}
              <span className="text-xs font-normal text-muted-foreground ml-1">
                /hour
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild className="group/btn">
            <Link href={`/venues/${venue.venueId}`}>
              View Details
              <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
