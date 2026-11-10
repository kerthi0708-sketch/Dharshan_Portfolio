"use client";

import Image from "next/image";
import { motion, useSpring, useTransform, useReducedMotion } from "motion/react";
import { CARD_FACE_SRC } from "./cardTextures";

/**
 * Lightweight hanging card for touch devices, small screens and reduced motion.
 * Pure DOM: a strap + card that pivots from the top. Dragging sideways swings
 * it; on release a spring lets it settle like a pendulum.
 */
export function HangingCard2D() {
  const reduce = useReducedMotion();
  const swing = useSpring(0, { stiffness: 60, damping: 6, mass: 1.2 });
  const rotate = useTransform(swing, (v) => `${v}deg`);

  return (
    <div className="relative mx-auto flex h-[560px] w-full max-w-[300px] justify-center sm:h-[640px]" aria-hidden="true">
      <div className="absolute inset-x-0 top-0 flex justify-center">
      <div
        className="origin-top"
        style={reduce ? undefined : { animation: "sway 6s ease-in-out infinite" }}
      >
      <motion.div
        className="flex origin-top flex-col items-center"
        style={{ rotate: reduce ? "0deg" : rotate }}
      >
        {/* strap */}
        <div className="relative h-36 w-7 overflow-hidden rounded-b-sm bg-[#17161a] shadow-[inset_0_0_0_1px_rgba(157,140,242,0.25)] sm:h-44">
          <div className="absolute inset-y-0 left-0 w-[3px] bg-violet/80" />
          <div className="absolute inset-y-0 right-0 w-[3px] bg-violet/80" />
          <p className="absolute left-1/2 top-2 -translate-x-1/2 font-mono text-[9px] tracking-[0.2em] text-fg/80 [writing-mode:vertical-rl]">
            KERTHIK DHARSHAN ✦ AI &amp; ML
          </p>
        </div>
        {/* clip */}
        <div className="-mt-1 h-5 w-5 rounded-full border-[3px] border-[#b4b4b8]" />
        <div className="-mt-1 h-4 w-14 rounded-sm bg-gradient-to-b from-[#c7c7cb] to-[#7d7d82]" />

        {/* card */}
        <motion.div
          onPan={(_, info) => {
            if (!reduce) swing.set(Math.max(-30, Math.min(30, info.offset.x * 0.22)));
          }}
          onPanEnd={() => swing.set(0)}
          className="relative -mt-0.5 aspect-[1024/1440] w-[250px] cursor-grab touch-pan-y select-none overflow-hidden rounded-[14px] border border-white/10 bg-gradient-to-br from-[#1b1a18] to-[#0e0e0d] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8),0_0_40px_-10px_rgba(157,140,242,0.35)] sm:w-[280px]"
        >
          {/* Designed card face, edge to edge */}
          <Image src={CARD_FACE_SRC} alt="" fill sizes="280px" loading="eager" draggable={false} className="object-cover" />

          {/* Lanyard slot */}
          <div className="absolute left-1/2 top-[5%] h-2 w-14 -translate-x-1/2 rounded-full bg-black/85 ring-1 ring-white/15" />
        </motion.div>
      </motion.div>
      </div>
      </div>
    </div>
  );
}
