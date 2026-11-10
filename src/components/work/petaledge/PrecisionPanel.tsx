import { Reveal } from "@/components/ui/Reveal";

/**
 * A faithful recreation of PetalEdge's deployment precision selector
 * (PrecisionSelector.tsx / model_variants.py). Labels are the product's own;
 * numeric values are intentionally omitted.
 */
const ROWS = [
  { label: "Unoptimized (float32)", note: "Reference variant", badge: null, state: "ready" },
  { label: "Quantized (int8)", note: "Calibrated on a representative dataset", badge: "Recommended", state: "ready" },
  { label: "Half precision (float16)", note: "Built on demand", badge: null, state: "generate" },
] as const;

export function PrecisionPanel() {
  return (
    <Reveal>
      <figure className="overflow-hidden rounded-2xl border border-edge/25 bg-gradient-to-b from-edge/[0.06] to-transparent">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-edge">Deployment</p>
            <p className="mt-1 text-lg font-semibold text-fg">Precision</p>
          </div>
          <span className="rounded-full border border-line px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
            TensorFlow Lite
          </span>
        </div>
        <ul>
          {ROWS.map((r, i) => (
            <li
              key={r.label}
              className={`flex flex-wrap items-center gap-4 border-b border-line px-5 py-4 last:border-b-0 ${
                r.badge ? "bg-edge/[0.05]" : ""
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  r.badge ? "border-edge" : "border-line-strong"
                }`}
                aria-hidden="true"
              >
                {r.badge && <span className="h-2.5 w-2.5 rounded-full bg-edge" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-fg">{r.label}</p>
                <p className="text-xs text-muted">{r.note}</p>
              </div>
              {/* size bar, proportions only */}
              <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-white/5 sm:block" aria-hidden="true">
                <div className="h-full rounded-full bg-fg/40" style={{ width: ["100%", "28%", "52%"][i] }} />
              </div>
              {r.badge && (
                <span className="rounded-full bg-edge px-2.5 py-0.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-black">
                  {r.badge}
                </span>
              )}
              {r.state === "generate" && (
                <span className="rounded-full border border-edge/40 px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-edge">
                  Generate Float16
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4">
          {["Median latency", "p95 latency", "Load time", "Peak memory"].map((m) => (
            <div key={m} className="bg-[#070908] px-4 py-3">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted">On-device</p>
              <p className="mt-1 text-sm text-fg-2">{m}</p>
            </div>
          ))}
        </div>
        <figcaption className="border-t border-line px-5 py-3 text-xs text-muted">
          Recreated from the PetalEdge precision selector. Which variant gets recommended depends on the model; values are not shown.
        </figcaption>
      </figure>
    </Reveal>
  );
}
