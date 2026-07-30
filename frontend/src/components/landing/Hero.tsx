import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-5 sm:px-8 pt-20 pb-20 sm:pt-28 sm:pb-28">
      {/* ── Soft Background Orbs ── */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-talon/10 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />
      
      <div className="relative mx-auto max-w-4xl text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-raised/50 border border-border/50 mb-6">
          <span className="flex w-2 h-2 rounded-full bg-pass animate-pulse"></span>
          <span className="font-mono text-xs tracking-wider text-muted uppercase">Scanner Online</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6 font-bold text-bone">
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center w-full sm:w-auto min-h-[48px] rounded-xl bg-talon px-8 py-3 font-body text-base font-medium text-bone shadow-lg shadow-talon/20 hover:bg-talon/90 active:scale-[0.98] transition-all"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full sm:w-auto min-h-[48px] rounded-xl border border-border bg-raised/30 px-8 py-3 font-body text-base font-medium text-bone hover:bg-raised/50 hover:border-feather/40 transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Hero visual — static ScoreRing preview */}
        <div className="mt-20 flex justify-center">
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
  const strokeWidth = 8;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative" aria-hidden="true">
      <div className="relative flex items-center justify-center rounded-full bg-raised/30 border border-border/50 p-6 shadow-2xl backdrop-blur-sm" style={{ width: size + 48, height: size + 48 }}>
        
        {/* Soft sweep glow */}
        <div
          className="absolute inset-4 rounded-full animate-sweep"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, var(--talon) 10deg, transparent 30deg)`,
            opacity: 0.1,
            filter: "blur(8px)"
          }}
        />

        {/* SVG Ring */}
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 drop-shadow-md">
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
          
          {/* Score label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-4xl font-bold text-pass leading-none drop-shadow-sm">{score}</span>
            <span className="font-body text-xs text-feather mt-1 font-medium">Score</span>
          </div>
        </div>
      </div>
    </div>
  );
}
