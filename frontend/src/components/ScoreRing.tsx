"use client";

import React from "react";

export interface ScoreRingProps {
  /** Numerical score (0-100) */
  score: number;
  /** Diameter of the SVG ring in pixels (default: 140) */
  size?: number;
  /** Explicitly toggle label text under score (default: auto true for size >= 90) */
  showLabel?: boolean;
  /** Explicitly toggle viewfinder corner brackets (default: false for compact, true for >= 140) */
  showViewfinder?: boolean;
  /** Additional CSS classes */
  className?: string;
}

function getScoreColorHex(score: number): string {
  if (score >= 70) return "var(--pass)";
  if (score >= 40) return "var(--talon)";
  return "var(--critical)";
}

function getScoreLabel(score: number): string {
  if (score >= 70) return "Good";
  if (score >= 40) return "Needs work";
  return "Critical";
}

export default function ScoreRing({
  score,
  size = 140,
  showLabel,
  showViewfinder,
  className = "",
}: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = React.useState(0);

  React.useEffect(() => {
    let animationFrameId: number;
    const duration = 900;
    const startTime = performance.now();

    function updateScore(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progressRatio, 3);
      setAnimatedScore(Math.round(easeOut * score));

      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(updateScore);
      }
    }

    animationFrameId = requestAnimationFrame(updateScore);
    return () => cancelAnimationFrame(animationFrameId);
  }, [score]);

  const strokeWidth = Math.max(4, Math.round(size * 0.055));
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (Math.min(Math.max(animatedScore, 0), 100) / 100) * circumference;
  const center = size / 2;
  const color = getScoreColorHex(score);
  const label = getScoreLabel(score);

  // Auto label visibility for sizes >= 90
  const shouldShowLabel = showLabel ?? size >= 90;
  const renderViewfinder = showViewfinder ?? size >= 140;

  // Proportional typography sizing
  const numeralFontSize = Math.max(12, Math.round(size * 0.31));
  const labelFontSize = Math.max(8, Math.round(size * 0.11));

  const ringSvg = (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      {/* SVG Ring */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 block filter drop-shadow-[0_0_10px_rgba(0,229,255,0.25)]"
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease-out, stroke 0.3s ease" }}
        />
      </svg>

      {/* Score Text Overlay — Centered Flexbox */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center px-1">
        <span
          className="font-mono font-bold leading-none tracking-tight filter drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]"
          style={{ fontSize: `${numeralFontSize}px`, color }}
        >
          {animatedScore}
        </span>
        {shouldShowLabel && (
          <span
            className="text-feather mt-1 font-body leading-none uppercase tracking-wider font-medium truncate max-w-[85%]"
            style={{ fontSize: `${labelFontSize}px` }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );

  if (renderViewfinder) {
    const pad = 12;
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <div
          className="relative flex items-center justify-center"
          style={{ width: size + pad * 2, height: size + pad * 2 }}
        >
          {/* Top-left bracket */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-talon/60" />
          {/* Bottom-right bracket */}
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-talon/60" />
          {ringSvg}
        </div>
      </div>
    );
  }

  return <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>{ringSvg}</div>;
}
