"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type Stage = {
  key: string;
  label: string;
  title: string;
  lead: string;
  points: string[];
  visual: ReactNode;
  extra?: ReactNode;
};

/**
 * DATA → TRAIN → OPTIMIZE → DEPLOY.
 * Desktop: a sticky stage index on the left tracks the stage in view.
 * Mobile: the index collapses into a sticky bar under the nav.
 */
export function Journey({ stages }: { stages: Stage[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const progress = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.index);
            setActive(i);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    refs.current.forEach((r) => r && io.observe(r));

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrap.current;
        if (!el || !progress.current) return;
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / r.height));
        progress.current.style.transform = `scaleY(${p})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={wrap} className="relative px-4 sm:px-8 lg:px-12">
      {/* Mobile sticky stage bar */}
      <div className="sticky top-[57px] z-30 -mx-4 border-y border-line bg-[#070908]/90 px-4 backdrop-blur-md sm:-mx-8 sm:px-8 lg:hidden">
        <ol className="flex justify-between py-3" aria-label="PetalEdge journey">
          {stages.map((s, i) => (
            <li key={s.key} className="flex items-center gap-2">
              <span
                className={`font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors duration-500 ${
                  i === active ? "text-edge" : i < active ? "text-fg-2" : "text-muted"
                }`}
              >
                {s.label}
              </span>
              {i < stages.length - 1 && <span className="hidden text-muted sm:inline" aria-hidden="true">→</span>}
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-12 lg:gap-12">
        {/* Desktop sticky index */}
        <div className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-0 flex h-[100svh] flex-col justify-center py-24">
            <p className="eyebrow mb-8">The product journey</p>
            <div className="relative pl-8">
              <div className="absolute bottom-2 left-0 top-2 w-px bg-line" aria-hidden="true">
                <div ref={progress} className="h-full w-px origin-top scale-y-0 bg-edge" />
              </div>
              <ol aria-label="PetalEdge journey">
                {stages.map((s, i) => (
                  <li key={s.key}>
                    <a
                      href={`#pe-${s.key}`}
                      className="group flex items-baseline gap-4 py-1"
                      aria-current={i === active ? "step" : undefined}
                    >
                      <span className="w-6 font-mono text-xs text-muted">0{i + 1}</span>
                      <span
                        className="display text-[clamp(2.6rem,4.6vw,5rem)] uppercase transition-all duration-700"
                        style={{
                          color: i === active ? "var(--fg)" : "transparent",
                          WebkitTextStroke: i === active ? "0px" : "1px rgba(241,237,228,0.28)",
                          fontVariationSettings: i === active ? '"wdth" 100, "wght" 850' : '"wdth" 78, "wght" 600',
                        }}
                      >
                        {s.label}
                      </span>
                      {i < stages.length - 1 && (
                        <span className={`text-lg transition-colors duration-700 ${i === active ? "text-edge" : "text-transparent"}`} aria-hidden="true">
                          ↓
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-10 max-w-xs text-sm leading-relaxed text-muted" aria-live="polite">
              {stages[active].title}
            </p>
          </div>
        </div>

        {/* Stages */}
        <div className="lg:col-span-8">
          {stages.map((s, i) => (
            <section
              key={s.key}
              id={`pe-${s.key}`}
              data-index={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              aria-labelledby={`pe-${s.key}-title`}
              className="border-b border-line py-20 last:border-b-0 md:py-32"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-edge">0{i + 1}</span>
                <span className="h-px w-10 bg-edge/50" />
                <span className="eyebrow">{s.label}</span>
              </div>
              <h4 id={`pe-${s.key}-title`} className="mt-6 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-fg md:text-5xl">
                {s.title}
              </h4>
              <p className="mt-5 max-w-2xl leading-relaxed text-fg-2">{s.lead}</p>

              <div className="mt-12">{s.visual}</div>

              <ul className="mt-16 grid gap-x-8 md:grid-cols-3">
                {s.points.map((p, j) => (
                  <li key={j} className="flex gap-3 border-t border-line py-4 text-sm leading-relaxed text-fg-2">
                    <span className="font-mono text-[0.7rem] text-edge">{String(j + 1).padStart(2, "0")}</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              {s.extra}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
