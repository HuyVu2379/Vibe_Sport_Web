"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassCard } from "@/components/shared/glass-card";

interface OccupancyChartProps {
  data: Array<{
    hour: string;
    weekday: number;
    weekend: number;
  }>;
}

export function OccupancyChart({ data }: OccupancyChartProps) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Peak Hours Analysis</h3>
          <p className="text-sm text-muted-foreground">Occupancy rate by hour</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Weekday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-muted-foreground">Weekend</span>
          </div>
        </div>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 240)" vertical={false} />
            <XAxis
              dataKey="hour"
              stroke="oklch(0.5 0.02 240)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="oklch(0.5 0.02 240)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.12 0.015 240)",
                border: "1px solid oklch(0.25 0.02 240)",
                borderRadius: "8px",
                color: "oklch(0.98 0 0)",
              }}
              labelStyle={{ color: "oklch(0.65 0.02 240)" }}
              formatter={(value: number) => [`${value}%`, ""]}
            />
            <Bar
              dataKey="weekday"
              fill="oklch(0.85 0.25 120)"
              radius={[4, 4, 0, 0]}
              name="Weekday"
            />
            <Bar
              dataKey="weekend"
              fill="oklch(0.65 0.18 195)"
              radius={[4, 4, 0, 0]}
              name="Weekend"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
