"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

/*
 * The program rendered here is the curated "Breathing Light" example for the
 * Petal UNO board (database/manual_programs/json/arduinoUno.json in the
 * Code Craft AI backend): event_whenarduinobegin → set i → forever →
 * 2× repeat 255 { change i by ±1 · wait 0.01 · ANALOG_WRITE pin 3 = i }.
 */

const TOOLS = [
  "get_boards",
  "get_robo_block_names",
  "get_common_blocks",
  "get_robo_block_json",
  "assemble",
  "validate",
];

const C = {
  event: "#ffbf00",
  control: "#ffab19",
  data: "#ff8c1a",
  pin: "#2fb2a8",
};

function Slot({ children }: { children: ReactNode }) {
  return (
    <span className="mx-1 inline-flex min-w-[1.6rem] items-center justify-center rounded-full bg-white px-2 py-0.5 text-[0.72rem] font-semibold text-[#3b3b3b]">
      {children}
    </span>
  );
}

function Block({ color, step, shown, hat, children }: { color: string; step: number; shown: number; hat?: boolean; children: ReactNode }) {
  const on = shown >= step;
  return (
    <div
      className={`relative w-max text-[0.8rem] font-semibold text-white ${hat ? "rounded-t-[18px] rounded-b-md pt-3" : "rounded-md"} px-3 py-2 shadow-[0_2px_0_rgba(0,0,0,0.25)]`}
      style={{
        background: color,
        opacity: on ? 1 : 0,
        transform: on ? "none" : "translate3d(24px,-10px,0) rotate(-2deg)",
        transition: "opacity .5s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {children}
    </div>
  );
}

function CBlock({ color, step, shown, label, children }: { color: string; step: number; shown: number; label: ReactNode; children: ReactNode }) {
  const on = shown >= step;
  return (
    <div
      className="w-max"
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "none" : "translate3d(24px,-10px,0)",
        transition: "opacity .5s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)",
      }}
    >
      <div className="rounded-t-md px-3 py-2 text-[0.8rem] font-semibold text-white" style={{ background: color }}>
        {label}
      </div>
      <div className="flex">
        <div className="w-4" style={{ background: color }} />
        <div className="space-y-[3px] py-[3px] pl-1">{children}</div>
      </div>
      <div className="h-4 w-24 rounded-b-md" style={{ background: color }} />
    </div>
  );
}

const TOTAL = 12;

export function BlockWorkspace() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const [run, setRun] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setStarted(true), io.disconnect()), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= TOTAL) window.clearInterval(id);
    }, 260);
    return () => window.clearInterval(id);
  }, [started, run]);

  const reduce = useReducedMotion();
  // Reduced motion: show the finished program immediately.
  const view = reduce ? TOTAL : shown;
  const toolStep = Math.min(TOOLS.length, Math.ceil((view / TOTAL) * TOOLS.length));
  const done = view >= TOTAL;

  return (
    <div ref={ref} className="grid overflow-hidden rounded-[22px] border border-craft/25 bg-[#12110d] lg:grid-cols-12">
      {/* Conversation */}
      <div className="flex flex-col border-b border-craft/15 p-5 sm:p-7 lg:col-span-5 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-craft">Chat · Petal UNO</p>
          <span className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted">
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true"><rect x="3" y="0.5" width="4" height="7" rx="2" stroke="currentColor"/><path d="M1 6a4 4 0 008 0M5 10v1.5" stroke="currentColor"/></svg>
            Voice or text
          </span>
        </div>
        <div className="mt-6 space-y-4">
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-craft px-4 py-3 text-sm text-black">
            Make the LED on pin 3 fade in and out, like it&apos;s breathing.
          </div>
          <div
            className="max-w-[90%] rounded-2xl rounded-bl-sm border border-line bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-fg-2"
            style={{ opacity: done ? 1 : 0.25, transition: "opacity .6s" }}
          >
            {done ? (
              <>
                Your LED now gets brighter, then dimmer, again and again. 💡 It counts a number up to 255 and back
                down, sending it to pin 3 each time.
              </>
            ) : (
              <span className="font-mono text-xs text-muted">thinking…</span>
            )}
          </div>
        </div>

        <div className="mt-auto pt-8">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">Agent tool calls</p>
          <ol className="mt-3 flex flex-wrap gap-1.5">
            {TOOLS.map((t, i) => (
              <li
                key={t}
                className={`rounded-md border px-2 py-1 font-mono text-[0.68rem] transition-colors duration-500 ${
                  i < toolStep ? "border-craft/50 bg-craft/10 text-craft" : "border-line text-muted"
                }`}
              >
                {t}
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => {
              setShown(0);
              setStarted(true);
              setRun((r) => r + 1);
            }}
            className="mt-5 rounded-full border border-craft/40 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-craft transition-colors hover:bg-craft hover:text-black"
          >
            ↻ Replay generation
          </button>
        </div>
      </div>

      {/* Block workspace */}
      <div className="dot-grid relative min-h-[460px] overflow-x-auto p-5 sm:p-8 lg:col-span-7">
        <p className="mb-5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">Workspace · Program mode</p>
        <div className="space-y-[3px]" aria-label="Breathing Light block program" role="img">
          <Block color={C.event} step={1} shown={view} hat>
            when Arduino begins
          </Block>
          <Block color={C.data} step={2} shown={view}>
            set <Slot>i</Slot> to <Slot>0</Slot>
          </Block>
          <CBlock color={C.control} step={3} shown={view} label="forever">
            <CBlock color={C.control} step={4} shown={view} label={<>repeat <Slot>255</Slot></>}>
              <Block color={C.data} step={5} shown={view}>change <Slot>i</Slot> by <Slot>1</Slot></Block>
              <Block color={C.control} step={6} shown={view}>wait <Slot>0.01</Slot> seconds</Block>
              <Block color={C.pin} step={7} shown={view}>analog write pin <Slot>3</Slot> value <Slot>i</Slot></Block>
            </CBlock>
            <CBlock color={C.control} step={8} shown={view} label={<>repeat <Slot>255</Slot></>}>
              <Block color={C.data} step={9} shown={view}>change <Slot>i</Slot> by <Slot>-1</Slot></Block>
              <Block color={C.control} step={10} shown={view}>wait <Slot>0.01</Slot> seconds</Block>
              <Block color={C.pin} step={11} shown={view}>analog write pin <Slot>3</Slot> value <Slot>i</Slot></Block>
            </CBlock>
          </CBlock>
        </div>
        <div
          className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-craft/40 bg-black/60 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-craft backdrop-blur"
          style={{ opacity: view >= TOTAL ? 1 : 0, transition: "opacity .5s" }}
        >
          ✓ Valid program · sent to editor
        </div>
      </div>
    </div>
  );
}
