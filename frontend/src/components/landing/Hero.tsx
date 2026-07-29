import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-5 sm:px-8 pt-20 pb-20 sm:pt-28 sm:pb-28">
      {/* ── Crosshair decorative lines ── */}
      {/* Horizontal */}
      <div
        className="absolute left-0 right-0 top-1/2 h-px bg-grid/[0.08] -translate-y-1/2 pointer-events-none hidden sm:block"
        aria-hidden="true"
      />
      {/* Vertical */}
      <div
        className="absolute top-0 bottom-0 left-1/2 w-px bg-grid/[0.08] -translate-x-1/2 pointer-events-none hidden sm:block"
        aria-hidden="true"
      />
      {/* Center crosshair intersection — small diamond */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border border-grid/20 rotate-45 pointer-events-none hidden sm:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Eyebrow */}
        <p className="font-mono text-xs tracking-[0.3em] text-grid uppercase mb-5">
          Target Acquired
        </p>

        {/* Headline */}
        <h1 className="font-display text-3xl sm:text-6xl lg:text-7xl uppercase leading-[0.95] tracking-tight mb-6">
          Full security assessment
          <br />
          <span className="text-talon">for any website</span>
        </h1>

        {/* Subhead */}
        <p className="font-body text-feather text-sm sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
          Submit a URL. Hawkeye scans HTTPS configuration, security headers,
          cookies, exposed paths, and tech stack — then delivers a full
          report with a single security score.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center w-full sm:w-auto min-h-[44px] rounded-lg bg-talon px-8 py-3 font-display text-base uppercase tracking-wide text-deep hover:bg-talon/90 active:scale-[0.98] transition-all"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full sm:w-auto min-h-[44px] rounded-lg border border-border px-8 py-3 font-body text-sm font-medium text-feather hover:text-bone hover:border-feather/40 transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Hero visual — static ScoreRing preview */}
        <div className="mt-16 flex justify-center">
          <HeroScoreVisual />
        </div>
      </div>
    </section>
  );
}

/** Static score ring preview — decorative showcase of what Hawkeye produces */
function HeroScoreVisual() {
  const score = 85;
  const size = 160;
  const strokeWidth = 6;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative" aria-hidden="true">
      {/* Viewfinder brackets */}
      <div className="relative" style={{ width: size + 32, height: size + 32 }}>
        {/* Top-left bracket */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-talon" />
        {/* Bottom-right bracket */}
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-talon" />

        {/* Sweep ring — single animated element */}
        <div
          className="absolute inset-2 rounded-full animate-sweep"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, var(--grid) 4deg, transparent 8deg)`,
            opacity: 0.12,
          }}
        />

        {/* SVG Ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke="var(--border)" strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke="var(--pass)" strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Score label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-4xl text-pass leading-none">{score}</span>
          <span className="font-mono text-[10px] text-feather mt-1 tracking-wider uppercase">Score</span>
        </div>
      </div>
    </div>
  );
}
