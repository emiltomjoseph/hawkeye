import Link from "next/link";

export default function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-dusk/70 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 28 28"
              fill="none"
              className="text-talon sm:w-[26px] sm:h-[26px] drop-shadow-sm"
              aria-hidden="true"
            >
              <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="14" cy="14" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="14" cy="14" r="2" fill="currentColor" />
            </svg>
            <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-bone group-hover:text-talon transition-colors">
              Hawkeye
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center min-h-[40px] rounded-xl px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-body font-medium text-feather hover:text-bone hover:bg-raised/50 transition-colors shrink-0"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center min-h-[40px] rounded-xl bg-talon px-4 sm:px-5 py-1.5 text-xs sm:text-sm font-body font-medium text-bone shadow-md shadow-talon/20 hover:bg-talon/90 active:scale-[0.98] transition-all shrink-0"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
