"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Download, Share2, Check } from "lucide-react";
import ScoreRing from "@/components/ScoreRing";
import ResultCard from "@/components/ResultCard";
import { Button, Badge } from "@/components/ui";
import { formatTimestamp } from "@/lib/mock-data";
import { getScanById } from "@/lib/scan-store";
import { exportScanReportPDF } from "@/lib/pdf-exporter";

export default function ScanResultPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "scan-001";
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // We fetch dynamically so that newly run scans show their real data instead of mock fallback
  const scan = getScanById(id);

  if (!scan) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="font-display text-2xl text-bone mb-2">Scan Not Found</h1>
        <p className="font-body text-feather mb-6">Could not locate the results for this security scan.</p>
        <Link href="/scan-history">
          <Button variant="primary">Return to History</Button>
        </Link>
      </div>
    );
  }

  async function handleDownloadPDF() {
    if (!scan) return;
    
    setDownloading(true);
    try {
      await exportScanReportPDF(scan);
    } finally {
      setDownloading(false);
    }
  }

  function handleShare() {
    if (!scan) return;
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/scan/${scan.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="px-4 py-8 sm:py-12 pb-20 max-w-5xl mx-auto min-w-0">
      <div className="space-y-8 min-w-0 w-full">
        {/* Back link */}
        <Link
          href="/scan-history"
          className="inline-flex items-center gap-1.5 font-body text-feather hover:text-bone text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Scan History
        </Link>

        {/* Hero: Score + URL */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-full min-w-0">
          <ScoreRing score={scan.score} size={160} />

          <div className="space-y-2 max-w-full min-w-0 px-2 sm:px-4">
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-full min-w-0">
              <h1
                className="font-mono text-xl sm:text-2xl text-bone font-medium break-all max-w-full leading-snug"
                title={scan.url}
              >
                {scan.url}
              </h1>
              <Badge
                variant={
                  scan.score >= 70
                    ? "pass"
                    : scan.score >= 40
                    ? "warning"
                    : "critical"
                }
                className="shrink-0"
              >
                {scan.score} / 100
              </Badge>
            </div>
            <p className="font-mono text-feather text-xs">
              Scanned {formatTimestamp(scan.scannedAt)}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              leftIcon={downloading ? undefined : Download}
              isLoading={downloading}
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
            <Button
              variant="ghost"
              size="md"
              leftIcon={copied ? Check : Share2}
              onClick={handleShare}
            >
              {copied ? "Link Copied!" : "Share Report"}
            </Button>
          </div>
        </div>

        {/* Result Cards */}
        <div className="space-y-4 min-w-0">
          <p className="font-mono text-xs text-feather/60 tracking-wider uppercase">
            SECURITY FINDINGS
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {scan.categories.map((cat, idx) => (
              <div
                key={cat.name}
                className="animate-fade-in-up"
                style={{ animationDelay: `${(idx + 1) * 80}ms` }}
              >
                <ResultCard
                  name={cat.name}
                  status={cat.status}
                  detail={cat.detail}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
