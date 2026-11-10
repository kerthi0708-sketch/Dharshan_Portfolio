"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { HangingCard2D } from "./HangingCard2D";

// The physics card (three.js + rapier) is only downloaded when it is about to
// be seen, and only on capable desktop devices.
const HangingCard3D = dynamic(() => import("./HangingCard3D"), { ssr: false, loading: () => null });

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function CardStage() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "3d" | "2d">("pending");
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const decide = () => setMode(mq.matches && supportsWebGL() ? "3d" : "2d");
    decide();
    mq.addEventListener("change", decide);
    return () => mq.removeEventListener("change", decide);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nearIO = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), {
      rootMargin: "600px 0px",
    });
    const visIO = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    nearIO.observe(el);
    visIO.observe(el);
    return () => {
      nearIO.disconnect();
      visIO.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="relative h-full min-h-[560px] w-full sm:min-h-[640px]">
      {mode === "3d" && near && (
        <div className="absolute inset-0">
          <HangingCard3D active={visible} />
        </div>
      )}
      {mode === "2d" && <HangingCard2D />}
      {mode === "3d" && (
        <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
          Drag the card
        </p>
      )}
    </div>
  );
}
