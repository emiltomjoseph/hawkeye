/**
 * Skeleton loading components for consistent loading states across the app.
 * Provides shimmer animation effect for a polished loading experience.
 */

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-border/40 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ className = "" }: SkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

export function SkeletonCard({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-raised/60 p-5 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-10 h-10 rounded-md" />
        <Skeleton className="w-16 h-4" />
      </div>
      <Skeleton className="h-5 w-2/3 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-raised/80 px-4 py-3 flex gap-4 border-b border-border">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="h-4 w-1/6" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="px-4 py-3 flex gap-4 border-b border-border/50 last:border-b-0"
        >
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-fade-in-up" role="status" aria-label="Loading dashboard">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-raised/60 p-5">
            <Skeleton className="w-8 h-8 rounded-md mb-3" />
            <Skeleton className="h-7 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <SkeletonTable rows={5} />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
