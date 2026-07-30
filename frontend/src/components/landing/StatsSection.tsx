const stats = [
  { value: "6+", label: "Security Checks", code: "MOD::ACTIVE" },
  { value: "<60s", label: "Average Scan Time", code: "PERF::LATENCY" },
  { value: "100%", label: "Free to Use", code: "PLAN::OPEN" },
  { value: "PDF", label: "Export Reports", code: "OUT::FORMAT" },
];

export default function StatsSection() {
  return (
    <section className="px-5 sm:px-8 py-12 sm:py-20 relative">
      <div className="mx-auto max-w-5xl relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.code}
              className="group rounded-2xl border border-border/40 bg-raised/20 p-6 sm:p-8 text-center shadow-sm hover:shadow-lg hover:border-talon/20 transition-all duration-300 backdrop-blur-sm"
            >
              {/* Value */}
              <p className="font-display text-4xl sm:text-5xl font-bold text-talon leading-none mb-3 tracking-tight group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </p>

              {/* Label */}
              <p className="font-body text-bone font-medium text-sm sm:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
