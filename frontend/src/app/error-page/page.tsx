"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const errorMessages: Record<string, { title: string; detail: string; code: string }> = {
  "invalid-url": {
    title: "Invalid URL",
    detail: "The URL you entered could not be parsed. Check the format and try again — it should look like https://example.com.",
    code: "ERR::PARSE_FAIL",
  },
  "scan-failed": {
    title: "Scan failed",
    detail: "Hawkeye could not reach the target or the scan timed out. The server may be down, blocking automated requests, or unreachable from our network.",
    code: "ERR::SCAN_TIMEOUT",
  },
  "not-found": {
    title: "Scan not found",
    detail: "No scan result matches this ID. It may have expired or the link is incorrect.",
    code: "ERR::NO_MATCH",
  },
};

const defaultError = {
  title: "Something went wrong",
  detail: "An unexpected error occurred. Try again, or start a new scan from the home page.",
  code: "ERR::UNKNOWN",
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "";
  const error = errorMessages[type] || defaultError;

  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 sm:py-32 text-center min-h-[70vh]">
      {/* Tactical error code */}
      <p className="font-mono text-[10px] tracking-[0.3em] text-critical/50 uppercase mb-5">
        {error.code}
      </p>

      {/* Icon */}
      <div className="relative w-20 h-20 rounded-full border-2 border-critical/20 flex items-center justify-center mb-8">
        {/* Pulsing ring */}
        <div
          className="absolute inset-0 rounded-full animate-radar-pulse"
          style={{
            border: "1px solid",
            borderColor: "color-mix(in srgb, var(--critical) 15%, transparent)",
          }}
          aria-hidden="true"
        />
        <svg
          width="32"
          height="32"
          viewBox="0 0 28 28"
          fill="none"
          className="text-critical"
          aria-hidden="true"
        >
          <path
            d="M14 8v8m0 4h.01"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-tight mb-3">
        {error.title}
      </h1>

      <p className="text-feather text-sm sm:text-base max-w-md leading-relaxed mb-10">
        {error.detail}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-[44px] rounded-lg bg-talon px-8 py-3 font-display text-base uppercase tracking-wide text-deep hover:bg-talon/90 active:scale-[0.98] transition-all"
        >
          Scan a URL
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center min-h-[44px] rounded-lg border border-border px-8 py-3 font-body text-sm font-medium text-feather hover:text-bone hover:border-feather/40 transition-colors"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-40" role="status">
          <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-talon animate-spin" />
          <span className="sr-only">Loading…</span>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
