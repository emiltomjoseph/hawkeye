"use client";

interface StatusBadgeProps {
  status: "pass" | "warning" | "critical" | "scanning";
  className?: string;
}

const config = {
  pass: {
    dot: "bg-pass",
    text: "text-pass",
    bg: "bg-pass/10",
    border: "border-pass/20",
    label: "Pass",
  },
  warning: {
    dot: "bg-warning",
    text: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
    label: "Warning",
  },
  critical: {
    dot: "bg-critical",
    text: "text-critical",
    bg: "bg-critical/10",
    border: "border-critical/20",
    label: "Critical",
  },
  scanning: {
    dot: "bg-cyan animate-pulse-signal",
    text: "text-cyan",
    bg: "bg-cyan/10",
    border: "border-cyan/20",
    label: "Scanning",
  },
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const c = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-mono tracking-wide ${c.bg} ${c.border} ${c.text} ${className}`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
