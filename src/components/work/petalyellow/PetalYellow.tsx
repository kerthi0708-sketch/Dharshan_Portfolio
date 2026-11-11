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
    t: "Personalized data access",
    d: "Each AI request is connected to the correct member and retrieves only the information relevant to that conversation.",
  },
  {
    t: "Grounded in real records",
    d: "The assistant uses validated member data for health, fitness and wellness insights instead of relying on generic or unsupported responses.",
  },
  {
    t: "Controlled AI tool access",
    d: "Tool-based data retrieval ensures the AI accesses only approved information needed to answer a user's question.",
  },
  {
    t: "Verified health insights",
    d: "Important health values and snapshots are controlled by the application, helping ensure the AI presents accurate information.",
  },
  {
    t: "Response validation",
    d: "AI-generated insights are checked against available records before they are presented to the user.",
  },
  {
    t: "Safe fallback responses",
    d: "If an AI response cannot be validated, the system uses a reliable fallback instead of presenting unsupported information.",
  },
];

// Every capability below is implemented in the Petal Yellow AI backend
// (routes/*, services/*). Member-data chat is enabled by a feature setting.
// These are product features; personal contributions are listed separately.
const CAPABILITIES = [
  { t: "Health Age insights", d: "Explains a member's Heart, Body and Lifestyle Age with a strength, an opportunity and a next milestone." },
  { t: "Meal photo analysis", d: "Identifies the foods in a meal photo and estimates calories, protein, carbs, fats and fibre." },
  { t: "Personal workout plans", d: "Builds a 7-day workout plan from a member's medical intake form and uploaded health reports." },
  { t: "Diet plans", d: "Produces a dietitian-style plan: daily nutrition, meals, and foods to prefer, limit or avoid." },
  { t: "Body transformation analysis", d: "Compares before and after photos to describe visible progress and suggest next workouts." },
  { t: "Posture analysis", d: "Scores posture from body landmarks with a rules engine, then explains the findings in plain language." },
  { t: "Nutrition calculator", d: "Estimates calories and macros for any food and portion size." },
];

const ASSISTANT_CAN = [
  "Answers personal questions from the member's own records when member data is enabled",
  "Compares today's readings with the member's personal baseline and goals",
  "Understands dates like \u201cyesterday\u201d or \u201c3 days ago\u201d",
  "Suggests three relevant follow-up questions after each answer",
  "Remembers the recent conversation and names each chat",
  "Replies in the member's language and declines off-topic requests",
];

const DATA_AREAS = [
  "Activity & steps",
  "Daily targets",
  "Meal plan",
  "Workout plan",
  "Medical history",
  "Health metrics",
  "Health scores",
  "Sleep, HRV & resting heart rate",
  "Membership",
];

const PERF = [
  ["Performance profiling", "Identified AI response latency and measured each stage of the Health Age request."],
  ["AI response optimization", "Improved the generation workflow while preserving grounded and validated responses."],
  ["Thinking configuration", "Introduced configurable AI reasoning settings to balance response quality and speed."],
  ["Database efficiency", "Removed redundant queries and improved how member data is retrieved."],
  ["Connection management", "Added reusable HTTP connections to improve the efficiency of AI service communication."],
];

export function PetalYellow() {
  return (
    <article id="petalyellow" aria-labelledby="petalyellow-title" className="relative overflow-hidden bg-cream px-4 py-28 text-[#1b1a17] sm:px-8 md:py-36 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-24 h-[520px] w-[520px] rounded-full bg-yellow/40 blur-[140px]" />
      <div className="relative mx-auto max-w-[1500px]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-5">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-black/50">
            <span className="text-[#a8790f]">Personalized AI</span>
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
              <p className="text-xl leading-snug md:text-2xl">A personalized AI health and fitness assistant, grounded in real member data.</p>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 leading-relaxed text-black/60">
                Petal Yellow AI is the intelligence behind a gym and wellness platform. Members chat with an
                AI assistant designed to answer personalized questions about workouts, activity, sleep,
                recovery, nutrition and health scores, and use AI features for meals, training plans, diet,
                posture and body progress.
              </p>
            </Reveal>
          </div>
        </div>

        {/* AI capabilities */}
        <div className="mt-20">
          <Reveal className="flex items-end justify-between border-b border-black/10 pb-5">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-black/50">Product capabilities</p>
            <p className="hidden font-mono text-[0.72rem] uppercase tracking-[0.16em] text-black/50 sm:block">8 AI features · one platform</p>
          </Reveal>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal as="li" className="flex flex-col justify-between rounded-2xl bg-[#1b1a17] p-5 text-cream sm:col-span-2">
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-yellow">Main capability</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight">Member AI Assistant</p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-cream/70">
                  A personal chat assistant for gym members, designed to answer questions about training,
                  food, sleep, recovery, health scores and membership using the member&apos;s own records.
                </p>
              </div>
              <a href="#py-assistant" className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-yellow hover:text-cream">
                How it works ↓
              </a>
            </Reveal>
            {CAPABILITIES.map((c, i) => (
              <Reveal as="li" key={c.t} delay={60 + i * 50} className="rounded-2xl bg-white/60 p-5 ring-1 ring-black/5">
                <p className="font-medium">{c.t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-black/60">{c.d}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <p className="mt-4 text-xs text-black/45">
              Features of the Petal Yellow AI platform. My personal contribution is listed separately below.
            </p>
          </Reveal>
        </div>

        {/* Member AI Assistant */}
        <Reveal className="mt-20 rounded-3xl bg-white/70 p-6 ring-1 ring-black/5 sm:p-10">
          <div id="py-assistant" className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-black/50">Member AI Assistant</p>
              <h4 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Ask about training, food, sleep and progress, answered from your own data.
              </h4>
              <p className="mt-5 max-w-xl leading-relaxed text-black/60">
                The AI is designed to answer personalized questions using relevant member records when the
                member-data feature is enabled. Instead of loading a whole database into every request, it
                fetches only the records a question needs, then answers in plain language.
              </p>
              <ul className="mt-8 grid gap-x-8 sm:grid-cols-2">
                {ASSISTANT_CAN.map((a) => (
                  <li key={a} className="flex gap-3 border-t border-black/10 py-3 text-sm leading-relaxed text-black/70">
                    <span className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#a8790f]" aria-hidden="true" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-5">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-black/50">Member data it can use</p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Member data the assistant can use">
                {DATA_AREAS.map((m) => (
                  <li key={m} className="rounded-full bg-[#1b1a17]/[0.06] px-3 py-1.5 font-mono text-[0.68rem] text-black/70">
                    {m}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-black/45">
                Member-data answers are controlled by a feature setting. Medical data is never cached.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Health Age */}
        <div className="mt-20 grid items-start gap-16 lg:grid-cols-12">
          <div className="sticky-tall lg:col-span-5">
            <Reveal>
              <HealthPhone />
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-black/50">Feature spotlight · Health Age AI</p>
              <h4 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                It explains your Heart, Body and Lifestyle Age. It never recalculates them.
              </h4>
              <p className="mt-5 max-w-xl leading-relaxed text-black/60">
                The Health Age AI feature transforms existing health scores into clear, personalized
                insights. It explains a member&apos;s biggest strength, key opportunity and next milestone
                while keeping stored health values authoritative and grounded in verified records.
              </p>
            </Reveal>

            <Reveal className="mt-14">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-black/50">Trustworthy AI by design</p>
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
                "Improved the personalized AI experience by integrating relevant member health, fitness and wellness data into AI workflows.",
                "Built and extended Gemini tool-calling workflows to support reliable, reusable AI interactions.",
                "Developed grounded AI validation and fallback mechanisms to help keep personalized responses accurate and reliable.",
                "Built the repository and service architecture for retrieving health scores and member health details.",
                "Profiled and optimized the AI response pipeline to improve performance and reduce unnecessary processing.",
                "Designed and implemented the Health Age AI workflow for Heart Age, Body Age and Lifestyle Age as a specialized feature within the broader AI platform.",
                "Designed the premium, structured AI response experience for personalized Health Age insights.",
              ]}
              note="My work focused on building reliable and personalized AI experiences across data integration, AI workflows, validation, response design and performance optimization. Health Age was one specialized feature within this broader work."
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
              { label: "AI", items: ["Google Gemini over REST (httpx)", "Function / tool calling", "Structured JSON output", "Multimodal input (photos, PDF reports)", "Server-side output validation"] },
              { label: "Quality", items: ["pytest coverage for grounding, the tool loop, read-only sessions and caching", "Per-phase timing logs"] },
            ]}
          />
        </div>
      </div>
    </article>
  );
}
