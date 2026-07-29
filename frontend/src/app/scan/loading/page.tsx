"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import StatusBadge from "@/components/StatusBadge";

function ScanningContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url") || "https://example.com";

  // Simulate scan completing after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/scan/scan-001");
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-32 sm:py-40">
      {/* Scanning animation */}
      <div className="relative mb-10">
        {/* Outer ring */}
        <div className="w-32 h-32 rounded-full border-2 border-signal/20 flex items-center justify-center">
          {/* Inner ring - spinning */}
          <div className="w-24 h-24 rounded-full border-2 border-transparent border-t-signal animate-spin" />
        </div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-signal animate-pulse-signal" />
        </div>
      </div>

      <StatusBadge status="scanning" className="mb-6" />

      <h1 className="font-display text-2xl sm:text-3xl text-center mb-3">
        Scanning target
      </h1>

      <p className="font-mono text-signal text-sm mb-8 break-all text-center max-w-md">
        {url}
      </p>

      <div className="space-y-2 text-center">
        <p className="text-feather text-sm">
          Checking HTTPS, headers, cookies, robots.txt, and tech stack…
        </p>
        <p className="text-feather/50 text-xs font-mono">
          This usually takes a few seconds
        </p>
      </div>
    </div>
  );
}

export default function ScanLoadingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-40">
          <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-signal animate-spin" />
        </div>
      }
    >
      <ScanningContent />
    </Suspense>
  );
}
