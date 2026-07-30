export default function Introduction() {
  return (
    <section className="px-5 sm:px-8 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        {/* Eyebrow */}
        <p className="font-body text-sm font-semibold text-talon tracking-wide uppercase mb-3">
          Platform Overview
        </p>

        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-bone mb-6">
          What is Hawkeye?
        </h2>

        <p className="text-feather text-lg sm:text-xl leading-relaxed">
          Hawkeye is a web security assessment platform. Point it at any
          public website and it scans for common misconfigurations —
          weak TLS, missing security headers, insecure cookies, exposed
          paths, and outdated software. It reports every finding and rolls
          them into a single security score you can track over time.
        </p>
      </div>
    </section>
  );
}
