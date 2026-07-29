"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const errorMessages: Record<string, { title: string; detail: string }> = {
  "invalid-url": {
    title: "Invalid URL",
    detail: "The URL you entered could not be parsed. Check the format and try again — it should look like https://example.com.",
  },
  "scan-failed": {
    title: "Scan failed",
    detail: "Hawkeye could not reach the target or the scan timed out. The server may be down, blocking automated requests, or unreachable from our network.",
  },
  "not-found": {
    title: "Scan not found",
    detail: "No scan result matches this ID. It may have expired or the link is incorrect.",
  },
};

const defaultError = {
  title: "Something went wrong",
  detail: "An unexpected error occurred. Try again, or start a new scan from the home page.",
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "";
  const error = errorMessages[type] || defaultError;

  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 sm:py-32 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full border-2 border-critical/30 flex items-center justify-center mb-6">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          className="text-critical"
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

      <h1 className="font-display text-2xl sm:text-3xl mb-3">{error.title}</h1>
      <p className="text-feather text-sm max-w-md leading-relaxed mb-8">
        {error.detail}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="rounded-lg bg-talon text-ink font-display px-6 py-2.5 text-sm hover:bg-talon/90 transition-colors"
        >
          Scan a URL
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-ink-border text-feather font-body px-6 py-2.5 text-sm hover:text-bone hover:border-feather/30 transition-colors"
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
        <div className="flex items-center justify-center py-40">
          <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-signal animate-spin" />
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
