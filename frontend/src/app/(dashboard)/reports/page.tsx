"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Download, Eye, FileText } from "lucide-react";
import ScoreRing from "@/components/ScoreRing";
import { Button, Card, Badge, Input, EmptyState } from "@/components/ui";
import { mockScanHistory, formatTimestamp, type ScanResult } from "@/lib/mock-data";
import { exportScanReportPDF } from "@/lib/pdf-exporter";

type FilterStatus = "all" | "pass" | "warning" | "critical";

function getOverallStatus(score: number): "pass" | "warning" | "critical" {
  if (score >= 70) return "pass";
  if (score >= 40) return "warning";
  return "critical";
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  /* ── Filtered Reports ── */
  const reports = useMemo(() => {
    return mockScanHistory.filter((scan) => {
      const matchesSearch = scan.url.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesStatus =
        filterStatus === "all" || getOverallStatus(scan.score) === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, filterStatus]);

  async function handleDownloadPDF(scan: ScanResult, e?: React.MouseEvent) {
    e?.preventDefault();
    setDownloadingId(scan.id);
    try {
      await exportScanReportPDF(scan);
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ── Page Header ── */}
      <header>
        <p className="font-mono text-xs text-feather/60 tracking-widest mb-1">
          SCAN::REPORTS
        </p>
        <h1 className="font-display text-3xl lg:text-4xl text-bone tracking-wide">
          REPORTS
        </h1>
        <p className="font-body text-sm text-feather mt-1">
          Exportable security assessment documents and reports.
        </p>
      </header>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <Input
            icon={Search}
            placeholder="Search report by domain or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="w-full sm:w-auto rounded-lg border border-border bg-raised text-bone text-xs font-mono px-3 py-2 cursor-pointer outline-none focus:ring-2 focus:ring-talon min-h-[44px]"
            aria-label="Filter reports by status"
          >
            <option value="all">All Statuses</option>
            <option value="pass">Pass Only (70+)</option>
            <option value="warning">Warning Only (40-69)</option>
            <option value="critical">Critical Only (&lt;40)</option>
          </select>
        </div>
      </div>

      {/* ── Reports Grid / Empty State ── */}
      {reports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Reports Found"
          description={
            searchQuery || filterStatus !== "all"
              ? "No security reports match your current search or filter criteria."
              : "No generated security reports available yet."
          }
          action={
            <Link href="/new-scan">
              <Button variant="primary">Run New Scan</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((scan) => (
            <Card key={scan.id} padding="md" hover className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Badge variant={getOverallStatus(scan.score)}>
                    {scan.score} / 100
                  </Badge>
                  <span className="font-mono text-[10px] text-feather/60 uppercase tracking-widest">
                    PDF DOCUMENT
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <ScoreRing score={scan.score} size={64} />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/scan/${scan.id}`}
                      className="font-mono text-sm text-bone font-medium truncate block hover:text-talon transition-colors"
                      title={scan.url}
                    >
                      {scan.url}
                    </Link>
                    <p className="font-mono text-xs text-feather/60 mt-1">
                      {formatTimestamp(scan.scannedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                <Link href={`/scan/${scan.id}`} className="flex-1">
                  <Button size="sm" variant="ghost" className="w-full" leftIcon={Eye}>
                    View
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="primary"
                  className="flex-1"
                  leftIcon={downloadingId === scan.id ? undefined : Download}
                  isLoading={downloadingId === scan.id}
                  onClick={(e) => handleDownloadPDF(scan, e)}
                >
                  Download PDF
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
