import Link from "next/link";

export default function CTASection() {
  return (
    <section className="px-5 sm:px-8 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-border bg-raised/80 px-6 sm:px-12 py-12 sm:py-16 text-center">
          {/* Eyebrow */}
          <p className="font-mono text-[11px] tracking-[0.25em] text-grid uppercase mb-4">
            SCAN::INITIATE
          </p>

          <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight mb-4">
            Know what your site
            <br />
            <span className="text-talon">is exposing</span>
          </h2>

          <p className="text-feather text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Run your first security scan in under a minute. No installation,
            no configuration — enter a URL and get results.
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center min-h-[44px] rounded-lg bg-talon px-8 py-3 font-display text-base uppercase tracking-wide text-deep hover:bg-talon/90 active:scale-[0.98] transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
