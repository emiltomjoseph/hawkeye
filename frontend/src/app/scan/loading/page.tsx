"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense, useState, useRef } from "react";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

function ScanningContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url");
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("Initializing scan...");
  
  const { user, isLoading } = useAuth();
  
  const scanStarted = useRef(false);

  useEffect(() => {
    // Only proceed if auth loading is done
    if (isLoading) return;
    
    // Redirect to login if not authenticated
    if (!user) {
      router.push(`/login?redirect=/scan/loading?url=${encodeURIComponent(url || '')}`);
      return;
    }

    if (!url) {
      setError("No URL provided");
      return;
    }

    // Prevent React StrictMode double-execution
    if (scanStarted.current) return;
    scanStarted.current = true;

    let pollInterval: NodeJS.Timeout;

    const startScan = async () => {
      try {
        setStatusText("Submitting to scanner engine...");
        const scanRecord = await api.scan.submit(url);
        
        setStatusText("Scanning target: HTTPS, headers, cookies, robots.txt, and tech stack...");
        
        // Poll for completion
        pollInterval = setInterval(async () => {
          try {
            const currentScan = await api.scan.get(scanRecord.id);
            if (currentScan.status === "completed") {
              clearInterval(pollInterval);
              router.push(`/scan/${scanRecord.id}`);
            } else if (currentScan.status === "failed") {
              clearInterval(pollInterval);
              setError("Scan failed to complete. Please try again.");
            }
          } catch (pollErr) {
            console.error("Error polling scan:", pollErr);
          }
        }, 2000);
        
      } catch (err: any) {
        console.error("Failed to start scan:", err);
        setError(err.message || "Failed to initiate scan");
      }
    };

    startScan();

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [url, router, user, isLoading]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-32 sm:py-40">
        <StatusBadge status="failed" className="mb-6" />
        <h1 className="font-display text-2xl sm:text-3xl text-center mb-3 text-red-500">
          Scan Error
        </h1>
        <p className="font-mono text-feather text-sm mb-8 break-all text-center max-w-md">
          {error}
        </p>
        <button 
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-signal/20 text-signal rounded hover:bg-signal/30 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-32 sm:py-40">
      {/* Scanning animation */}
      <div className="relative mb-10">
        <div className="w-32 h-32 rounded-full border-2 border-signal/20 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-transparent border-t-signal animate-spin" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-signal animate-pulse-signal" />
        </div>
      </div>

      <StatusBadge status="scanning" className="mb-6" />

      <h1 className="font-display text-2xl sm:text-3xl text-center mb-3">
        Scanning target
      </h1>

      <p className="font-mono text-signal text-sm mb-8 break-all text-center max-w-md">
        {url || "..."}
      </p>

      <div className="space-y-2 text-center max-w-md">
        <p className="text-feather text-sm">
          {statusText}
        </p>
        <p className="text-feather/50 text-xs font-mono">
          This usually takes a few seconds. Do not close this page.
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
