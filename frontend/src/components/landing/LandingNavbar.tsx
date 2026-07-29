import Link from "next/link";

export default function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-dusk/70 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 28 28"
              fill="none"
              className="text-talon sm:w-[26px] sm:h-[26px]"
              aria-hidden="true"
            >
              <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2" />
              <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="14" cy="14" r="1.5" fill="currentColor" />
              <line x1="14" y1="0" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5" />
              <line x1="14" y1="22" x2="14" y2="28" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="14" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" />
              <line x1="22" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="font-display text-lg sm:text-xl uppercase tracking-wider text-bone group-hover:text-talon transition-colors">
              Hawkeye
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center min-h-[44px] rounded-lg px-2.5 sm:px-4 py-1.5 text-xs sm:text-sm font-body font-medium text-feather hover:text-bone border border-transparent hover:border-border transition-colors shrink-0"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center min-h-[44px] rounded-lg bg-talon px-3 sm:px-5 py-1.5 text-xs sm:text-sm font-display uppercase tracking-wide text-deep hover:bg-talon/90 active:scale-[0.98] transition-all shrink-0"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
