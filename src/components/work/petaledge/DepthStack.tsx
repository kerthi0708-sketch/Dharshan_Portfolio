"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";

type Layer = { src: StaticImageData; alt: string; className: string; depth: number };

/**
 * Layered product screenshots with real depth:
 *  - scroll parallax (each layer moves at its own rate)
 *  - pointer depth on fine pointers (layers shift by their depth)
 * Disabled for reduced motion and small screens.
 */
export function DepthStack({ layers }: { layers: Layer[] }) {
  const root = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-depth]", el);
      items.forEach((it) => {
        const d = Number(it.dataset.depth);
        gsap.fromTo(
          it,
          { yPercent: d * 18 },
          {
            yPercent: d * -18,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    });
    mm.add("(pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const inner = gsap.utils.toArray<HTMLElement>("[data-depth-inner]", el);
      const setters = inner.map((it) => ({
        x: gsap.quickTo(it, "x", { duration: 0.9, ease: "power3.out" }),
        y: gsap.quickTo(it, "y", { duration: 0.9, ease: "power3.out" }),
        d: Number(it.dataset.depthInner),
      }));
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        setters.forEach((s) => {
          s.x(nx * 40 * s.d);
          s.y(ny * 28 * s.d);
        });
      };
      const onLeave = () => setters.forEach((s) => (s.x(0), s.y(0)));
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className="relative pb-[24%] pr-[4%] pt-[10%]">
      {layers.map((l, i) => (
        <div key={i} data-depth={l.depth} className={l.className}>
          <div data-depth-inner={l.depth}>
            <Image
              src={l.src}
              alt={l.alt}
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="h-auto w-full rounded-xl border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)]"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
