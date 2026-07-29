/**
 * @file Badge.tsx
 * @description Status badge component matching Hawkeye pass/warning/critical/signal status indicators.
 *
 * @example
 * ```tsx
 * <Badge variant="pass">98% Secure</Badge>
 * <Badge variant="signal">Scanning...</Badge>
 * ```
 */

import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Status variant controlling color palette and indicator */
  variant: "pass" | "warning" | "critical" | "signal";
  /** Whether to show colored status dot indicator */
  dot?: boolean;
  /** Label content */
  children: React.ReactNode;
}

const variantMap = {
  pass: {
    bg: "bg-pass/10",
    border: "border-pass/20",
    text: "text-pass",
    dot: "bg-pass",
  },
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/20",
    text: "text-warning",
    dot: "bg-warning",
  },
  critical: {
    bg: "bg-critical/10",
    border: "border-critical/20",
    text: "text-critical",
    dot: "bg-critical",
  },
  signal: {
    bg: "bg-cyan/10",
    border: "border-cyan/20",
    text: "text-cyan",
    dot: "bg-cyan animate-pulse-signal",
  },
};

export function Badge({
  variant,
  dot = true,
  children,
  className = "",
  ...props
}: BadgeProps) {
  const style = variantMap[variant];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-mono tracking-wide select-none
        ${style.bg} ${style.border} ${style.text}
        ${className}
      `}
      {...props}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${style.dot}`} />}
      <span>{children}</span>
    </span>
  );
}
