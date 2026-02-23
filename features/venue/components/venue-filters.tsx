"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassCard } from "@/components/shared/glass-card";
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
import { SPORT_TYPES } from "@/lib/constants";
import type { VenueSearchParams } from "../types";

interface VenueFiltersProps {
  filters: VenueSearchParams;
  onFilterChange: (filters: VenueSearchParams) => void;
  onSearch: () => void;
}

export function VenueFilters({
  filters,
  onFilterChange,
  onSearch,
}: VenueFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof VenueSearchParams, value: string | number | undefined) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  return (
    <GlassCard variant="elevated" className="p-4 space-y-4">
      {/* Main Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search venues..."
            value={filters.q || ""}
            onChange={(e) => updateFilter("q", e.target.value)}
            className="pl-10 bg-input"
          />
        </div>

        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Location"
            className="pl-10 bg-input"
          />
        </div>

        <Select
          value={filters.sportType || "all"}
          onValueChange={(v) => updateFilter("sportType", v === "all" ? undefined : v)}
        >
          <SelectTrigger className="w-full sm:w-[180px] bg-input">
            <SelectValue placeholder="Sport type" />
          </SelectTrigger>
          <SelectContent className="glass">
            <SelectItem value="all">All Sports</SelectItem>
            {SPORT_TYPES.map((sport) => (
              <SelectItem key={sport.id} value={sport.id}>
                {sport.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={onSearch} className="glow-primary">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Toggle Advanced */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Advanced Filters
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border/50">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Page
            </label>
            <Input
              type="number"
              placeholder="1"
              value={filters.page || ""}
              onChange={(e) => updateFilter("page", Number(e.target.value) || undefined)}
              className="bg-input"
              min={0}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Page Size
            </label>
            <Input
              type="number"
              placeholder="10"
              value={filters.size || ""}
              onChange={(e) => updateFilter("size", Number(e.target.value) || undefined)}
              className="bg-input"
              min={1}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Search Radius (km)
            </label>
            <Select
              value={filters.radiusKm?.toString() || "10"}
              onValueChange={(v) => updateFilter("radiusKm", Number(v))}
            >
              <SelectTrigger className="bg-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="25">25 km</SelectItem>
                <SelectItem value="50">50 km</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
