"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useIsoLayoutEffect, MOTION_OK } from "@/lib/gsap";

/** Moves its content horizontally as it crosses the viewport (scrubbed). */
export function ScrollDrift({
  children,
  from = 8,
  to = -8,
  className = "",
}: {
  children: ReactNode;
  from?: number;
  to?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        el,
        { xPercent: from },
        { xPercent: to, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
    });
    return () => mm.revert();
  }, [from, to]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
