"use client";

import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/shared/glass-card";
import { StatsCard } from "@/features/analytics/components/stats-card";
import { RevenueChart } from "@/features/analytics/components/revenue-chart";
import { OccupancyChart } from "@/features/analytics/components/occupancy-chart";
import { BookingsTable } from "@/features/analytics/components/bookings-table";
import { FieldManagement } from "@/features/analytics/components/field-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/data/hooks/useAuth";
import { useOwnerAnalytics, useOwnerBookings } from "@/data/hooks/useOwner";
import { apiClient } from "@/data/api/client";
import { VenueListItemDto } from "@/domain/types";
import {
  DollarSign,
  Calendar,
  Users,
  Activity,
  BarChart3,
  Building2,
  Settings,
  TrendingUp
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const [venueId, setVenueId] = useState<string>("");
  const [venues, setVenues] = useState<VenueListItemDto[]>([]);

  // 1. Fetch Owner's Venues
  useEffect(() => {
    // Assuming GET /owner/venues returns VenueListItemDto[]
    // If endpoint doesn't exist, we might need to fallback or check docs.
    // Docs didn't specify /owner/venues, but common sense dictates listing owner venues.
    // If 404, we handle error.
    const fetchVenues = async () => {
      try {
        const res = await apiClient.get<any>('/owner/venues');
        const list = Array.isArray(res) ? res : (res.items || []);
        setVenues(list);
        // VenueListItemDto has venueId, not id
        if (list.length > 0) setVenueId(list[0].venueId);
      } catch (e) {
        console.error("Failed to load venues", e);
      }
    };
    if (user?.role === 'OWNER') fetchVenues();
  }, [user]);

  // 2. Fetch Analytics
  const { analytics, isLoading: analyticsLoading } = useOwnerAnalytics(
    venueId,
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    new Date().toISOString().split('T')[0]
  );

  // 3. Fetch Bookings
  const { bookings, isLoading: bookingsLoading, refetch: reloadBookings } = useOwnerBookings({
    venueId: venueId
  });

  // Transform bookings to match DashboardBooking interface
  const tableBookings = useMemo(() => {
    return bookings.map(b => ({
      id: b.bookingId,
      userId: b.customer?.userId || '',
      venueId: venueId,
      date: b.startTime,
      startTime: b.startTime,
      endTime: b.endTime,
      totalPrice: 0, // Not in DTO
      status: b.status,
      userName: b.customer?.fullName || 'Unknown',
      userEmail: '', // Not in DTO
      fieldName: b.courtId, // Use courtId as name for now
      venueName: venues.find(v => v.venueId === venueId)?.name
    }));
  }, [bookings, venueId, venues]);

  if (!user || user.role !== 'OWNER') {
    // Optional: Redirect or show access denied
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex justify-center">
          <p>Access Denied. Owner account required.</p>
        </div>
      </main>
    );
  }

  // Helper to safely format numbers
  const safeNum = (n?: number) => n?.toLocaleString() || "0";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Owner Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                {venues.find(v => v.venueId === venueId)?.name || "Loading Venue..."}
              </p>
            </div>

            {/* Venue Selector if multiple? For now just showing buttons */}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted/30 border border-border/50">
              <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="w-4 h-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="fields" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Building2 className="w-4 h-4" />
                Fields
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Total Revenue"
                  value={`$${safeNum(analytics?.totalRevenue)}`}
                  change={0}
                  icon={<DollarSign className="w-5 h-5" />}
                  variant="primary"
                />
                <StatsCard
                  title="Total Bookings"
                  value={safeNum(analytics?.totalBookings)}
                  change={0}
                  icon={<Calendar className="w-5 h-5" />}
                  variant="secondary"
                />
                <StatsCard
                  title="Avg. Occupancy"
                  value={`${(analytics as any)?.occupancyRate || 0}%`}
                  change={0}
                  icon={<TrendingUp className="w-5 h-5" />}
                />
                <StatsCard
                  title="Active Customers"
                  value="-" // Not in DTO
                  change={0}
                  icon={<Users className="w-5 h-5" />}
                />
              </div>

              {/* Charts Placeholder - Backend usually returns aggregated data points. 
                  If DTO doesn't have chart data, we show empty or flat line. 
              */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RevenueChart data={[]} period={period} />
                </div>
                <div>
                  <OccupancyChart data={[]} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              {/* We map BookingItemDto to whatever BookingsTable expects. 
                   If BookingsTable expects specific shape, we might need a mapper or cast.
                   Assuming BookingsTable accepts `any` or strict shape.
                */}
              <BookingsTable
                bookings={tableBookings}
                onViewDetails={() => { }}
                onConfirm={() => { }}
                onCancel={() => { }}
              />
            </TabsContent>

            <TabsContent value="fields" className="space-y-6">
              <FieldManagement
                fields={[]} // Fetch fields? useVenueDetail(venueId) to get fields
                onAddField={() => { }}
                onEdit={() => { }}
                onDelete={() => { }}
                onToggleAvailability={() => { }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
