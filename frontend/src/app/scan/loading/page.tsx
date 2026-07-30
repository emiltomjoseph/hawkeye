"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import StatusBadge from "@/components/StatusBadge";

const scanSteps = [
  { label: "Resolving DNS", code: "DNS" },
  { label: "Checking HTTPS/SSL certificate", code: "SSL" },
  { label: "Analyzing security headers", code: "HEADERS" },
  { label: "Inspecting cookie security", code: "COOKIES" },
  { label: "Scanning robots.txt", code: "ROBOTS" },
  { label: "Detecting tech stack", code: "TECH" },
  { label: "Calculating security score", code: "SCORE" },
];

function ScanningContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url") || "https://example.com";
  const [currentStep, setCurrentStep] = useState(0);

  // Animate through scan steps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= scanSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 550);
    return () => clearInterval(interval);
  }, []);

  // Navigate to results after all steps complete
  useEffect(() => {
    if (currentStep >= scanSteps.length - 1) {
      const timer = setTimeout(() => {
        router.push("/scan/scan-001");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentStep, router]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 sm:py-32">
      {/* Scanning animation */}
      <div className="relative mb-10">
        {/* Outer ring */}
        <div className="w-32 h-32 rounded-full border-2 border-talon/20 flex items-center justify-center">
          {/* Sweep ring */}
          <div
            className="absolute inset-0 rounded-full animate-sweep"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, var(--talon) 4deg, transparent 8deg)",
              opacity: 0.15,
            }}
          />
          {/* Inner ring - spinning */}
          <div className="w-24 h-24 rounded-full border-2 border-transparent border-t-talon animate-spin" />
        </div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-talon animate-pulse-signal" />
        </div>
      </div>

      <StatusBadge status="scanning" className="mb-6" />

      <h1 className="font-display text-2xl sm:text-3xl text-center mb-3">
        Scanning target
      </h1>

      <p className="font-mono text-talon text-sm mb-10 break-all text-center max-w-md">
        {url}
      </p>

      {/* Scan progress steps */}
      <div className="w-full max-w-sm space-y-2">
        {scanSteps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={step.code}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-md text-sm font-body transition-all duration-300
                ${isComplete ? "text-pass/70" : ""}
                ${isCurrent ? "text-talon bg-talon/5 border border-talon/20" : ""}
                ${!isComplete && !isCurrent ? "text-feather/30" : ""}
              `}
            >
              {/* Status indicator */}
              <div className="w-5 flex items-center justify-center shrink-0">
                {isComplete && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="text-pass"
                  >
                    <path
                      d="M3 7l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {isCurrent && (
                  <div className="w-2 h-2 rounded-full bg-talon animate-pulse-signal" />
                )}
                {!isComplete && !isCurrent && (
                  <div className="w-1.5 h-1.5 rounded-full bg-feather/20" />
                )}
              </div>

              {/* Step label */}
              <span className={isCurrent ? "font-medium" : ""}>
                {step.label}
              </span>

              {/* Step code */}
              <span className="ml-auto font-mono text-[10px] tracking-wider opacity-50">
                {step.code}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-feather/50 text-xs font-mono mt-8">
        This usually takes a few seconds
      </p>
    </div>
  );
}

export default function ScanLoadingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-40">
          <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-talon animate-spin" />
        </div>
      }
    >
      <ScanningContent />
    </Suspense>
  );
}
