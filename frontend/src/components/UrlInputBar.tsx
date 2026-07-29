"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UrlInputBarProps {
  className?: string;
  size?: "default" | "large";
}

export default function UrlInputBar({ className = "", size = "default" }: UrlInputBarProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const isLarge = size === "large";

  function handleScan() {
    setError("");

    if (!url.trim()) {
      setError("Enter a URL to scan");
      return;
    }

    // Basic URL validation
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      if (!parsed.hostname.includes(".")) throw new Error();
    } catch {
      setError("Enter a valid URL, e.g. https://example.com");
      return;
    }

    // Navigate to scanning state
    router.push(`/scan/loading?url=${encodeURIComponent(url)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleScan();
  }

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`flex items-center gap-2 rounded-xl border bg-ink-raised transition-colors ${
          error ? "border-critical/50" : "border-ink-border focus-within:border-talon/60"
        } ${isLarge ? "p-2" : "p-1.5"}`}
      >
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com"
          className={`flex-1 bg-transparent font-mono text-bone placeholder:text-feather/50 outline-none ${
            isLarge ? "text-base px-4 py-3" : "text-sm px-3 py-2"
          }`}
          aria-label="URL to scan"
          aria-invalid={!!error}
        />
        <button
          onClick={handleScan}
          className={`shrink-0 rounded-lg bg-talon text-ink font-display tracking-wide transition-all hover:bg-talon/90 active:scale-[0.98] cursor-pointer ${
            isLarge ? "px-7 py-3 text-base" : "px-5 py-2 text-sm"
          }`}
        >
          Scan Now
        </button>
      </div>
      {error && (
        <p className="mt-2 text-critical text-xs font-body" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
