"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Share2, Eye, Check, ExternalLink } from "lucide-react";
import ScoreRing from "@/components/ScoreRing";
import StatusBadge from "@/components/StatusBadge";
import { Button, Card, Badge, EmptyState } from "@/components/ui";
import { formatTimestamp, getScoreColor, type ScanResult } from "@/lib/mock-data";
import { getAllScans } from "@/lib/scan-store";
import { exportScanReportPDF } from "@/lib/pdf-exporter";

type FilterStatus = "all" | "pass" | "warning" | "critical";
type SortKey = "date" | "score";

function getOverallStatus(score: number): "pass" | "warning" | "critical" {
  if (score >= 70) return "pass";
  if (score >= 40) return "warning";
  return "critical";
}

export default function ScanHistoryPage() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [allScans, setAllScans] = useState<ScanResult[]>([]);

  React.useEffect(() => {
    setAllScans(getAllScans());
  }, []);

  /* ── Filtered & Sorted Scans ── */
  const scans = useMemo(() => {
    let list = [...allScans];

    if (filterStatus !== "all") {
      list = list.filter((s) => getOverallStatus(s.score) === filterStatus);
    }

    list.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime();
      }
      return b.score - a.score;
    });

    return list;
  }, [filterStatus, sortBy, allScans]);

  const mostRecentScan = allScans[0];

  /* ── Handlers ── */
  async function handleDownload(scan: ScanResult, e?: React.MouseEvent) {
    e?.preventDefault();
    setDownloadingId(scan.id);
    try {
      await exportScanReportPDF(scan);
    } finally {
      setDownloadingId(null);
    }
  }

  function handleShare(scan: ScanResult, e?: React.MouseEvent) {
    e?.preventDefault();
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/scan/${scan.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedId(scan.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ── Page Header ── */}
      <header>
        <p className="font-mono text-xs text-feather/60 tracking-widest mb-1">
          SCAN::HISTORY
        </p>
        <h1 className="font-display text-3xl lg:text-4xl text-bone tracking-wide">
          SCAN HISTORY
        </h1>
        <p className="font-body text-sm text-feather mt-1">
          Full history of all security assessments.
        </p>
      </header>

      {/* ── 1. LAST SCAN SUMMARY CARD ── */}
      {mostRecentScan && (
        <section aria-label="Most recent scan summary">
          <Card padding="lg" className="border-cyan/30 bg-raised/90 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <ScoreRing score={mostRecentScan.score} size={84} />

                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="font-mono text-xs text-cyan font-semibold uppercase tracking-wider">
                      LATEST SCAN
                    </span>
                    <Badge variant={getOverallStatus(mostRecentScan.score)}>
                      {mostRecentScan.score} / 100
                    </Badge>
                  </div>
                  <h2 className="font-mono text-lg text-bone font-medium truncate max-w-sm sm:max-w-md">
                    {mostRecentScan.url}
                  </h2>
                  <p
                    className="font-mono text-xs text-feather/60 mt-0.5"
                    title={new Date(mostRecentScan.scannedAt).toUTCString()}
                  >
                    Scanned {formatTimestamp(mostRecentScan.scannedAt)}
                  </p>
                </div>
              </div>

              {/* Summary CTAs */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={ExternalLink}
                  onClick={() => router.push(`/scan/${mostRecentScan.id}`)}
                >
                  View Report
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={downloadingId === mostRecentScan.id ? undefined : Download}
                  isLoading={downloadingId === mostRecentScan.id}
                  onClick={(e) => handleDownload(mostRecentScan, e)}
                >
                  Download PDF
                </Button>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* ── 2. CONTROLS & FILTER BAR ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <h2 className="font-display text-xl text-bone uppercase tracking-wide">
          All Scans ({scans.length})
        </h2>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="rounded-lg border border-border bg-raised text-bone text-xs font-mono px-3 py-2 cursor-pointer outline-none focus:ring-2 focus:ring-talon min-h-[44px]"
            aria-label="Filter by security status"
          >
            <option value="all">All Statuses</option>
            <option value="pass">Pass Only (70+)</option>
            <option value="warning">Warning Only (40-69)</option>
            <option value="critical">Critical Only (&lt;40)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded-lg border border-border bg-raised text-bone text-xs font-mono px-3 py-2 cursor-pointer outline-none focus:ring-2 focus:ring-talon min-h-[44px]"
            aria-label="Sort scan list"
          >
            <option value="date">Newest First</option>
            <option value="score">Highest Score First</option>
          </select>
        </div>
      </div>

      {/* ── 3. FULL HISTORY LIST / EMPTY STATE ── */}
      {scans.length === 0 ? (
        <EmptyState
          title="No Matching Scans"
          description="No security scan records match your selected filter criteria."
          action={
            <Link href="/new-scan">
              <Button variant="primary">Run Your First Scan</Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-border bg-raised">
            <table className="w-full text-left border-collapse" aria-label="Scan history list">
              <thead>
                <tr className="border-b border-border bg-raised/80">
                  <th scope="col" className="px-5 py-3.5 font-mono text-xs text-feather/60 font-medium tracking-wide">
                    TARGET DOMAIN
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-mono text-xs text-feather/60 font-medium tracking-wide text-center w-24">
                    SCORE
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-mono text-xs text-feather/60 font-medium tracking-wide">
                    STATUS
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-mono text-xs text-feather/60 font-medium tracking-wide">
                    SCANNED DATE
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-mono text-xs text-feather/60 font-medium tracking-wide text-right">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-bone/5 transition-colors group">
                    <td className="px-5 py-4">
                      <Link
                        href={`/scan/${scan.id}`}
                        className="font-mono text-sm text-bone font-medium hover:text-cyan transition-colors"
                      >
                        {scan.url}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`font-mono text-base font-bold ${getScoreColor(scan.score)}`}>
                        {scan.score}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={getOverallStatus(scan.score)} />
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="font-mono text-xs text-feather/70"
                        title={new Date(scan.scannedAt).toUTCString()}
                      >
                        {formatTimestamp(scan.scannedAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          leftIcon={Eye}
                          aria-label={`View report for ${scan.url}`}
                          onClick={() => router.push(`/scan/${scan.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          isLoading={downloadingId === scan.id}
                          leftIcon={downloadingId === scan.id ? undefined : Download}
                          onClick={(e) => handleDownload(scan, e)}
                          aria-label={`Download PDF report for ${scan.url}`}
                        >
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          leftIcon={copiedId === scan.id ? Check : Share2}
                          onClick={(e) => handleShare(scan, e)}
                          aria-label={`Share link for ${scan.url}`}
                        >
                          {copiedId === scan.id ? "Copied!" : "Share"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List (<768px) */}
          <div className="md:hidden space-y-3">
            {scans.map((scan) => (
              <Card key={scan.id} padding="md" className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/scan/${scan.id}`}
                      className="font-mono text-sm text-bone font-medium truncate block hover:text-talon transition-colors"
                    >
                      {scan.url}
                    </Link>
                    <p className="font-mono text-xs text-feather/60 mt-0.5">
                      {formatTimestamp(scan.scannedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-mono text-lg font-bold ${getScoreColor(scan.score)}`}>
                      {scan.score}
                    </span>
                    <StatusBadge status={getOverallStatus(scan.score)} />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-1"
                    leftIcon={Eye}
                    onClick={() => router.push(`/scan/${scan.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    isLoading={downloadingId === scan.id}
                    leftIcon={downloadingId === scan.id ? undefined : Download}
                    onClick={(e) => handleDownload(scan, e)}
                  >
                    PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={copiedId === scan.id ? Check : Share2}
                    onClick={(e) => handleShare(scan, e)}
                  >
                    {copiedId === scan.id ? "Copied!" : "Share"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
