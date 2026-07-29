import type { Metadata } from "next";
import StatCard from "@/components/dashboard/StatCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import RecentScansTable from "@/components/dashboard/RecentScansTable";
import { dashboardStats, quickActions } from "@/lib/mock-dashboard";
import { mockScanHistory } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Dashboard — Hawkeye",
  description: "Your Hawkeye security overview. View scan statistics, recent results, and quick actions.",
};

export default function DashboardPage() {
  return (
    <div className="relative max-w-6xl mx-auto space-y-8">
      {/* Ambient header glow */}
      <div className="absolute -top-20 left-1/4 w-96 h-80 bg-cyan/4 rounded-full blur-3xl pointer-events-none" />
      {/* ── Page Header ── */}
      <header>
        <p className="font-mono text-xs text-feather/60 tracking-widest mb-1">
          SCAN::OVERVIEW
        </p>
        <h1 className="font-display text-3xl lg:text-4xl text-bone tracking-wide">
          DASHBOARD
        </h1>
        <p className="font-body text-sm text-feather mt-1">
          Welcome back — here&apos;s your security overview.
        </p>
      </header>

      {/* ── Stats Cards ── */}
      <section aria-label="Scan statistics">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </section>

      {/* ── Quick Actions ── */}
      <section aria-label="Quick actions">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <QuickActionCard key={action.label} action={action} />
          ))}
        </div>
      </section>

      {/* ── Recent Scans ── */}
      <section aria-label="Recent scans">
        <p className="font-mono text-xs text-feather/60 tracking-widest mb-3">
          SCAN::RECENT
        </p>
        <RecentScansTable scans={mockScanHistory} />
      </section>
    </div>
  );
}
