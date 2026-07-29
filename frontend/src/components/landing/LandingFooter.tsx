import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-border/40 px-5 sm:px-8 py-10">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 28 28"
            fill="none"
            className="text-feather/60"
            aria-hidden="true"
          >
            <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2" />
            <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="14" cy="14" r="1.5" fill="currentColor" />
          </svg>
          <span className="font-display text-sm uppercase tracking-wider text-feather/60">
            Hawkeye
          </span>
        </div>

        {/* Nav */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Link href="#features" className="inline-flex items-center min-h-[44px] px-2 text-feather/60 text-xs hover:text-bone transition-colors">
            Features
          </Link>
          <Link href="#about" className="inline-flex items-center min-h-[44px] px-2 text-feather/60 text-xs hover:text-bone transition-colors">
            About
          </Link>
          <Link href="/login" className="inline-flex items-center min-h-[44px] px-2 text-feather/60 text-xs hover:text-bone transition-colors">
            Sign In
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-feather/40 text-xs font-mono">
          © {new Date().getFullYear()} Hawkeye
        </p>
      </div>
    </footer>
  );
}
