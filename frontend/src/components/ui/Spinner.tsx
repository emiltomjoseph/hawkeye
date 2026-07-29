/**
 * @file Spinner.tsx
 * @description Rotating loading indicator styled with the Hawkeye grid accent color.
 *
 * @example
 * ```tsx
 * <Spinner size="md" label="Analyzing target..." />
 * ```
 */

import React from "react";

export interface SpinnerProps {
  /** Size variant of the spinner */
  size?: "sm" | "md" | "lg";
  /** Visually hidden text for screen readers */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-3",
};

export function Spinner({
  size = "md",
  label = "Loading",
  className = "",
}: SpinnerProps) {
  return (
    <div
      role="status"
      className={`inline-flex items-center justify-center ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-grid border-t-transparent ${sizeMap[size]}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
