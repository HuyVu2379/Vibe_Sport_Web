"use client";

import { useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { VenueCard } from "@/features/venue/components/venue-card";
import { VenueFilters } from "@/features/venue/components/venue-filters";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid, List, MapIcon } from "lucide-react";
import type { VenueSearchParams, Venue } from "@/features/venue/types";

// Real API Hook
import { useVenues } from "@/data/hooks/useVenues";
import { useEffect } from "react";

export default function VenuesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialFilters: VenueSearchParams = {
    q: searchParams.get("q") || undefined,
    sportType: (searchParams.get("sport") as VenueSearchParams["sportType"]) || undefined,
    size: 10,
  };
  // filters: trạng thái hiển thị của các input (chưa search)
  const [filters, setFilters] = useState<VenueSearchParams>(initialFilters);
  // committedFilters: filters thực sự dùng để gọi API
  const [committedFilters, setCommittedFilters] = useState<VenueSearchParams>(initialFilters);

  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [sortBy, setSortBy] = useState("rating");
  // API Hook
  const { venues, isLoading, searchVenues } = useVenues();

  // Search Effect — chỉ chạy khi committedFilters thay đổi
  useEffect(() => {
    searchVenues({
      q: committedFilters.q,
      sportType: committedFilters.sportType,
      lat: committedFilters.lat,
      lng: committedFilters.lng,
      radiusKm: committedFilters.radiusKm,
      minPrice: committedFilters.minPrice,
      maxPrice: committedFilters.maxPrice,
      page: committedFilters.page,
      size: committedFilters.size ?? 10,
    });
  }, [committedFilters, searchVenues]);

  // Map and Sort (Client-side sort for now as backend pagination+sort is tricky mixed)
  const sortedVenues = useMemo(() => {
    // Venues from API already match Venue type
    const mapped = venues as unknown as Venue[];

    return [...mapped].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.ratingAvg - a.ratingAvg;
        case "reviews":
          return b.totalReviews - a.totalReviews;
        default:
          return 0;
      }
    });
  }, [venues, sortBy]);

  // Nút Search: commit toàn bộ filters hiện tại → trigger search
  const handleSearch = useCallback(() => {
    setCommittedFilters({ ...filters });
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.sportType) params.set("sport", filters.sportType);
    router.push(`/venues?${params.toString()}`);
  }, [filters, router]);

  // Auto-search khi location thay đổi (lat/lng)
  const handleAutoSearch = useCallback((newFilters: VenueSearchParams) => {
    setFilters(newFilters);
    setCommittedFilters(newFilters);
  }, []);

  // Clear all: reset cả 2 state → tự động search
  const handleClearAll = useCallback(() => {
    const cleared: VenueSearchParams = { size: 10 };
    setFilters(cleared);
    setCommittedFilters(cleared);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Find Your <span className="text-primary">Perfect Venue</span>
            </h1>
            <p className="text-muted-foreground">
              Discover and book premium sports facilities near you
            </p>
          </div>

          {/* Filters */}
          <VenueFilters
            filters={filters}
            onFilterChange={setFilters}
            onAutoSearch={handleAutoSearch}
            onClearAll={handleClearAll}
            onSearch={handleSearch}
          />

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 mb-6">
            <p className="text-muted-foreground">
              Showing <span className="text-foreground font-medium">{sortedVenues.length}</span> venues
            </p>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-input">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="glass">
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex items-center rounded-lg border border-border p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("map")}
                >
                  <MapIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : sortedVenues.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : viewMode === "list"
                    ? "space-y-4"
                    : "h-[600px] rounded-xl overflow-hidden glass"
              }
            >
              {viewMode === "map" ? (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Map view coming soon
                </div>
              ) : (
                sortedVenues.map((venue) => (
                  <VenueCard key={venue.venueId} venue={venue} />
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No venues found matching your criteria
              </p>
              <Button
                variant="link"
                className="mt-2"
                onClick={handleClearAll}
              >
                Clear all filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {sortedVenues.length > 0 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((page) => (
                    <Button
                      key={page}
                      variant={page === 1 ? "default" : "ghost"}
                      size="icon"
                      className="h-9 w-9"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button variant="outline">Next</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
