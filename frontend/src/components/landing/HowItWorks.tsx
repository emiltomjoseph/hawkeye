const steps = [
  {
    step: "1",
    title: "Enter a URL",
    description:
      "Paste any public website URL into the scanner. No sign-up required to run your first scan.",
  },
  {
    step: "2",
    title: "Automated analysis",
    description:
      "Hawkeye runs 6+ security checks — SSL/TLS, headers, cookies, robots.txt, tech stack, and more.",
  },
  {
    step: "3",
    title: "Get your report",
    description:
      "Receive a detailed security report with findings, risk levels, and an overall score. Export as PDF.",
  },
];

export default function HowItWorks() {
  return (
    <section id="about" className="px-5 sm:px-8 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="font-body text-sm font-semibold text-talon tracking-wide uppercase mb-3">
            Simple Process
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-bone">
            How it works
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div
            className="absolute left-6 top-6 bottom-6 w-[2px] bg-gradient-to-b from-talon/50 via-border/30 to-transparent hidden sm:block"
            aria-hidden="true"
          />

          <div className="space-y-12 sm:space-y-16">
            {steps.map((item) => (
              <div key={item.step} className="flex gap-6 sm:gap-10 items-start">
                {/* Step number */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full border border-talon/30 bg-raised/80 shadow-md shadow-talon/10 flex items-center justify-center relative z-10 backdrop-blur-sm">
                    <span className="font-display text-xl text-talon font-bold">
                      {item.step}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-1">
                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-bone mb-3">
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
