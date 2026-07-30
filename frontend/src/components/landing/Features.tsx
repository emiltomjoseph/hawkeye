import { features } from "@/lib/features";

export default function Features() {
  return (
    <section className="px-5 sm:px-8 py-16 sm:py-24 relative">
      <div className="mx-auto max-w-6xl relative z-10">
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="font-body text-sm font-semibold text-talon tracking-wide uppercase mb-3">
            Comprehensive Analysis
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-bone">
            Everything we check
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.code}
                className="group rounded-2xl border border-border/40 bg-raised/30 p-6 shadow-sm hover:shadow-xl hover:shadow-talon/5 hover:border-talon/30 transition-all duration-300 backdrop-blur-md"
              >
                {/* Icon */}
                <div className="flex items-start mb-5">
                  <div className="rounded-xl bg-dusk p-3 shadow-inner border border-border/50 group-hover:bg-talon/10 transition-colors duration-300">
                    <Icon
                      size={24}
                      strokeWidth={1.5}
                      className="text-talon"
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-semibold text-bone mb-2 group-hover:text-talon transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-feather text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
