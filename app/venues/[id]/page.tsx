"use client";

import { useState, useEffect, useRef } from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Star,
  Clock,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Shield,
  CreditCard,
  Info,
  MessageSquare,
  User,
} from "lucide-react";
import { SPORT_TYPES } from "@/lib/constants";
import type { Court } from "@/features/venue/types";
import { useVenueDetail } from "@/data/hooks/useVenues";
import { useVenueReviews } from "@/data/hooks/useReviews";
import { formatCurrency } from "@/lib/utils";


function CourtCard({ court, venueId }: { court: Court; venueId: string }) {
  const sportInfo = SPORT_TYPES.find((s) => s.id === court.sportType);

  return (
    <GlassCard variant="elevated" className="overflow-hidden">
      <div className="relative h-40">
        <div className="w-full h-full bg-muted flex items-center justify-center">
          {
            court.imageUrls && court.imageUrls.length > 0 ? (
              <Image
                src={court.imageUrls[0]}
                alt={court.name}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-muted-foreground">No image</span>
            )
          }
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{court.name}</h3>
            <Badge variant="secondary" className="mt-1">
              {sportInfo?.label || court.sportType}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div>
            <span className="text-xs text-muted-foreground">From</span>
            <div className="font-semibold text-primary">{formatCurrency(court.minPricePerHour)}/hour</div>
          </div>
          <Button asChild>
            <Link href={`/booking?venue=${venueId}&court=${court.courtId}`}>
              Book Now
            </Link>
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.round(rating)
            ? "fill-primary text-primary"
            : "fill-muted text-muted-foreground/40"
            }`}
        />
      ))}
    </div>
  );
}

export default function VenueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { venue, isLoading, error } = useVenueDetail(id);
  const { reviews, total: totalReviews, averageRating, isLoading: reviewsLoading } = useVenueReviews(id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Lấy images trước early return để tuân thủ Rules of Hooks
  const images = venue?.imageUrls || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // Auto-slide: chuyển ảnh mỗi 4 giây, dừng khi hover
  // PHẢI đặt trước early return để tuân thủ Rules of Hooks
  useEffect(() => {
    if (images.length <= 1) return;
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length, isPaused]);

  if (isLoading) {
    return <div className="min-h-screen pt-24 flex justify-center text-foreground">Loading...</div>;
  }

  if (error || !venue) {
    return <div className="min-h-screen pt-24 flex justify-center text-foreground">Venue not found</div>;
  }


  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20">
        {/* Image Gallery */}
        <div
          className="relative h-[400px] md:h-[500px] bg-muted"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {images[currentImageIndex] && (
            <Image
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={venue.name}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

          {/* Gallery Controls — all overlaid on image */}
          {images.length > 1 && (
            <>
              {/* Prev arrow — left side */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 glass z-20"
                onClick={prevImage}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {/* Next arrow — right side */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 glass z-20"
                onClick={nextImage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              {/* Smart dot indicator — bottom center, max 5 dots visible */}
              {(() => {
                const MAX = 5;
                const total = images.length;
                const half = Math.floor(MAX / 2);
                let start = Math.max(0, currentImageIndex - half);
                let end = start + MAX;
                if (end > total) { end = total; start = Math.max(0, end - MAX); }
                const visible = Array.from({ length: end - start }, (_, i) => start + i);
                return (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                    {start > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 block flex-shrink-0" />
                    )}
                    {visible.map((idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`rounded-full transition-all duration-300 flex-shrink-0 ${idx === currentImageIndex
                          ? "bg-primary w-4 h-2"
                          : "bg-white/60 w-2 h-2 hover:bg-white/80"
                          }`}
                      />
                    ))}
                    {end < total && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 block flex-shrink-0" />
                    )}
                  </div>
                );
              })()}
            </>
          )}

          {/* Back Button */}
          <Button
            variant="ghost"
            className="absolute top-24 left-4 glass z-20"
            asChild
          >
            <Link href="/venues">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Venues
            </Link>
          </Button>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 relative z-10 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <GlassCard variant="elevated" className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{venue.name}</h1>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{venue.address}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {venue.sportTypes.map((sport) => {
                        const sportInfo = SPORT_TYPES.find((s) => s.id === sport);
                        return (
                          <Badge key={sport} variant="secondary">
                            {sportInfo?.label || sport}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full glass">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="font-semibold">{venue.ratingAvg.toFixed(1)}</span>
                      <span className="text-muted-foreground text-sm">
                        ({venue.totalReviews})
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Tabs */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="w-full glass">
                  <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
                  <TabsTrigger value="courts" className="flex-1">Courts</TabsTrigger>
                  <TabsTrigger value="amenities" className="flex-1">Amenities</TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6 space-y-6">
                  <GlassCard variant="elevated" className="p-6">
                    <h2 className="font-semibold text-lg mb-4">About This Venue</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {venue.about || "No description available."}
                    </p>
                  </GlassCard>
                </TabsContent>

                <TabsContent value="courts" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {venue.courts?.map((court) => (
                      <CourtCard key={court.courtId} court={court as Court} venueId={venue.venueId} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="amenities" className="mt-6">
                  <GlassCard variant="elevated" className="p-6">
                    <h2 className="font-semibold text-lg mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {venue.amenities?.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-sm">{typeof amenity === 'string' ? amenity : amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6 space-y-4">
                  {/* Summary */}
                  <GlassCard variant="elevated" className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-primary">{averageRating.toFixed(1)}</div>
                        <StarRating rating={averageRating} />
                        <div className="text-xs text-muted-foreground mt-1">{totalReviews} reviews</div>
                      </div>
                      <div className="flex-1 space-y-1">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = reviews.filter((r) => Math.round(r.rating) === star).length;
                          const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                          return (
                            <div key={star} className="flex items-center gap-2 text-xs">
                              <span className="w-4 text-muted-foreground">{star}</span>
                              <Star className="h-3 w-3 fill-primary text-primary" />
                              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="w-5 text-muted-foreground text-right">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </GlassCard>

                  {/* Review list */}
                  {reviewsLoading ? (
                    <GlassCard variant="elevated" className="p-6">
                      <div className="text-center text-muted-foreground py-6">Loading reviews...</div>
                    </GlassCard>
                  ) : reviews.length === 0 ? (
                    <GlassCard variant="elevated" className="p-6">
                      <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
                        <MessageSquare className="h-10 w-10 opacity-30" />
                        <p className="text-sm">No reviews yet. Be the first to review!</p>
                      </div>
                    </GlassCard>
                  ) : (
                    reviews.map((review) => (
                      <GlassCard key={review.reviewId} variant="elevated" className="p-5">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            {review.user.avatarUrl ? (
                              <img src={review.user.avatarUrl} alt={review.user.fullName} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <User className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="font-semibold text-sm">{review.user.fullName}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            <StarRating rating={review.rating} />
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{review.comment}</p>

                            {/* Owner reply */}
                            {review.reply && (
                              <div className="mt-3 pl-4 border-l-2 border-primary/30">
                                <p className="text-xs font-semibold text-primary mb-1">Owner reply</p>
                                <p className="text-sm text-muted-foreground">{review.reply}</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">
                                  {new Date(review.repliedAt!).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Book */}
              <GlassCard variant="elevated" glow="primary" className="p-6">
                <h2 className="font-semibold text-lg mb-4">Quick Book</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Starting from</span>
                    <span className="text-2xl font-bold text-primary">
                      {venue.courts?.length ? formatCurrency(Math.min(...venue.courts.map((c) => c.minPricePerHour ?? 0))) : "--"}/hr
                    </span>
                  </div>
                  <Button className="w-full glow-primary" size="lg" asChild>
                    <Link href={`/booking?venue=${venue.venueId}`}>
                      <Calendar className="h-5 w-5 mr-2" />
                      Book a Court
                    </Link>
                  </Button>
                </div>
              </GlassCard>

              {/* Contact */}
              <GlassCard variant="elevated" className="p-6">
                <h2 className="font-semibold text-lg mb-4">Contact</h2>
                <div className="space-y-3">
                  {venue.contact?.phone && (
                    <a
                      href={`tel:${venue.contact.phone}`}
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                      <span>{venue.contact.phone}</span>
                    </a>
                  )}
                  {venue.contact?.email && (
                    <a
                      href={`mailto:${venue.contact.email}`}
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                      <span>{venue.contact.email}</span>
                    </a>
                  )}
                </div>
              </GlassCard>

              {/* Operating Hours */}
              <GlassCard variant="elevated" className="p-6">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Operating Hours
                </h2>
                <div className="space-y-2">
                  {venue.openHours?.map((hours, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {hours.dayOfWeek}
                      </span>
                      <span>
                        {!hours.isClosed
                          ? `${hours.openTime} - ${hours.closeTime}`
                          : "Closed"}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Policies */}
              <GlassCard variant="elevated" className="p-6">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Booking Policies
                </h2>
                <div className="space-y-4">
                  {venue.policy && (
                    <>
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Hold Time</p>
                          <p className="text-sm text-muted-foreground">
                            {venue.policy.holdTTLMinutes} minutes to confirm
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Deposit</p>
                          <p className="text-sm text-muted-foreground">
                            {venue.policy.depositType === "NONE"
                              ? "No deposit required"
                              : venue.policy.depositType === "FULL"
                                ? "Full payment required"
                                : `${venue.policy.depositPercentage || 0}% deposit required`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Cancellation</p>
                          <p className="text-sm text-muted-foreground">
                            Free cancellation up to {venue.policy.cancelBeforeHours} hours before
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
