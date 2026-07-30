const stats = [
  { value: "6+", label: "Security Checks", code: "MOD::ACTIVE" },
  { value: "<60s", label: "Average Scan Time", code: "PERF::LATENCY" },
  { value: "100%", label: "Free to Use", code: "PLAN::OPEN" },
  { value: "PDF", label: "Export Reports", code: "OUT::FORMAT" },
];

export default function StatsSection() {
  return (
    <section className="px-5 sm:px-8 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.code}
              className="group rounded-lg border border-border bg-raised/40 p-5 sm:p-6 text-center transition-colors hover:border-talon/30"
            >
              {/* Stat code */}
              <p className="font-mono text-[9px] tracking-[0.25em] text-grid/50 uppercase mb-3">
                {stat.code}
              </p>

              {/* Value */}
              <p className="font-display text-3xl sm:text-4xl uppercase text-talon leading-none mb-2 tracking-tight">
                {stat.value}
              </p>

              {/* Label */}
              <p className="font-body text-feather text-xs sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
