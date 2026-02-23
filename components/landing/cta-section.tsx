"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";
import { ArrowRight, Building2 } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <GlassCard variant="elevated" glow="primary" className="p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                Ready to Start Playing?
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Join thousands of sports enthusiasts who book their favorite
                fields with VIBE-SPORT. Real-time availability, instant
                confirmation, and premium venues await.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="glow-primary" asChild>
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/venues">Browse Venues</Link>
                </Button>
              </div>
            </div>

            {/* Owner CTA */}
            <div className="lg:border-l lg:border-border/50 lg:pl-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-secondary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Own a Venue?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    List your sports facility on VIBE-SPORT and reach thousands
                    of players. Powerful management tools and analytics included.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-secondary" asChild>
                    <Link href="/become-owner">
                      Learn More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
