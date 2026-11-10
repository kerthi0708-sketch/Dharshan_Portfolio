"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

/*
 * Mirrors the HealthAgeExplainResponse shape from the Petal Yellow AI backend:
 * headline {icon, label, age, comparison} · biggest_strength · biggest_opportunity
 * · next_milestone · snapshot[{label, value, status}].
 * ALL VALUES ARE ILLUSTRATIVE — no real member data is shown.
 */

type Cat = "heart" | "body" | "lifestyle";

const DATA: Record<
  Cat,
  {
    label: string;
    icon: string;
    age: number;
    comparison: string;
    strength: [string, string];
    opportunity: [string, string];
    milestone: [string, string];
    snapshot: { l: string; v: string; s?: string }[];
  }
> = {
  heart: {
    label: "Heart Age",
    icon: "♥",
    age: 31,
    comparison: "3 years younger than your age",
    strength: ["Resting heart rate under baseline", "It has stayed below your usual range across recent days."],
    opportunity: ["Sleep below your need", "Recent nights fall short of the sleep your body needs."],
    milestone: ["Sleep target five nights", "Aim to meet your sleep need on five nights this week."],
    snapshot: [
      { l: "Resting HR", v: "58 bpm", s: "Below baseline" },
      { l: "HRV", v: "64 ms", s: "Above baseline" },
      { l: "Sleep", v: "6.8 / 8 h", s: "Below need" },
      { l: "Heart score", v: "78", s: "Good" },
    ],
  },
  body: {
    label: "Body Age",
    icon: "◎",
    age: 36,
    comparison: "2 years older than your age",
    strength: ["Consistent daily activity", "You reached your step goal on most recent days."],
    opportunity: ["Weight trending above target", "Your recent weigh-ins sit above your daily target."],
    milestone: ["Close the calorie gap", "Bring daily calories within your target on weekdays."],
    snapshot: [
      { l: "BMI", v: "24.6", s: "Healthy" },
      { l: "Weight", v: "74 kg" },
      { l: "Steps", v: "8,900 / 10,000", s: "Close" },
      { l: "Body score", v: "66", s: "Fair" },
    ],
  },
  lifestyle: {
    label: "Lifestyle Age",
    icon: "✦",
    age: 32,
    comparison: "2 years younger than your age",
    strength: ["High readiness", "Your readiness score has stayed strong this week."],
    opportunity: ["Stress in your journal", "Your self-rated stress has been higher recently."],
    milestone: ["Two recovery days", "Plan two lighter sessions to support recovery."],
    snapshot: [
      { l: "Lifestyle score", v: "74", s: "Good" },
      { l: "Readiness", v: "81", s: "Good" },
      { l: "Recovery", v: "69", s: "Fair" },
      { l: "Strain", v: "12.4" },
    ],
  },
};

export function HealthPhone() {
  const [cat, setCat] = useState<Cat>("heart");
  const reduce = useReducedMotion();
  const d = DATA[cat];

  return (
    <div className="mx-auto w-full max-w-[340px]">
      <div className="relative rounded-[46px] bg-[#1b1a17] p-[10px] shadow-[0_50px_100px_-40px_rgba(60,45,10,0.55)]">
        <div className="relative overflow-hidden rounded-[38px] bg-[#fbf8f1]">
          {/* status bar */}
          <div className="flex items-center justify-between px-7 pb-1 pt-3 text-[0.65rem] font-semibold text-black/70">
            <span>9:41</span>
            <span className="h-5 w-20 rounded-full bg-[#1b1a17]" aria-hidden="true" />
            <span aria-hidden="true">●●●</span>
          </div>

          <div className="px-5 pb-6">
            <p className="mt-2 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-black/45">Health Age</p>

            <div role="tablist" aria-label="Health Age category" className="mt-3 grid grid-cols-3 gap-1 rounded-full bg-black/[0.05] p-1">
              {(Object.keys(DATA) as Cat[]).map((k) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={cat === k}
                  onClick={() => setCat(k)}
                  className={`rounded-full py-1.5 text-[0.7rem] font-medium transition-colors ${
                    cat === k ? "bg-[#1b1a17] text-[#fbf8f1]" : "text-black/55 hover:text-black"
                  }`}
                >
                  {DATA[k].label.replace(" Age", "")}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={cat}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                role="tabpanel"
              >
                {/* headline */}
                <div className="mt-5 rounded-3xl bg-[#f2c94c] p-5 text-[#1b1a17]">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>{d.label}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-base" aria-hidden="true">
                      {d.icon}
                    </span>
                  </div>
                  <p className="mt-3 font-serif text-7xl leading-none">{d.age}</p>
                  <p className="mt-2 text-sm">{d.comparison}</p>
                </div>

                {/* callouts */}
                <div className="mt-3 space-y-2">
                  {[
                    { k: "Biggest Strength", v: d.strength, c: "#5f7d65" },
                    { k: "Biggest Opportunity", v: d.opportunity, c: "#b06a22" },
                    { k: "Next Milestone", v: d.milestone, c: "#1b1a17" },
                  ].map(({ k, v: [t, x], c }) => (
                    <div key={k} className="rounded-2xl border border-black/[0.06] bg-white px-4 py-3">
                      <p className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em]" style={{ color: c }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
                        {k}
                      </p>
                      <p className="mt-1 text-[0.82rem] font-semibold text-[#1b1a17]">{t}</p>
                      <p className="text-[0.72rem] leading-snug text-black/55">{x}</p>
                    </div>
                  ))}
                </div>

                {/* snapshot */}
                <div className="mt-3 rounded-2xl bg-white px-4 py-3">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-black/45">Your health snapshot</p>
                  <dl className="mt-2 divide-y divide-black/[0.06]">
                    {d.snapshot.map((r) => (
                      <div key={r.l} className="flex items-center justify-between py-1.5 text-[0.75rem]">
                        <dt className="text-black/60">{r.l}</dt>
                        <dd className="flex items-center gap-2 font-semibold text-[#1b1a17]">
                          {r.v}
                          {r.s && (
                            <span className="rounded-full bg-[#7f9b84]/15 px-2 py-0.5 text-[0.6rem] font-medium text-[#4f6b54]">{r.s}</span>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-[0.7rem] text-black/50">
        Illustrative sample. Not real member data.
      </p>
    </div>
  );
}
