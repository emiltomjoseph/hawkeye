import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 sm:py-32 text-center min-h-screen relative overflow-hidden">
      {/* Background radar sweep effect */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full animate-radar-pulse opacity-[0.03]"
        style={{
          background:
            "radial-gradient(circle, var(--talon) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Crosshair decoration */}
      <div className="relative mb-8" aria-hidden="true">
        <div className="w-24 h-24 border border-border/40 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 border border-border/30 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-critical/60 rounded-full animate-pulse-signal" />
          </div>
          {/* Crosshair lines */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-border/20 -translate-y-1/2" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border/20 -translate-x-1/2" />
        </div>
      </div>

      {/* Error code */}
      <p className="font-mono text-xs tracking-[0.3em] text-critical/60 uppercase mb-3">
        ERR::TARGET_NOT_FOUND
      </p>

      <span className="font-display text-7xl sm:text-8xl text-feather/10 mb-2 leading-none">
        404
      </span>

      <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-tight mb-3">
        Target Lost
      </h1>

      <p className="text-feather text-sm sm:text-base max-w-md mb-10 leading-relaxed">
        The page you&apos;re looking for has moved, been removed, or never
        existed. Double-check the URL or return to base.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-[44px] rounded-lg bg-talon px-8 py-3 font-display text-base uppercase tracking-wide text-deep hover:bg-talon/90 active:scale-[0.98] transition-all"
        >
          Return Home
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center min-h-[44px] rounded-lg border border-border px-8 py-3 font-body text-sm font-medium text-feather hover:text-bone hover:border-feather/40 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
