"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Globe, ArrowRight, RefreshCw, ArrowLeft, RotateCcw } from "lucide-react";
import { Button, Input, Card, Badge, Spinner, Alert } from "@/components/ui";
import ScoreRing from "@/components/ScoreRing";
import { mockScanResult, type ScanResult } from "@/lib/mock-data";

type ScanState = "idle" | "scanning" | "success" | "error";

/**
 * Mock security scan service.
 * Swap this single function for a real API call when the backend is ready.
 * Signature: submitScan(url: string): Promise<ScanResult>
 */
async function submitScan(url: string): Promise<ScanResult> {
  // Realistic delay: 2.5 seconds
  await new Promise((resolve) => setTimeout(resolve, 2500));

  // Reliably testable failure path: use https://fail-test.com
  // Also randomly fails ~10% of the time to demonstrate the error flow
  const isReliableFailure = url.includes("fail-test.com");
  const isRandomFailure = !isReliableFailure && Math.random() < 0.1;

  if (isReliableFailure || isRandomFailure) {
    throw new Error(
      isReliableFailure
        ? "Target host unreachable or DNS resolution failed."
        : "Connection timed out. The target did not respond within 30 seconds."
    );
  }

  // Normalize to full URL for display in result
  const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return {
    ...mockScanResult,
    url: normalizedUrl,
    scannedAt: new Date().toISOString(),
  };
}

export default function NewScanPage() {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | undefined>();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [srAnnouncement, setSrAnnouncement] = useState<string>("");

  // Ref for autofocus — applied when idle state mounts or resets to idle
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scanState === "idle" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [scanState]);

  /* ── Validation helpers ── */
  function getValidationError(val: string): string | undefined {
    const trimmed = val.trim();
    if (!trimmed) return "Please enter a target URL.";

    // Auto-prepend https:// for bare domains
    let normalized = trimmed;
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`;
    }

    try {
      const parsed = new URL(normalized);
      // Only allow http / https — reject ftp://, javascript:, etc.
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return "URL must use http:// or https:// protocol.";
      }
      // Must have a real hostname with a dot
      if (!parsed.hostname || !parsed.hostname.includes(".")) {
        return "Please enter a valid URL (e.g. https://example.com).";
      }
    } catch {
      return "Please enter a valid URL or domain (e.g. https://example.com).";
    }

    return undefined;
  }

  function isValidUrl(val: string): boolean {
    return getValidationError(val) === undefined;
  }

  /* ── Event handlers ── */
  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setUrlInput(val);
    // Clear error eagerly as user types toward a valid value
    if (urlError && (isValidUrl(val) || !val.trim())) {
      setUrlError(undefined);
    }
  }

  function handleBlur() {
    // Validate on blur so users get feedback before hitting the button
    if (urlInput.trim()) {
      setUrlError(getValidationError(urlInput));
    }
  }

  async function handleStartScan(e: React.FormEvent) {
    e.preventDefault();

    const error = getValidationError(urlInput);
    if (error) {
      setUrlError(error);
      return;
    }

    setUrlError(undefined);
    setErrorMessage(null);
    setScanState("scanning");
    setSrAnnouncement(`Security scan initiated for ${urlInput.trim()}. Please wait.`);

    try {
      const result = await submitScan(urlInput.trim());
      setScanResult(result);
      setScanState("success");
      setSrAnnouncement(
        `Scan completed for ${urlInput.trim()}. Security score: ${result.score} out of 100.`
      );
    } catch (err) {
      const errText =
        err instanceof Error ? err.message : "Scan failed unexpectedly.";
      setErrorMessage(errText);
      setScanState("error");
      setSrAnnouncement(`Scan failed for ${urlInput.trim()}. ${errText}`);
    }
  }

  /** Full reset — clears URL and returns to idle (used by "Run Another Scan") */
  function handleFullReset() {
    setUrlInput("");
    setUrlError(undefined);
    setErrorMessage(null);
    setScanResult(null);
    setScanState("idle");
    setSrAnnouncement("Scan form reset. Ready for new target URL.");
  }

  /** Error retry — keeps the URL so users can re-submit without retyping */
  function handleRetryFromError() {
    setErrorMessage(null);
    setScanResult(null);
    setScanState("idle");
    setSrAnnouncement("Ready to retry. URL preserved — click Scan Now when ready.");
  }

  const isButtonDisabled =
    !urlInput.trim() || !!urlError || scanState === "scanning";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {srAnnouncement}
      </div>

      {/* ── Page Header ── */}
      <header>
        <p className="font-mono text-xs text-feather/60 tracking-widest mb-1">
          SCAN::NEW
        </p>
        <h1 className="font-display text-3xl lg:text-4xl text-bone tracking-wide">
          NEW SCAN
        </h1>
        <p className="font-body text-sm text-feather mt-1">
          Enter a URL to run a security assessment.
        </p>
      </header>

      {/* ── Panel Container ── */}
      <div
        className={`
          relative overflow-hidden rounded-xl p-6 sm:p-10 transition-all bg-gradient-to-b from-[#101622]/90 to-[#0b0e14]/95 shadow-2xl shadow-black/80
          ${
            scanState === "success"
              ? "border border-white/[0.08]"
              : scanState === "error"
              ? "border border-dashed border-critical/40"
              : "border border-dashed border-white/[0.12]"
          }
        `}
      >
        {/* Ambient Cyan Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />

        {/* ── 1. IDLE STATE ── */}
        {scanState === "idle" && (
          <form onSubmit={handleStartScan} noValidate className="max-w-xl mx-auto space-y-6">
            <Input
              ref={inputRef}
              label="Target Website URL"
              id="target-url-input"
              type="url"
              icon={Globe}
              placeholder="https://example.com"
              value={urlInput}
              onChange={handleUrlChange}
              onBlur={handleBlur}
              error={urlError}
              aria-describedby={urlError ? "url-error" : "url-hint"}
              aria-invalid={!!urlError}
              autoComplete="url"
              spellCheck={false}
              helperText={
                !urlError
                  ? "Public domains and web apps only. Try https://fail-test.com to test error handling."
                  : undefined
              }
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 font-body text-sm text-feather hover:text-bone transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isButtonDisabled}
                rightIcon={ArrowRight}
                className="w-full sm:w-auto uppercase font-display"
                aria-label={
                  !urlInput.trim()
                    ? "Enter a URL first"
                    : urlError
                    ? "Fix URL error before scanning"
                    : "Scan Now"
                }
              >
                Scan Now
              </Button>
            </div>
          </form>
        )}

        {/* ── 2. SCANNING STATE ── */}
        {scanState === "scanning" && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 relative">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-28 h-28 rounded-full border border-cyan/30 animate-radar-pulse" />
              <div className="absolute w-20 h-20 rounded-full border border-neon/20 animate-ping" />
              <Spinner size="lg" label="Scan in progress" />
            </div>

            <div className="space-y-2 relative z-10">
              <Badge variant="signal">SCANNING IN PROGRESS</Badge>
              <p className="font-mono text-lg text-bone tracking-wide break-all px-4">
                {urlInput.trim()}
              </p>
            </div>

            <p className="font-mono text-xs text-cyan animate-pulse">
              Executing probes: HTTPS/SSL, Security Headers, Cookie Flags...
            </p>
          </div>
        )}

        {/* ── 3. SUCCESS STATE ── */}
        {scanState === "success" && scanResult && (
          <div className="space-y-8 min-w-0 w-full animate-fade-in-up">
            {/* Summary Banner */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8 border-b border-border/60 pb-8 min-w-0 w-full">
              <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-10 min-w-0 flex-1 w-full text-center sm:text-left">
                <div className="shrink-0 flex items-center justify-center">
                  <ScoreRing score={scanResult.score} size={110} />
                </div>
                <div className="min-w-0 flex-1 w-full space-y-2">
                  <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-3 min-w-0 w-full">
                    <h2
                      className="font-mono text-lg sm:text-xl text-bone font-medium break-all max-w-full leading-snug"
                      title={scanResult.url}
                    >
                      {scanResult.url}
                    </h2>
                    <Badge
                      variant={
                        scanResult.score >= 70
                          ? "pass"
                          : scanResult.score >= 40
                          ? "warning"
                          : "critical"
                      }
                      className="shrink-0"
                    >
                      {scanResult.score} / 100
                    </Badge>
                  </div>
                  <p className="font-body text-xs text-feather truncate">
                    Scanned just now • 5 security modules checked
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-center lg:justify-end shrink-0">
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={RefreshCw}
                  onClick={handleFullReset}
                >
                  Run Another Scan
                </Button>
                <Link href={`/scan/${scanResult.id}`}>
                  <Button variant="primary" size="md" rightIcon={ArrowRight}>
                    View Full Report
                  </Button>
                </Link>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-4 min-w-0">
              <p className="font-mono text-xs text-feather/60 tracking-wider uppercase">
                SECURITY BREAKDOWN
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                {scanResult.categories.map((cat, idx) => (
                  <div
                    key={cat.name}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${(idx + 1) * 80}ms` }}
                  >
                    <Card padding="md" hover className="h-full flex flex-col justify-between">
                      <Card.Header
                        title={cat.name}
                        action={
                          <Badge
                            variant={
                              cat.status === "pass"
                                ? "pass"
                                : cat.status === "warning"
                                ? "warning"
                                : "critical"
                            }
                          >
                            {cat.status.toUpperCase()}
                          </Badge>
                        }
                      />
                      <Card.Body className="flex-1 flex flex-col justify-between">
                        <p className="font-mono text-xs text-feather/80 leading-relaxed">
                          {cat.detail}
                        </p>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 4. ERROR STATE ── */}
        {scanState === "error" && (
          <div className="py-6 max-w-lg mx-auto space-y-6">
            <Alert variant="error" title="Scan Failed">
              <p>{errorMessage || "An unexpected error occurred while probing the target URL."}</p>
              {urlInput.trim() && (
                <p className="font-mono text-xs mt-2 opacity-70 break-all">
                  Target: {urlInput.trim()}
                </p>
              )}
            </Alert>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                leftIcon={RotateCcw}
                onClick={handleRetryFromError}
              >
                Try Again
              </Button>
              <Button
                variant="secondary"
                size="md"
                leftIcon={ArrowLeft}
                onClick={handleFullReset}
              >
                Start Fresh
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
