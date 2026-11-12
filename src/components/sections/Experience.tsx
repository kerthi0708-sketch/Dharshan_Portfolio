"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Reveal } from "@/components/ui/Reveal";

/*
 * Experience & Education as one chronological journey.
 * Every title, organisation, date and description below is taken from the resume
 * (the same content the previous Experience and Education sections showed).
 */
type Kind = "education" | "experience" | "current";

type Milestone = {
  year: string; // label on the wheel
  period: string; // full date range in the panel
  kind: Kind;
  tag: string; // small category label
  title: string;
  org: string;
  /** Final CGPA, from the resume. */
  cgpa?: string;
  points?: string[];
};

const MILESTONES: Milestone[] = [
  {
    year: "2019",
    period: "2019 — 2022",
    kind: "education",
    tag: "Education",
    title: "B.Sc. Computer Science",
    org: "The American College, Madurai",
    cgpa: "7.1",
  },
  {
    year: "2022",
    period: "2022 — 2024",
    kind: "education",
    tag: "Education",
    title: "M.Sc. Data Science",
    org: "The American College, Madurai",
    cgpa: "7.9",
  },
  {
    year: "2023",
    period: "December 2023 — March 2024",
    kind: "experience",
    tag: "Professional experience · Internship",
    title: "Artificial Intelligence Engineer Intern",
    org: "ISRO",
    points: [
      "Assisted in developing AI models for automation and data-processing tasks.",
      "Worked with image processing and deep-learning techniques for detection and classification.",
      "Analysed datasets and performed preprocessing to improve model accuracy.",
    ],
  },
  {
    year: "2024",
    period: "2024",
    kind: "education",
    tag: "Education · Certifications",
    title: "Certifications",
    org: "Google · IBM (Coursera)",
    points: [
      "Crash Course on Python — Google (Coursera), 2024",
      "Databases and SQL for Data Science — IBM (Coursera), 2024",
    ],
  },
  {
    year: "2025",
    period: "2025",
    kind: "education",
    tag: "Education · Certification",
    title: "Data Analytics",
    org: "Accord Info Matrix, Chennai",
  },
  {
    year: "2026",
    period: "January 2026 — Present",
    kind: "current",
    tag: "Current role",
    title: "AI Engineer",
    org: "Petals Automations",
    points: [
      "Develop and improve AI/ML workflows for model training, evaluation and deployment in edge AI applications.",
      "Work with Python and machine-learning tools to troubleshoot training pipelines and improve model reliability.",
      "Built PetalEdge's object detection and motion recognition pipelines end to end, from data to edge deployment.",
    ],
  },
];

const N = MILESTONES.length;
const SEG = 360 / N;
const R_OUT = 470;
const R_IN = 96;
const R_TEXT = 300;
/** Extra scroll distance per milestone on desktop (in svh). */
const STEP_SVH = 62;

// Subtle, premium fills: education leans violet, experience leans warm; the active one turns accent.
const FILL: Record<Kind, string[]> = {
  education: ["#1c1b24", "#211f2b", "#1e1d27"],
  experience: ["#26201b"],
  current: ["#2a211b"],
};
const TAG_COLOR: Record<Kind, string> = {
  education: "text-violet",
  experience: "text-fg-2",
  current: "text-accent",
};

function polar(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return [r * Math.cos(a), r * Math.sin(a)] as const;
}

function segmentPath(i: number) {
  const a0 = i * SEG - SEG / 2;
  const a1 = i * SEG + SEG / 2;
  const [x0, y0] = polar(R_OUT, a0);
  const [x1, y1] = polar(R_OUT, a1);
  const [x2, y2] = polar(R_IN, a1);
  const [x3, y3] = polar(R_IN, a0);
  return `M${x0} ${y0} A${R_OUT} ${R_OUT} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${R_IN} ${R_IN} 0 0 0 ${x3} ${y3} Z`;
}

const TICKS = Array.from({ length: 90 }, (_, i) => i * 4);

function Detail({ m }: { m: Milestone }) {
  return (
    <>
      <p className={`font-mono text-[0.68rem] uppercase tracking-[0.16em] ${TAG_COLOR[m.kind]}`}>{m.tag}</p>
      <p className="mt-3 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-muted">{m.period}</p>
      <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-fg md:text-3xl">{m.title}</h3>
      <p className="mt-1 font-serif text-xl italic text-fg-2">{m.org}</p>
      {m.cgpa && (
        <p className="mt-6 flex items-baseline gap-3 border-t border-line pt-4">
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">CGPA</span>
          <span className="font-serif text-4xl italic leading-none text-fg">{m.cgpa}</span>
        </p>
      )}
      {m.points && (
        <ul className="mt-5 max-w-xl">
          {m.points.map((p) => (
            <li key={p} className="border-t border-line py-2.5 text-sm leading-relaxed text-muted">
              {p}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Heading() {
  return (
    <>
      <p className="eyebrow">
        <span className="text-accent">Experience &amp; Education</span>
      </p>
      <h2 className="display mt-5 text-[clamp(2.4rem,4.2vw,4rem)] uppercase">
        My{" "}
        <span className="font-serif font-normal normal-case italic tracking-normal text-accent" style={{ fontVariationSettings: "normal" }}>
          journey
        </span>
      </h2>
    </>
  );
}

export function Experience() {
  const track = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // Desktop: the scroll position through the pinned track decides the active milestone.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = track.current;
        if (!el || el.offsetParent === null) return; // hidden below lg
        const r = el.getBoundingClientRect();
        const span = r.height - window.innerHeight;
        if (span <= 0) return;
        const p = Math.min(0.9999, Math.max(0, -r.top / span));
        setActive(Math.floor(p * N));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Selecting a milestone scrolls to its slice of the track, so scroll and content stay in sync.
  const select = useCallback((i: number) => {
    const el = track.current;
    setActive(i);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: top + ((i + 0.5) / N) * span, behavior: reduce ? "auto" : "smooth" });
  }, []);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = Math.min(N - 1, i + 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = Math.max(0, i - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = N - 1;
    if (next < 0) return;
    e.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };

  const m = MILESTONES[active];

  return (
    <section id="experience" aria-label="Experience and education" className="relative border-t border-line">
      <span id="education" className="absolute top-0" aria-hidden="true" />

      {/* ── Desktop: pinned turning wheel + detail panel ───────────────────── */}
      <div ref={track} className="relative hidden lg:block" style={{ height: `calc(100svh + ${(N - 1) * STEP_SVH}svh)` }}>
        <div className="sticky top-0 grid h-[100svh] grid-cols-12 items-center overflow-hidden px-12">
          {/* Wheel: centred off the left edge, pointer on its right rim */}
          <div className="relative col-span-6 h-full">
            <div
              className="absolute top-1/2 aspect-square w-[min(88svh,50vw)] -translate-y-1/2"
              style={{ left: "calc(min(88svh, 50vw) * -0.42)" }}
              aria-hidden="true"
            >
              <svg viewBox="-500 -500 1000 1000" className="h-full w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                <g className="turning-wheel" style={{ transform: `rotate(${-active * SEG}deg)` }}>
                  <circle r="488" fill="none" stroke="rgba(241,237,228,0.14)" strokeWidth="2" />
                  {MILESTONES.map((s, i) => {
                    const on = i === active;
                    const fills = FILL[s.kind];
                    return (
                      <g key={s.year} className="cursor-pointer" onClick={() => select(i)}>
                        <path
                          d={segmentPath(i)}
                          fill={on ? "var(--accent)" : fills[i % fills.length]}
                          stroke="#0b0b0a"
                          strokeWidth="4"
                          style={{ transition: "fill 0.6s cubic-bezier(0.23,1,0.32,1)" }}
                        />
                        <text
                          x={R_TEXT}
                          y="0"
                          transform={`rotate(${i * SEG})`}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="display"
                          style={{ fontSize: 64, fill: on ? "#0b0b0a" : "var(--fg-2)", transition: "fill 0.6s ease" }}
                        >
                          {s.year}
                        </text>
                        <text
                          x={R_TEXT + 8}
                          y="52"
                          transform={`rotate(${i * SEG})`}
                          textAnchor="middle"
                          className="font-mono"
                          style={{ fontSize: 15, letterSpacing: 3, fill: on ? "rgba(11,11,10,0.7)" : "rgba(241,237,228,0.4)" }}
                        >
                          {s.kind === "education" ? "EDUCATION" : s.kind === "current" ? "CURRENT" : "EXPERIENCE"}
                        </text>
                      </g>
                    );
                  })}
                  {TICKS.map((t) => {
                    const [x0, y0] = polar(t % 12 === 0 ? 432 : 446, t);
                    const [x1, y1] = polar(462, t);
                    return <line key={t} x1={x0} y1={y0} x2={x1} y2={y1} stroke="rgba(241,237,228,0.22)" strokeWidth="2" />;
                  })}
                </g>
                {/* hub */}
                <circle r={R_IN - 6} fill="#0d0d0c" stroke="rgba(241,237,228,0.16)" strokeWidth="2" />
                <circle r="10" fill="var(--accent)" />
              </svg>
              {/* pointer */}
              <span className="absolute top-1/2 h-0 w-0 -translate-y-1/2 border-y-[13px] border-r-[22px] border-y-transparent border-r-accent" style={{ right: "calc(1.2% - 30px)" }} />
            </div>
          </div>

          {/* Detail panel with a milestone rail */}
          <div className="col-span-6 flex max-h-full flex-col justify-center py-20">
            <Heading />
            <div className="mt-10 flex gap-10">
              <div role="tablist" aria-orientation="vertical" aria-label="Milestones" className="relative flex shrink-0 flex-col gap-1 self-start">
                <span className="absolute bottom-3 left-[5px] top-3 w-px bg-line" aria-hidden="true" />
                <span
                  className="turning-rail absolute left-[5px] top-3 w-px bg-accent"
                  style={{ height: `calc((100% - 1.5rem) * ${active / (N - 1)})` }}
                  aria-hidden="true"
                />
                {MILESTONES.map((s, i) => {
                  const on = i === active;
                  return (
                    <button
                      key={s.year}
                      ref={(el) => {
                        tabs.current[i] = el;
                      }}
                      role="tab"
                      id={`ms-tab-${i}`}
                      aria-selected={on}
                      aria-controls="ms-panel"
                      tabIndex={on ? 0 : -1}
                      onClick={() => select(i)}
                      onKeyDown={(e) => onKey(e, i)}
                      className="group relative flex items-center gap-4 py-1.5 text-left outline-none"
                    >
                      <span
                        className={`relative z-10 h-[11px] w-[11px] rounded-full border-2 transition-colors duration-500 ${
                          on ? "border-accent bg-accent" : i < active ? "border-accent bg-bg" : "border-line-strong bg-bg"
                        }`}
                      />
                      <span
                        className={`font-mono text-[0.72rem] uppercase tracking-[0.14em] transition-colors duration-500 group-focus-visible:text-accent ${
                          on ? "text-fg" : "text-muted group-hover:text-fg-2"
                        }`}
                      >
                        {s.year}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                id="ms-panel"
                role="tabpanel"
                aria-labelledby={`ms-tab-${active}`}
                aria-live="polite"
                key={active}
                className="min-h-[19rem] min-w-0 flex-1 animate-[fade-in_0.6s_cubic-bezier(0.16,1,0.3,1)]"
              >
                <Detail m={m} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile & tablet: vertical milestone timeline ─────────────────────── */}
      <div className="px-4 py-24 sm:px-8 lg:hidden">
        <Reveal>
          <Heading />
        </Reveal>
        <ol className="relative mt-12">
          <span className="absolute bottom-2 left-[5px] top-2 w-px bg-line" aria-hidden="true" />
          {MILESTONES.map((s, i) => (
            <Reveal as="li" key={s.year} delay={i * 60} className="relative pb-12 pl-9 last:pb-0">
              <span
                className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 ${
                  s.kind === "current" ? "border-accent bg-accent" : s.kind === "education" ? "border-violet bg-bg" : "border-fg-2 bg-bg"
                }`}
                aria-hidden="true"
              />
              <Detail m={s} />
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
