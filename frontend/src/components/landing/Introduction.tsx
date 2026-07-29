export default function Introduction() {
  return (
    <section className="px-5 sm:px-8 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        {/* Eyebrow */}
        <p className="font-mono text-[11px] tracking-[0.25em] text-grid uppercase mb-4">
          SCAN::OVERVIEW
        </p>

        <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight mb-5">
          What is Hawkeye
        </h2>

        <p className="text-feather text-base sm:text-lg leading-relaxed">
          Hawkeye is a web security assessment platform. Point it at any
          public website and it scans for common misconfigurations —
          weak TLS, missing security headers, insecure cookies, exposed
          paths, outdated software. It reports every finding and rolls
          them into a single security score you can track over time.
        </p>
      </div>
    </section>
  );
}
