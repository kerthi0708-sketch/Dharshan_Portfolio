"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/*
 * An illustrative agent run using the real stage names (prompt.py, STEP 1–6),
 * the real SSE event types (think / text / cmd) and real command names
 * (create_app, brick_info, save_file, run_app, …) from the Pramoj AI backend.
 * The app ("led-toggle") and the dialogue are examples.
 */

type Board = "unoq" | "pi";
type Line = { t: "think" | "text" | "cmd" | "user"; s: string; server?: boolean };

const STAGES = ["Plan", "Create app", "Install", "Generate code", "Test & debug", "Summary"];

function script(board: Board): Line[][] {
  const pi = board === "pi";
  return [
    [
      { t: "user", s: "Create an LED toggle app" },
      { t: "think", s: "Needs a web button → Python → sketch. Python + sketch, web UI brick." },
      { t: "text", s: "Plan: a web page with a toggle, a Python backend, and a sketch that drives the LED. Can I proceed?" },
      { t: "user", s: "Yes" },
    ],
    [{ t: "cmd", s: pi ? 'create_app { name: "led-toggle", project_type: "both" }' : 'create_app { name: "led-toggle" }' }],
    [
      { t: "cmd", s: "brick_info { … }", server: true },
      ...(pi
        ? [{ t: "cmd" as const, s: "pi_brick_compat { … }", server: true }]
        : [
            { t: "cmd" as const, s: "list_installed_libraries" },
            { t: "cmd" as const, s: "search_libraries → install_library → add_library" },
          ]),
    ],
    [
      { t: "think", s: "Trace the data flow end to end; socket event names must match on both sides." },
      { t: "cmd", s: "save_file × 6" },
      { t: "cmd", s: "read_file assets/index.html" },
    ],
    [
      { t: "cmd", s: "run_app → wait_for_build → check_app_status" },
      { t: "cmd", s: "get_build_logs · get_app_logs · get_monitor_logs" },
      { t: "text", s: "Click the toggle once — I'll read the logs to confirm the LED responds." },
    ],
    [{ t: "text", s: "Your LED toggle app is built and running on the board." }],
  ];
}

const FILES = ["app.yaml", "python/main.py", "sketch/sketch.ino", "assets/index.html", "assets/style.css", "assets/app.js"];

const TONE: Record<Line["t"], string> = {
  user: "text-pramoj",
  think: "text-muted italic",
  text: "text-fg",
  cmd: "text-[#9fd0ff]",
};

export function AgentRun() {
  const [board, setBoard] = useState<Board>("unoq");
  const [stage, setStage] = useState(0);
  const [autoPref, setAuto] = useState(true);
  const reduce = useReducedMotion();
  const auto = autoPref && !reduce;
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !inView) return;
    const id = window.setTimeout(() => setStage((s) => (s + 1) % STAGES.length), stage === STAGES.length - 1 ? 4200 : 2600);
    return () => window.clearTimeout(id);
  }, [auto, inView, stage]);

  const lines = script(board);
  const visible = lines.slice(0, stage + 1).flat().slice(-9);
  const filesShown = stage >= 3 ? FILES.length : 0;
  const root = board === "pi" ? "~/Templates/dashboard/led-toggle" : "/home/arduino/ArduinoApps/led-toggle";

  return (
    <div ref={ref} className="overflow-hidden rounded-[22px] border border-pramoj/25 bg-[#080d18]">
      {/* top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-pramoj [animation:pulse-dot_1.6s_ease-in-out_infinite]" aria-hidden="true" />
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-2">Agent · SSE stream</p>
        </div>
        <div role="radiogroup" aria-label="Target board" className="flex rounded-full border border-white/10 p-0.5">
          {([
            ["unoq", "Arduino UNO Q"],
            ["pi", "Raspberry Pi"],
          ] as const).map(([k, l]) => (
            <button
              key={k}
              role="radio"
              aria-checked={board === k}
              onClick={() => setBoard(k)}
              className={`rounded-full px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] transition-colors ${
                board === k ? "bg-pramoj text-[#080d18]" : "text-muted hover:text-fg"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* stage rail */}
      <ol className="grid grid-cols-3 border-b border-white/10 sm:grid-cols-6" aria-label="Agent stages">
        {STAGES.map((s, i) => (
          <li key={s} className="border-b border-r border-white/5 last:border-r-0 sm:border-b-0">
            <button
              onClick={() => {
                setStage(i);
                setAuto(false);
              }}
              aria-current={i === stage ? "step" : undefined}
              className="group relative w-full px-3 py-3 text-left"
            >
              <span className={`font-mono text-[0.6rem] ${i <= stage ? "text-pramoj" : "text-muted"}`}>STEP {i + 1}</span>
              <span className={`mt-0.5 block text-xs sm:text-sm ${i === stage ? "text-fg" : i < stage ? "text-fg-2" : "text-muted"}`}>{s}</span>
              <span
                className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-pramoj transition-transform duration-700"
                style={{ transform: `scaleX(${i <= stage ? 1 : 0})` }}
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ol>

      <div className="grid md:grid-cols-12">
        {/* stream */}
        <div className="min-h-[340px] border-b border-white/10 p-4 font-mono text-[0.78rem] leading-relaxed sm:p-6 md:col-span-8 md:border-b-0 md:border-r" aria-live="polite">
          {visible.map((l, i) => (
            <div key={`${board}-${stage}-${i}-${l.s}`} className="flex gap-3 py-1 [animation:fade-in_.5s_ease-out_both]">
              <span className="w-12 shrink-0 text-[0.65rem] uppercase tracking-wider text-white/30">{l.t === "user" ? "you" : l.t}</span>
              <span className={TONE[l.t]}>
                {l.s}
                {l.t === "cmd" && (
                  <span className="ml-2 rounded border border-white/10 px-1.5 py-px text-[0.6rem] uppercase tracking-wider text-white/40">
                    {l.server ? "answered on server" : "interrupt → board → resume"}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* generated project */}
        <div className="p-4 sm:p-6 md:col-span-4">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">On the board</p>
          <p className="mt-2 break-all font-mono text-[0.7rem] text-pramoj">{root}</p>
          <ul className="mt-4 space-y-1.5 font-mono text-[0.75rem]">
            {FILES.map((f, i) => {
              const on = stage >= 3 && i < filesShown;
              return (
                <li
                  key={f}
                  className="flex items-center gap-2 transition-all duration-500"
                  style={{ opacity: on ? 1 : 0.18, transform: on ? "none" : "translateX(6px)", transitionDelay: `${on ? i * 90 : 0}ms` }}
                >
                  <span className={on ? "text-pramoj" : "text-white/30"}>{on ? "✓" : "·"}</span>
                  <span className="text-fg-2">{f}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 rounded-lg border border-white/10 p-3 text-[0.72rem] leading-relaxed text-muted">
            {board === "pi" ? (
              <>Python and the web UI run on the Pi. The sketch is compiled with arduino-cli for a USB-attached UNO R4 Minima, linked by a serial line bridge.</>
            ) : (
              <>Python and the sketch talk through the UNO Q Bridge; the web UI is served from the board.</>
            )}
          </div>
          <button
            onClick={() => {
              setAuto(!auto);
            }}
            className="mt-5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted hover:text-fg"
          >
            {auto ? "❚❚ Pause" : "▶ Auto-play"}
          </button>
        </div>
      </div>
    </div>
  );
}
