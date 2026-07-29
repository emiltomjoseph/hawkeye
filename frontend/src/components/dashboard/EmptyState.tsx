"use client";

import Link from "next/link";
import { Crosshair } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border border-dashed py-16 px-4">
      <Crosshair
        className="w-12 h-12 text-feather/20 mb-4"
        strokeWidth={1}
      />
      <p className="font-body text-feather text-sm mb-1">
        No scans yet
      </p>
      <p className="font-body text-feather/60 text-xs mb-6">
        Run your first security assessment to see results here.
      </p>
      <Link
        href="/new-scan"
        className="inline-flex items-center gap-2 rounded-lg bg-talon px-5 py-2.5 font-display text-sm text-deep hover:bg-talon/90 transition-colors"
      >
        Run Your First Scan
      </Link>
    </div>
  );
}
