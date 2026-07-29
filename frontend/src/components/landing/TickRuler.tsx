/**
 * Decorative tick-mark ruler strip along the top edge of the viewport.
 * Hidden on mobile (below sm breakpoint) to avoid clutter.
 * Entirely aria-hidden — visual decoration only.
 */
export default function TickRuler() {
  const ticks = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div
      className="hidden sm:block fixed top-0 left-0 right-0 z-40 h-2 pointer-events-none"
      aria-hidden="true"
    >
      <div className="flex items-end h-full">
        {ticks.map((i) => {
          const isMajor = i % 10 === 0;
          return (
            <div
              key={i}
              className="flex-1"
              style={{
                height: isMajor ? "8px" : "4px",
                borderRight: `1px solid`,
                borderColor: isMajor
                  ? "color-mix(in srgb, var(--grid) 20%, transparent)"
                  : "color-mix(in srgb, var(--grid) 8%, transparent)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
