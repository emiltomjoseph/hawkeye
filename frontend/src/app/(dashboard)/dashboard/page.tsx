"use client";

import React, { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import RecentScansTable from "@/components/dashboard/RecentScansTable";
import { quickActions } from "@/lib/mock-dashboard";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState<any[]>([]);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const history = await api.scan.getHistory(1, 5);
        const allScans = history.items || [];
        
        setRecentScans(allScans);
        
        // Calculate basic stats from recent history
        // In a real production app, the backend would provide an aggregation endpoint
        const totalScans = history.total || 0;
        const avgScore = allScans.length > 0 
          ? Math.round(allScans.reduce((acc: number, s: any) => acc + (s.security_score || 0), 0) / allScans.length)
          : 0;
          
        const criticalScans = allScans.filter((s: any) => (s.security_score || 0) < 40).length;

        setStats([
          { label: "Total Scans", value: totalScans.toString(), change: "+1", trend: "up" },
          { label: "Average Score", value: avgScore.toString(), change: "N/A", trend: "neutral" },
          { label: "Critical Findings", value: criticalScans.toString(), change: "-2", trend: "down" },
          { label: "Active Monitors", value: "0", change: "Pro Feature", trend: "neutral" }
        ]);
        
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-signal animate-spin" />
      </div>
    );
  }

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
          WELCOME BACK, {user?.name?.toUpperCase()}
        </h1>
        <p className="font-body text-sm text-feather mt-1">
          Here&apos;s your security overview.
        </p>
      </header>

      {/* ── Stats Cards ── */}
      <section aria-label="Scan statistics">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {stats.map((stat) => (
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
        {/* Transform raw api models to match the expected format of RecentScansTable if necessary */}
        <RecentScansTable scans={recentScans.map((s: any) => ({
          id: s.id.toString(),
          url: s.url,
          score: s.security_score || 0,
          scannedAt: s.created_at,
          categories: [] // Quick summary doesn't need categories in this table
        }))} />
      </section>
    </div>
  );
}
