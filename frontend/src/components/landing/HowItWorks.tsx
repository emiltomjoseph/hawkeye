const steps = [
  {
    step: "01",
    title: "Enter a URL",
    description:
      "Paste any public website URL into the scanner. No sign-up required to run your first scan.",
  },
  {
    step: "02",
    title: "Automated analysis",
    description:
      "Hawkeye runs 6+ security checks — SSL/TLS, headers, cookies, robots.txt, tech stack, and more.",
  },
  {
    step: "03",
    title: "Get your report",
    description:
      "Receive a detailed security report with findings, risk levels, and an overall score. Export as PDF.",
  },
];

export default function HowItWorks() {
  return (
    <section id="about" className="px-5 sm:px-8 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        {/* Section heading */}
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] tracking-[0.25em] text-grid uppercase mb-4">
            FLOW::SEQUENCE
          </p>
          <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight">
            How it works
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div
            className="absolute left-6 top-8 bottom-8 w-px bg-border/40 hidden sm:block"
            aria-hidden="true"
          />

          <div className="space-y-8 sm:space-y-10">
            {steps.map((item, index) => (
              <div key={item.step} className="flex gap-5 sm:gap-8 items-start">
                {/* Step number */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-lg border border-border bg-raised flex items-center justify-center">
                    <span className="font-mono text-sm text-talon font-medium">
                      {item.step}
                    </span>
                  </div>
                  {/* Dot on the connecting line */}
                  {index < steps.length - 1 && (
                    <div
                      className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-border/60 hidden sm:block"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pt-1">
                  <h3 className="font-display text-lg sm:text-xl uppercase tracking-wide text-bone mb-2">
                    {item.title}
                  </h3>
                  <p className="text-feather text-sm sm:text-base leading-relaxed max-w-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
