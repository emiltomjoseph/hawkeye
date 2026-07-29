"use client";

import {
  Activity,
  Shield,
  AlertTriangle,
  Clock,
} from "lucide-react";
import type { DashboardStat } from "@/lib/mock-dashboard";

const iconMap: Record<string, React.ElementType> = {
  Activity,
  Shield,
  AlertTriangle,
  Clock,
};

interface StatCardProps {
  stat: DashboardStat;
}

const colorMap: Record<string, string> = {
  talon: "text-talon",
  critical: "text-critical",
  pass: "text-pass",
  bone: "text-bone",
};

export default function StatCard({ stat }: StatCardProps) {
  const Icon = iconMap[stat.icon] ?? Activity;
  const valueColor = colorMap[stat.color] ?? "text-bone";

  return (
    <div className="rounded-lg border border-white/[0.08] bg-gradient-to-b from-[#101622] to-[#0b0e14] p-5 relative group hover:border-cyan/30 hover:shadow-lg hover:shadow-cyan/5 transition-all shadow-md shadow-black/50">
      {/* Icon top-right */}
      <div className="absolute top-4 right-4">
        <Icon className="w-5 h-5 text-feather/40" strokeWidth={1.5} />
      </div>

      {/* Value */}
      <p className={`font-mono text-3xl font-medium leading-none ${valueColor}`}>
        {stat.value}
      </p>

      {/* Trend */}
      {stat.trend && (
        <span className="inline-block mt-1.5 font-mono text-xs text-pass">
          {stat.trend}
        </span>
      )}

      {/* Label */}
      <p className="mt-2 font-body text-sm text-feather">{stat.label}</p>
    </div>
  );
}
