"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  Loader2,
  LocateFixed,
} from "lucide-react";
import { SPORT_TYPES } from "@/lib/constants";
import type { VenueSearchParams } from "../types";

// ─── LocationIQ helpers ──────────────────────────────────────────────────────

const LOCATIONIQ_TOKEN =
  process.env.NEXT_PUBLIC_LOCATIONIQ_TOKEN ?? "";

interface LocationSuggestion {
  displayName: string;
  lat: number;
  lng: number;
}

/** Reverse-geocode coordinates to a Vietnamese-friendly address string */
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const url = `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_TOKEN}&lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=vi`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Reverse geocode failed");
  const data = await res.json();
  const a = data.address ?? {};
  const parts = [
    a.suburb ?? a.quarter ?? a.neighbourhood ?? a.village,
    a.city_district ?? a.district ?? a.county,
    a.city ?? a.state,
  ].filter(Boolean);
  return parts.join(", ") || data.display_name;
}

/** Forward autocomplete search → list of suggestions */
async function autocomplete(query: string): Promise<LocationSuggestion[]> {
  if (!query || query.length < 2) return [];
  const url = `https://us1.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_TOKEN}&q=${encodeURIComponent(query)}&countrycodes=vn&limit=5&format=json&dedupe=1&normalizecity=1`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data: Array<{ display_name: string; lat: string; lon: string }> =
    await res.json();
  return data.map((d) => ({
    displayName: d.display_name,
    lat: parseFloat(d.lat),
    lng: parseFloat(d.lon),
  }));
}

// ─── Component ───────────────────────────────────────────────────────────────

interface VenueFiltersProps {
  filters: VenueSearchParams;
  /** Cập nhật filters mà không trigger search (dùng cho q, price, radius) */
  onFilterChange: (filters: VenueSearchParams) => void;
  /** Trigger search ngay (dùng cho location, sportType, clearAll) */
  onAutoSearch: (filters: VenueSearchParams) => void;
  /** Clear tất cả filters và search ngay */
  onClearAll: () => void;
  /** Nút Search được bấm */
  onSearch: () => void;
}

type LocationStatus = "idle" | "detecting" | "ready" | "manual";

export function VenueFilters({
  filters,
  onFilterChange,
  onAutoSearch,
  onClearAll,
  onSearch,
}: VenueFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ── Price local state (hiển thị format VND) ───────────────────────────────
  const formatVND = (value: number | undefined): string =>
    value ? value.toLocaleString("vi-VN") : "";

  const parseVND = (text: string): number | undefined => {
    const digits = text.replace(/\D/g, "");
    return digits ? Number(digits) : undefined;
  };

  const [minPriceText, setMinPriceText] = useState(formatVND(filters.minPrice));
  const [maxPriceText, setMaxPriceText] = useState(formatVND(filters.maxPrice));

  // Đồng bộ khi filters.minPrice/maxPrice bị reset từ bên ngoài (Clear All)
  useEffect(() => {
    setMinPriceText(formatVND(filters.minPrice));
  }, [filters.minPrice]);

  useEffect(() => {
    setMaxPriceText(formatVND(filters.maxPrice));
  }, [filters.maxPrice]);

  // ── Location state ────────────────────────────────────────────────────────
  const [locationLabel, setLocationLabel] = useState("");
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Auto-detect on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("manual");
      return;
    }
    setLocationStatus("detecting");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const label = await reverseGeocode(coords.latitude, coords.longitude);
          setLocationLabel(label);
          setLocationStatus("ready");
          // Auto-search khi detect location thành công
          onAutoSearch({
            ...filters,
            lat: coords.latitude,
            lng: coords.longitude,
          });
        } catch {
          setLocationStatus("manual");
        }
      },
      () => {
        // User denied or error → manual mode
        setLocationStatus("manual");
      },
      { timeout: 8000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Close dropdown when clicking outside ─────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Debounced autocomplete ────────────────────────────────────────────────
  const handleLocationTyping = useCallback(
    (value: string) => {
      setLocationLabel(value);
      // Clear coords khi user đang gõ (chưa chọn suggestion → chưa auto-search)
      onFilterChange({ ...filters, lat: undefined, lng: undefined });

      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!value.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      debounceRef.current = setTimeout(async () => {
        const results = await autocomplete(value);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      }, 400);
    },
    [filters, onFilterChange]
  );

  // ── Select a suggestion → auto-search ────────────────────────────────────
  const handleSelectSuggestion = useCallback(
    (s: LocationSuggestion) => {
      setLocationLabel(s.displayName);
      setSuggestions([]);
      setShowSuggestions(false);
      setLocationStatus("ready");
      // Khi chọn địa chỉ → tự động search
      onAutoSearch({ ...filters, lat: s.lat, lng: s.lng });
    },
    [filters, onAutoSearch]
  );

  // ── Clear location → auto-search ─────────────────────────────────────────
  const clearLocation = useCallback(() => {
    setLocationLabel("");
    setLocationStatus("manual");
    setSuggestions([]);
    setShowSuggestions(false);
    // Xóa location → tự động search lại không có location
    onAutoSearch({ ...filters, lat: undefined, lng: undefined });
  }, [filters, onAutoSearch]);

  // ── Re-detect location → auto-search ─────────────────────────────────────
  const reDetect = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocationStatus("detecting");
    setLocationLabel("");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const label = await reverseGeocode(coords.latitude, coords.longitude);
          setLocationLabel(label);
          setLocationStatus("ready");
          onAutoSearch({ ...filters, lat: coords.latitude, lng: coords.longitude });
        } catch {
          setLocationStatus("manual");
        }
      },
      () => setLocationStatus("manual"),
      { timeout: 8000 }
    );
  }, [filters, onAutoSearch]);

  // ── Generic filter updater (chỉ cập nhật local, chưa search) ────────────
  const updateFilter = (
    key: keyof VenueSearchParams,
    value: string | number | undefined
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  // ── Update sportType → auto-search ───────────────────────────────────────
  const handleSportTypeChange = (value: string) => {
    const sportType = value === "all" ? undefined : (value as VenueSearchParams["sportType"]);
    onAutoSearch({ ...filters, sportType });
  };

  const clearFilters = () => {
    setLocationLabel("");
    setLocationStatus("manual");
    setSuggestions([]);
    setShowSuggestions(false);
    onClearAll();
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([k, v]) => k !== "size" && v !== undefined && v !== ""
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <GlassCard variant="elevated" className="p-4 space-y-4">
      {/* Main Search Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Keyword search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search venues..."
            value={filters.q || ""}
            onChange={(e) => updateFilter("q", e.target.value)}
            className="pl-10 bg-input"
          />
        </div>

        {/* Location input */}
        <div className="relative flex-1">
          {locationStatus === "detecting" ? (
            /* Detecting spinner state */
            <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-input text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              <span className="truncate">Đang lấy vị trí…</span>
            </div>
          ) : (
            /* Input (manual / ready) */
            <div className="relative">
              {/* Leading icon: re-detect button */}
              <button
                type="button"
                onClick={reDetect}
                title="Lấy vị trí hiện tại"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {locationStatus === "ready" ? (
                  <LocateFixed className="h-5 w-5 text-primary" />
                ) : (
                  <MapPin className="h-5 w-5" />
                )}
              </button>

              <Input
                ref={inputRef}
                placeholder="Nhập địa chỉ hoặc để tự động nhận vị trí"
                value={locationLabel}
                onChange={(e) => handleLocationTyping(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                className="pl-10 pr-8 bg-input"
              />

              {/* Clear button */}
              {locationLabel && (
                <button
                  type="button"
                  onClick={clearLocation}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Autocomplete dropdown */}
              {showSuggestions && (
                <div
                  ref={dropdownRef}
                  className="absolute z-50 w-full mt-1 rounded-md border border-border bg-popover shadow-lg overflow-hidden"
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault(); // prevent input blur before click
                        handleSelectSuggestion(s);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-start gap-2"
                    >
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                      <span className="line-clamp-2">{s.displayName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sport type — auto-search khi thay đổi */}
        <Select
          value={filters.sportType || "all"}
          onValueChange={handleSportTypeChange}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-border/50">
          {/* Search Radius */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Tìm kiếm trong bán kính (km)
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

          {/* Min Price */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Giá tối thiểu (₫/giờ)
            </label>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={minPriceText}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  const num = raw ? Number(raw) : undefined;
                  setMinPriceText(raw ? Number(raw).toLocaleString("vi-VN") : "");
                  updateFilter("minPrice", num);
                }}
                onBlur={() => setMinPriceText(formatVND(filters.minPrice))}
                className="bg-input pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">₫</span>
            </div>
          </div>

          {/* Max Price */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Giá tối đa (₫/giờ)
            </label>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Không giới hạn"
                value={maxPriceText}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  const num = raw ? Number(raw) : undefined;
                  setMaxPriceText(raw ? Number(raw).toLocaleString("vi-VN") : "");
                  updateFilter("maxPrice", num);
                }}
                onBlur={() => setMaxPriceText(formatVND(filters.maxPrice))}
                className="bg-input pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">₫</span>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
