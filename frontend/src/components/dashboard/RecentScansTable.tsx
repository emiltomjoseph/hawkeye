"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "./EmptyState";
import type { ScanResult } from "@/lib/mock-data";
import { formatTimestamp, getScoreColor } from "@/lib/mock-data";
import { getAllScans } from "@/lib/scan-store";

function getOverallStatus(score: number): "pass" | "warning" | "critical" {
  if (score >= 70) return "pass";
  if (score >= 40) return "warning";
  return "critical";
}

export default function RecentScansTable() {
  const [scans, setScans] = useState<ScanResult[]>([]);

  useEffect(() => {
    setScans(getAllScans().slice(0, 5));
  }, []);

  if (scans.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 font-mono text-xs text-feather/60 font-medium tracking-wide">
                TARGET
              </th>
              <th className="pb-3 font-mono text-xs text-feather/60 font-medium tracking-wide text-center w-20">
                SCORE
              </th>
              <th className="pb-3 font-mono text-xs text-feather/60 font-medium tracking-wide">
                STATUS
              </th>
              <th className="pb-3 font-mono text-xs text-feather/60 font-medium tracking-wide text-right">
                SCANNED
              </th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan) => (
              <tr
                key={scan.id}
                className="border-b border-border/50 last:border-b-0 group"
              >
                <td className="py-3.5">
                  <Link
                    href={`/scan/${scan.id}`}
                    className="font-mono text-sm text-bone hover:text-cyan transition-colors"
                  >
                    {scan.url}
                  </Link>
                </td>
                <td className="py-3.5 text-center">
                  <span className={`font-mono text-lg font-medium ${getScoreColor(scan.score)}`}>
                    {scan.score}
                  </span>
                </td>
                <td className="py-3.5">
                  <StatusBadge status={getOverallStatus(scan.score)} />
                </td>
                <td className="py-3.5 text-right">
                  <span className="font-mono text-xs text-feather/60">
                    {formatTimestamp(scan.scannedAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2">
        {scans.map((scan) => (
          <Link
            key={scan.id}
            href={`/scan/${scan.id}`}
            className="flex items-center gap-3 rounded-lg border border-border bg-raised p-4 transition-colors hover:border-feather/30"
          >
            <span className={`font-mono text-xl font-medium w-10 text-center shrink-0 ${getScoreColor(scan.score)}`}>
              {scan.score}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm text-bone truncate">
                {scan.url}
              </p>
              <p className="font-mono text-xs text-feather/60 mt-0.5">
                {formatTimestamp(scan.scannedAt)}
              </p>
            </div>
            <StatusBadge
              status={getOverallStatus(scan.score)}
              className="shrink-0"
            />
          </Link>
        ))}
      </div>
    </>
  );
}
