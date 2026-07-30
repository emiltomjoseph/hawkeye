"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Share2, Check } from "lucide-react";
import ScoreRing from "@/components/ScoreRing";
import ResultCard from "@/components/ResultCard";
import { Button, Badge } from "@/components/ui";
import { formatTimestamp } from "@/lib/mock-data";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

export default function ScanResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";
  
  const { user, isLoading: authLoading } = useAuth();
  
  const [scan, setScan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push(`/login?redirect=/scan/${id}`);
      return;
    }

    if (!id) {
      setError("Invalid scan ID");
      setLoading(false);
      return;
    }

    const fetchScan = async () => {
      try {
        const data = await api.scan.get(id);
        setScan(data);
      } catch (err: any) {
        console.error("Failed to load scan:", err);
        setError(err.message || "Scan not found or you don't have access.");
      } finally {
        setLoading(false);
      }
    };

    fetchScan();
  }, [id, user, authLoading, router]);

  async function handleDownloadPDF() {
    if (!scan) return;
    
    setDownloading(true);
    try {
      const blob = await api.report.download(scan.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hawkeye_report_${scan.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download report:", err);
      alert("Failed to download PDF report. Please try again later.");
    } finally {
      setDownloading(false);
    }
  }

  function handleShare() {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/scan/${scan?.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-signal animate-spin" />
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-32 text-center">
        <h1 className="text-2xl text-red-500 mb-4">Error loading scan result</h1>
        <p className="text-feather mb-8">{error}</p>
        <Button onClick={() => router.push("/history")}>Back to History</Button>
      </div>
    );
  }

  // Map backend JSON structures to ResultCard categories
  const categories = [
    {
      name: "HTTPS & HSTS",
      status: scan.result?.https_status?.available ? "pass" : "fail",
      detail: scan.result?.https_status?.available ? "HTTPS is enabled" : "HTTPS not available",
    },
    {
      name: "SSL Certificate",
      status: scan.result?.ssl_details?.is_valid ? "pass" : "fail",
      detail: scan.result?.ssl_details?.issuer ? `Issued by ${scan.result.ssl_details.issuer}` : "Invalid SSL",
    },
    {
      name: "Security Headers",
      status: scan.result?.security_headers?.["Strict-Transport-Security"]?.present ? "pass" : "warning",
      detail: "HSTS header is " + (scan.result?.security_headers?.["Strict-Transport-Security"]?.present ? "present" : "missing"),
    },
    {
      name: "Cookies Security",
      status: "info",
      detail: scan.result?.cookies?.length ? `${scan.result.cookies.length} cookies detected` : "No cookies detected",
    },
  ];

  const score = scan.security_score || 0;

  return (
    <div className="px-4 py-8 sm:py-12 pb-20 max-w-5xl mx-auto min-w-0">
      <div className="space-y-8 min-w-0 w-full">
        {/* Back link */}
        <Link
          href="/history"
          className="inline-flex items-center gap-1.5 font-body text-feather hover:text-bone text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Scan History
        </Link>

        {/* Hero: Score + URL */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-full min-w-0">
          <ScoreRing score={score} size={160} />

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
                  score >= 70
                    ? "pass"
                    : score >= 40
                    ? "warning"
                    : "critical"
                }
                className="shrink-0"
              >
                {score} / 100
              </Badge>
            </div>
            <p className="font-mono text-feather text-xs">
              Scanned {new Date(scan.created_at).toLocaleString()}
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

        {/* Recommendations */}
        {scan.result?.recommendations && scan.result.recommendations.length > 0 && (
          <div className="space-y-4 min-w-0 mt-8 bg-surface p-6 rounded-lg border border-border">
            <p className="font-mono text-xs text-feather/60 tracking-wider uppercase mb-4">
              ACTIONABLE RECOMMENDATIONS
            </p>
            <ul className="list-disc list-inside space-y-2 text-feather text-sm">
              {scan.result.recommendations.map((rec: string, idx: number) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Result Cards */}
        <div className="space-y-4 min-w-0 mt-8">
          <p className="font-mono text-xs text-feather/60 tracking-wider uppercase">
            SECURITY FINDINGS
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {categories.map((cat, idx) => (
              <div
                key={cat.name}
                className="animate-fade-in-up"
                style={{ animationDelay: `${(idx + 1) * 80}ms` }}
              >
                <ResultCard
                  name={cat.name}
                  status={cat.status as any}
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
