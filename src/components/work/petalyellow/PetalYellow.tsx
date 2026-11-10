import { Reveal, WordsReveal } from "@/components/ui/Reveal";
import { Contribution, StackGroups } from "../shared";
import { HealthPhone } from "./HealthPhone";

/*
 * Verified against the Petal Yellow AI backend (Projects/Petalyellow_ai):
 * services/chat_service.py, services/health_age_service.py,
 * services/context_builder.py, services/intent_router.py, tools/*,
 * database/app/*_repository.py, database/session.py, config.py, migrations/,
 * tests/. No member data is used anywhere on this page.
 */

const GROUNDING = [
  {
    t: "Identity is fixed by the server",
    d: "The member ID is never a tool parameter. Every data tool is bound to the member the server resolved, so a prompt can't point the model at someone else's records.",
  },
  {
    t: "Read-only data access",
    d: "Gym data is read through SELECT-only repositories on a separate read-only connection. Each transaction is marked READ ONLY and rolled back.",
  },
  {
    t: "Tool-based retrieval with allow-lists",
    d: "Gemini asks for data by calling tools with modules from a fixed enum. Unknown modules, bad dates and unknown tools return structured errors instead of raising.",
  },
  {
    t: "The server writes the numbers",
    d: "The Health Age headline and every snapshot row, including its status band, are computed deterministically on the server. The model writes only three short insights.",
  },
  {
    t: "Citations are checked",
    d: "Each insight must cite records that actually exist, and any number it quotes must match the cited value. Insights that fail are rejected.",
  },
  {
    t: "Fallback templates",
    d: "A rejected insight is replaced with a safe template anchored to the snapshot. Internal citation fields are removed before the response leaves the server.",
  },
];

const MODULES = ["activity", "targets", "meal", "workout", "medical", "metrics", "health_scores", "health_score_details", "membership"];

const PERF = [
  ["Phase timing", "Every Health Age request logs per-phase timings: baseline, context, prompt, Gemini, validation, assembly, persistence."],
  ["Thinking budgets", "Separate, configurable thinking budgets for routing and answering, after profiling showed thinking tokens dominated response time."],
  ["Sequential-call analysis", "The JSON finalize call starts in parallel with the tool round and is discarded if a tool is actually called."],
  ["Connection pooling", "A shared keep-alive HTTP client to Gemini, closed cleanly on shutdown."],
  ["Redundant queries removed", "The member baseline is read once per request, not twice. Module fetches run concurrently, with a short-lived context cache that never caches medical data."],
];

export function PetalYellow() {
  return (
    <article id="petalyellow" aria-labelledby="petalyellow-title" className="relative overflow-hidden bg-cream px-4 py-28 text-[#1b1a17] sm:px-8 md:py-36 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-24 h-[520px] w-[520px] rounded-full bg-yellow/40 blur-[140px]" />
      <div className="relative mx-auto max-w-[1500px]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-5">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-black/50">
            <span className="text-[#a8790f]">04</span> / 04 — Grounded AI
          </p>
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-black/50">Health &amp; fitness · 2026</p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h3 id="petalyellow-title" className="text-[clamp(3.2rem,9vw,8.5rem)] font-semibold leading-[0.9] tracking-[-0.035em]">
              <WordsReveal text="Petal" />{" "}
              <span className="font-serif font-normal italic text-[#a8790f]"><WordsReveal text="Yellow" /></span>{" "}
              <WordsReveal text="AI" />
            </h3>
            <Reveal delay={120}>
              <p className="mt-4 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-black/50">Intelligent Gym &amp; Health Assistant</p>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:pt-6">
            <Reveal>
              <p className="text-xl leading-snug md:text-2xl">Grounded AI for personalised health and fitness insights.</p>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 leading-relaxed text-black/60">
                An AI assistant for a gym and wellness platform. Instead of giving generic advice, it
                retrieves the member&apos;s own records (membership, workouts, meals, activity, sleep,
                HRV, resting heart rate and health scores) and answers from them.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Health Age */}
        <div className="mt-20 grid items-start gap-16 lg:grid-cols-12">
          <div className="sticky-tall lg:col-span-5">
            <Reveal>
              <HealthPhone />
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-black/50">Health Age AI</p>
              <h4 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                It explains your Heart, Body and Lifestyle Age. It never recalculates them.
              </h4>
              <p className="mt-5 max-w-xl leading-relaxed text-black/60">
                A dedicated endpoint turns a stored age into a short explanation: the age compared
                with your real age, your biggest strength, your biggest opportunity, a next milestone,
                and a snapshot of the records behind it. The model loops through tools in text mode,
                then finishes in a strict JSON schema validated with Pydantic.
              </p>
            </Reveal>

            <Reveal className="mt-14">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-black/50">Grounded by design</p>
            </Reveal>
            <ol className="mt-4">
              {GROUNDING.map((g, i) => (
                <Reveal as="li" key={g.t} delay={i * 60} className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-black/10 py-5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1b1a17] font-mono text-[0.65rem] text-cream">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium">{g.t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-black/60">{g.d}</p>
                  </div>
                </Reveal>
              ))}
            </ol>

            {/* Chat assistant */}
            <Reveal className="mt-16 rounded-3xl bg-white/70 p-6 ring-1 ring-black/5 sm:p-8">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-black/50">Member chatbot</p>
              <p className="mt-3 max-w-xl leading-relaxed text-black/70">
                A keyword intent router prefetches the likely data while Gemini decides which modules it
                needs through a single <span className="font-mono text-[0.85em]">get_member_context</span> tool,
                in a bounded loop of up to three rounds. Replies are sanitised, off-topic requests get a fixed
                refusal, and a short follow-up call suggests next questions.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Data modules available to the assistant">
                {MODULES.map((m) => (
                  <li key={m} className="rounded-full bg-[#1b1a17]/[0.06] px-3 py-1 font-mono text-[0.68rem] text-black/70">
                    {m}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* Performance */}
        <div className="mt-28 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-black/50">Performance engineering</p>
              <h4 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Measured first, then made faster.
              </h4>
            </Reveal>
            {/* phase strip */}
            <Reveal delay={120} className="mt-8">
              <div className="flex overflow-hidden rounded-full ring-1 ring-black/10" aria-hidden="true">
                {["baseline", "context", "prompt", "gemini", "validate", "assemble", "persist"].map((p, i) => (
                  <span
                    key={p}
                    className="flex-1 py-2 text-center font-mono text-[0.55rem] uppercase tracking-wider sm:text-[0.6rem]"
                    style={{ background: i === 3 ? "#f2c94c" : i % 2 ? "rgba(27,26,23,0.06)" : "rgba(27,26,23,0.03)" }}
                  >
                    {p}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-black/45">Instrumented phases of a Health Age request.</p>
            </Reveal>
          </div>
          <ul className="lg:col-span-7">
            {PERF.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 60} className="flex flex-col gap-1 border-t border-black/10 py-5 sm:flex-row sm:gap-8">
                <span className="w-56 shrink-0 font-medium">{t}</span>
                <span className="text-sm leading-relaxed text-black/60">{d}</span>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Contribution + architecture */}
        <div className="mt-28 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Contribution
              tone="light"
              accent="#a8790f"
              items={[
                "Grounded AI architecture: tool-based retrieval, server-side validation and fallback templates.",
                "The Health Age AI explanation system for Heart, Body and Lifestyle Age.",
                "Repository and service layers over the gym platform's database, read-only by design.",
                "Latency profiling and the performance work: thinking budgets, parallel finalize, pooling and query clean-up.",
              ]}
            />
          </div>
          <div className="lg:col-span-7">
            <Reveal className="rounded-3xl border border-dashed border-black/20 p-6">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[#a8790f]">Future architecture · not yet built</p>
              <p className="mt-3 leading-relaxed text-black/70">
                The repository, tool and validation layers are designed so the same approach can grow into a
                broader Admin AI Assistant for the Petal Yellow ecosystem.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-20">
          <Reveal className="mb-8 flex items-end justify-between border-b border-black/10 pb-5">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-black/50">Architecture</p>
          </Reveal>
          <StackGroups
            tone="light"
            groups={[
              { label: "API", items: ["Python", "FastAPI", "Pydantic", "Service layer", "Intent routing"] },
              { label: "Data", items: ["PostgreSQL", "SQLAlchemy 2 (async)", "Alembic migrations", "JSONB", "Repository pattern", "Context builder"] },
              { label: "AI", items: ["Google Gemini over REST (httpx)", "Function / tool calling", "Structured JSON output", "Server-side output validation"] },
              { label: "Quality", items: ["pytest coverage for grounding, the tool loop, read-only sessions and caching", "Per-phase timing logs"] },
            ]}
          />
        </div>
      </div>
    </article>
  );
}
