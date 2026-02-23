"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { Search, Hand, CreditCard, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Search & Discover",
    description:
      "Find sports venues near you by location, sport type, or date. Browse through detailed profiles with photos and reviews.",
  },
  {
    icon: Hand,
    step: "02",
    title: "Select & Hold",
    description:
      "Choose your preferred time slot and hold it instantly. A countdown timer ensures fair access for everyone.",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Pay & Confirm",
    description:
      "Complete your booking with flexible payment options. Pay full amount or deposit based on venue policy.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Play & Enjoy",
    description:
      "Show up, check in, and enjoy your game. Rate your experience and help the community.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold">
            How <span className="text-primary">VIBE-SPORT</span> Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Book your favorite sports field in just a few simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative group">
                <GlassCard
                  variant="elevated"
                  className="p-6 text-center h-full group-hover:scale-105 transition-all duration-300"
                >
                  {/* Step Number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mt-4 mb-6 group-hover:scale-110 transition-transform">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>

                  <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </GlassCard>

                {/* Arrow (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 text-primary z-10">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="animate-pulse"
                    >
                      <path
                        d="M5 12h14M15 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
