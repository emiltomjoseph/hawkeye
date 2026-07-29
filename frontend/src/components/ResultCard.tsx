"use client";

import StatusBadge from "./StatusBadge";

interface ResultCardProps {
  name: string;
  status: "pass" | "warning" | "critical";
  detail: string;
  className?: string;
}

const icons: Record<string, string> = {
  "HTTPS / SSL": "🔒",
  "Security Headers": "🛡️",
  "Cookie Security": "🍪",
  "robots.txt / Sitemap": "🤖",
  "Tech Stack": "⚙️",
};

export default function ResultCard({ name, status, detail, className = "" }: ResultCardProps) {
  return (
    <div
      className={`rounded-lg border border-white/[0.08] bg-gradient-to-b from-[#101622] to-[#0b0e14] p-5 shadow-md shadow-black/50 transition-all hover:border-cyan/30 hover:shadow-lg hover:shadow-cyan/5 flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-lg" role="img" aria-hidden="true">
              {icons[name] || "📋"}
            </span>
            <h3 className="font-display text-bone text-base">{name}</h3>
          </div>
          <StatusBadge status={status} />
        </div>
        <p className="font-mono text-feather text-xs leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}
