"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Search, MapPin, Calendar, ChevronRight } from "lucide-react";
import { SPORT_TYPES } from "@/lib/constants";

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sportType, setSportType] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (sportType) params.set("sport", sportType);
    if (date) params.set("date", date);
    router.push(`/venues?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/10" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">
              Real-time availability
            </span>
            <ChevronRight className="h-4 w-4 text-primary" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
            <span className="text-foreground">Book Premium</span>
            <br />
            <span className="text-primary">Sports Fields</span>
            <br />
            <span className="text-foreground">Instantly</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover and book the best sports facilities near you. Football,
            basketball, tennis and more with real-time slot locking and
            instant confirmation.
          </p>

          {/* Search Box */}
          <GlassCard
            variant="elevated"
            className="p-4 sm:p-6 max-w-3xl mx-auto mt-12"
          >
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Location */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Location or venue name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-input border-border h-12"
                  />
                </div>

                {/* Sport Type */}
                <Select value={sportType} onValueChange={setSportType}>
                  <SelectTrigger className="h-12 bg-input border-border">
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

                {/* Date */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10 bg-input border-border h-12"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Search Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 glow-primary font-semibold"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </form>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-4 border-t border-border/50">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {["Football", "Basketball", "Tennis"].map((sport) => (
                <Button
                  key={sport}
                  variant="ghost"
                  size="sm"
                  className="text-sm hover:text-primary"
                  onClick={() => {
                    setSportType(sport.toLowerCase());
                    handleSearch(new Event("submit") as unknown as React.FormEvent);
                  }}
                >
                  {sport}
                </Button>
              ))}
            </div>
          </GlassCard>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
            {[
              { value: "500+", label: "Venues" },
              { value: "10K+", label: "Bookings" },
              { value: "4.9", label: "Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-muted-foreground">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>  
      </div>
    </section>
  );
}
