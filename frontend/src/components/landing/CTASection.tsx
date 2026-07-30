import Link from "next/link";

export default function CTASection() {
  return (
    <section className="px-5 sm:px-8 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-border/50 bg-raised/40 px-6 sm:px-16 py-16 sm:py-20 text-center shadow-xl shadow-talon/5 backdrop-blur-md relative overflow-hidden">
          
          {/* Subtle background glow inside the card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-32 bg-talon/10 rounded-full blur-[60px] pointer-events-none"></div>

          {/* Eyebrow */}
          <p className="font-body text-sm font-semibold text-talon tracking-wide uppercase mb-4 relative z-10">
            Get Started
          </p>

          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-bone mb-6 relative z-10">
            Know what your site
            <br />
            <span className="text-talon">is exposing</span>
          </h2>

          <p className="text-feather text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed relative z-10">
            Run your first security scan in under a minute. No installation,
            no configuration — enter a URL and get results.
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center min-h-[52px] rounded-xl bg-talon px-10 py-3 font-body text-base font-medium text-bone shadow-lg shadow-talon/20 hover:bg-talon/90 active:scale-[0.98] transition-all relative z-10"
          >
            Start Scanning
          </Link>
        </div>
      </div>
    </section>
  );
}
