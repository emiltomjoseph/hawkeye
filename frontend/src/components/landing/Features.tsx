import { features } from "@/lib/features";

export default function Features() {
  return (
    <section className="px-5 sm:px-8 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] tracking-[0.25em] text-grid uppercase mb-4">
            SCAN::CAPABILITIES
          </p>
          <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight">
            What gets checked
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.code}
                className="group rounded-lg border border-border bg-raised/60 p-5 transition-colors hover:border-feather/30"
              >
                {/* Icon + Code */}
                <div className="flex items-start justify-between mb-3">
                  <div className="rounded-md bg-deep/60 p-2">
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      className="text-talon"
                    />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-grid/60 uppercase mt-1">
                    {feature.code}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-base uppercase tracking-wide text-bone mb-1.5">
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
