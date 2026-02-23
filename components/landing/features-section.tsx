"use client";

import { GlassCard } from "@/components/shared/glass-card";
import {
  Clock,
  Shield,
  Zap,
  MapPin,
  CreditCard,
  Bell,
  Calendar,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-Time Booking",
    description:
      "See live slot availability and lock your preferred time instantly with our HOLD mechanism.",
    color: "text-primary",
  },
  {
    icon: Clock,
    title: "Hold & Confirm",
    description:
      "Secure your slot with a hold, then confirm within the countdown timer to complete your booking.",
    color: "text-secondary",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Flexible deposit options with secure payment processing through trusted providers.",
    color: "text-status-confirmed",
  },
  {
    icon: MapPin,
    title: "Find Nearby",
    description:
      "Discover venues close to you with our location-based search and interactive map.",
    color: "text-chart-3",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Get reminders for upcoming bookings and instant confirmation alerts.",
    color: "text-status-hold",
  },
  {
    icon: Calendar,
    title: "Easy Management",
    description:
      "View, modify, or cancel your bookings with just a few taps.",
    color: "text-chart-5",
  },
];

const ownerFeatures = [
  {
    icon: Users,
    title: "Staff Management",
    description: "Assign staff to venues with scoped access control.",
  },
  {
    icon: CreditCard,
    title: "Revenue Analytics",
    description: "Track bookings, revenue trends, and performance metrics.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Everything You Need for{" "}
            <span className="text-primary">Sports Booking</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A premium booking experience with real-time availability, secure
            payments, and smart management tools.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <GlassCard
              key={feature.title}
              variant="elevated"
              className="p-6 group hover:scale-[1.02] transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-card flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* Owner Features */}
        <div className="mt-24">
          <div className="text-center mb-12 space-y-4">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              For Venue Owners
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Powerful Management Tools
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Complete control over your venues with analytics, staff
              management, and policy configuration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {ownerFeatures.map((feature) => (
              <GlassCard
                key={feature.title}
                variant="elevated"
                glow="secondary"
                className="p-8"
              >
                <feature.icon className="h-10 w-10 text-secondary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
