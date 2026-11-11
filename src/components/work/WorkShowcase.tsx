"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { Reveal } from "@/components/ui/Reveal";

export type ShowcaseProject = {
  id: string;
  n: string;
  name: string;
  kind: string;
  line: string;
  tags: string;
  color: string;
};

/** Max tilt (deg) and background drift (px). Kept modest so it reads as premium, not gimmicky. */
const TILT = 14;
const DRIFT = 26;

/**
 * Selected-work index as parallax depth cards: on fine-pointer devices each card tilts toward
 * the cursor while its background drifts the opposite way, and a "View project" call to action
 * slides in. Every card always shows its description. Touch devices and reduced-motion users
 * get flat cards with the call to action always visible.
 * Pointer moves write CSS variables directly (one rAF per frame), so React never re-renders.
 */
export function WorkShowcase({ projects }: { projects: ShowcaseProject[] }) {
  const canTilt = useRef(false);
  const frame = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => (canTilt.current = mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  const onEnter = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!canTilt.current || e.pointerType !== "mouse") return;
    e.currentTarget.dataset.hover = "";
  };

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!canTilt.current || e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const px = (clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
      const py = (clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--ry", `${(px * TILT * 2).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(py * -TILT * 2).toFixed(2)}deg`);
      el.style.setProperty("--bx", `${(px * -DRIFT * 2).toFixed(1)}px`);
      el.style.setProperty("--by", `${(py * -DRIFT * 2).toFixed(1)}px`);
      el.style.setProperty("--gx", `${((px + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${((py + 0.5) * 100).toFixed(1)}%`);
    });
  };

  const onLeave = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    cancelAnimationFrame(frame.current);
    delete el.dataset.hover;
    for (const v of ["--rx", "--ry", "--bx", "--by"]) el.style.removeProperty(v);
  };

  return (
    <ol className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Project index">
      {projects.map((p, i) => (
        <Reveal as="li" key={p.id} delay={i * 80} className="[perspective:1100px]">
          <a
            href={`#${p.id}`}
            onPointerEnter={onEnter}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            className="depth-card group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0c] outline-none focus-visible:ring-2 focus-visible:ring-[var(--c)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:aspect-[4/5]"
            style={{ ["--c" as string]: p.color } as CSSProperties}
          >
            {/* Background layer: drifts against the tilt for depth */}
            <div aria-hidden="true" className="depth-bg absolute -inset-10">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(110% 75% at 18% 6%, color-mix(in srgb, var(--c) 34%, transparent), transparent 62%), radial-gradient(70% 55% at 100% 100%, color-mix(in srgb, var(--c) 16%, transparent), transparent 72%)",
                }}
              />
              <div className="dot-grid absolute inset-0 opacity-50" />
              <span
                className="display absolute right-16 top-[18%] text-[clamp(7rem,12vw,11rem)] leading-none text-transparent"
                style={{ WebkitTextStroke: "1px color-mix(in srgb, var(--c) 55%, transparent)" }}
              >
                {p.n}
              </span>
            </div>

            {/* Soft light that follows the cursor */}
            <div aria-hidden="true" className="depth-gloss pointer-events-none absolute inset-0" />
            {/* Legibility scrim */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

            <div className="relative flex h-full flex-col justify-between p-6">
              <p className="flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.16em]">
                <span style={{ color: "var(--c)" }}>{p.n}</span>
                <span className="text-muted">{p.kind}</span>
              </p>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-fg md:text-3xl">{p.name}</h3>
                <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">{p.tags}</p>
                {/* Description: always visible on every card, reserved to the same height so names align */}
                <p className="mt-4 text-sm leading-relaxed text-fg-2 sm:min-h-[calc(1.625em*3)]">{p.line}</p>
                {/* Call to action: always shown on touch; slides in on hover/focus with a fine pointer */}
                <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-fine:grid-rows-[0fr] pointer-fine:group-hover:grid-rows-[1fr] pointer-fine:group-focus-visible:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <span
                      className="inline-flex items-center gap-2 pt-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] transition-opacity duration-500 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-visible:opacity-100"
                      style={{ color: "var(--c)" }}
                    >
                      View project <span aria-hidden="true">↘</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </Reveal>
      ))}
    </ol>
  );
}
