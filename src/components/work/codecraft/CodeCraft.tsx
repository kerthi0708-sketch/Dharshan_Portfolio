import { Reveal } from "@/components/ui/Reveal";
import { Contribution, StackGroups } from "../shared";
import { BlockWorkspace } from "./BlockWorkspace";

/*
 * Verified against the Code Craft AI backend (Projects/ai): README, prompt.py,
 * tools.py, models.py (AgentResponse validator), core.py, main.py,
 * transcribe.py, CI workflows and git history.
 */

const TASKS = [
  { k: "blockly_code", v: "A complete program, plus a child-friendly explanation" },
  { k: "others", v: "Concept questions and debugging diagnoses" },
  { k: "manual_program", v: "Loads a curated example program by name" },
  { k: "clear_workspace", v: "Clears the editor" },
  { k: "change_mode", v: "Switches between program and animation mode" },
];

const BOARDS = ["Petal Mini", "Petal AI/ML", "Petal UNO", "Petal Robo UNO"];

export function CodeCraft() {
  return (
    <article id="codecraft" aria-labelledby="codecraft-title" className="relative overflow-hidden bg-[#0e0d0a] px-4 py-28 sm:px-8 md:py-36 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
          <p className="eyebrow"><span className="text-craft">AI agent</span></p>
          <p className="eyebrow">Educational robotics · 2026</p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {/* Title as snapped blocks */}
            <h3 id="codecraft-title" className="flex flex-col items-start gap-1.5" aria-label="Code Craft AI">
              {[
                { t: "Code", c: "#ffbf00", r: "rounded-t-[28px] rounded-b-lg" },
                { t: "Craft", c: "#ff8c1a", r: "rounded-lg ml-[0.5em]" },
                { t: "AI", c: "#2fb2a8", r: "rounded-lg ml-[1em]" },
              ].map((b, i) => (
                <Reveal key={b.t} delay={i * 120} y={-30}>
                  <span
                    aria-hidden="true"
                    className={`display inline-block px-[0.22em] pb-[0.08em] pt-[0.12em] text-[clamp(3rem,9vw,8rem)] text-black ${b.r}`}
                    style={{ background: b.c, boxShadow: "0 6px 0 rgba(0,0,0,0.35)" }}
                  >
                    {b.t}
                  </span>
                </Reveal>
              ))}
            </h3>
          </div>
          <div className="flex flex-col justify-end lg:col-span-5">
            <Reveal>
              <p className="text-xl leading-snug text-fg md:text-2xl">
                An AI assistant that turns a child&apos;s chat or voice request into a working block
                program for Petal robotics boards.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 leading-relaxed text-muted">
                Learners up to 8th grade describe what they want their robot to do. A Gemini
                agent looks up the exact blocks available for their board, assembles a complete
                Scratch-style program, explains it simply, and sends it straight into the
                editor. It can also answer questions and help debug.
              </p>
            </Reveal>
            <Reveal delay={200} className="mt-6 flex flex-wrap gap-2">
              {BOARDS.map((b) => (
                <span key={b} className="rounded-full border border-craft/30 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-craft">
                  {b}
                </span>
              ))}
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-16">
          <BlockWorkspace />
          <p className="mt-3 text-xs text-muted">
            Illustrative conversation. The program is the curated &ldquo;Breathing Light&rdquo; example for Petal UNO,
            rendered from its block JSON.
          </p>
        </Reveal>

        {/* How it stays correct */}
        <div className="mt-24 grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Engineering story</p>
              <h4 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Grounded in real block schemas, and corrected before anything reaches the editor.
              </h4>
            </Reveal>

            <ol className="mt-10 space-y-0">
              {[
                ["Tool-grounded generation", "The agent never guesses block shapes. It calls tools that fetch the board's block catalogue and the exact block JSON from PostgreSQL, then fills parameters and links the blocks."],
                ["Structured output", "Every reply is a typed AgentResponse with one of five tasks, so the editor always knows what to do with it."],
                ["Self-correction loop", "A validator rejects programs that are empty, aren't JSON, or aren't a complete block graph. The error goes back to Gemini, which regenerates."],
                ["Safe serving path", "A second guard checks the program again before it is sent. A bad program becomes a friendly chat reply instead of a broken workspace."],
                ["Deterministic post-processing", "Programs are extracted from prose, the block graph is reordered from its root, and the editor mode is inferred from the hat block, not taken from the model."],
              ].map(([t, d], i) => (
                <Reveal as="li" key={t} delay={i * 60} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-5">
                  <span className="font-mono text-sm text-craft">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-medium text-fg">{t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          <div className="space-y-12 lg:col-span-5">
            <Contribution
              accent="var(--craft)"
              items={[
                "Took ownership of improving the AI workflow, including structured JSON output handling, program validation and the self-correction flow.",
                "Strengthened error handling with safeguards that turn unusable program outputs into safe, meaningful chat responses.",
                "Improved chat history handling so it accurately records the tasks and results returned by the AI agent.",
                "Optimized the agent workflow and tool-calling configuration for more reliable task completion.",
                "Improved the API and developer experience with OpenAPI descriptions, examples, JWT configuration, documentation support and a health endpoint.",
              ]}
              note="Initially focused on targeted improvements, then took broader ownership of the AI workflow, its reliability, and ongoing project maintenance."
            />
            <Reveal>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Five response tasks</p>
              <dl className="mt-4">
                {TASKS.map((t) => (
                  <div key={t.k} className="flex flex-col gap-0.5 border-t border-line py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4">
                    <dt className="font-mono text-xs text-craft">{t.k}</dt>
                    <dd className="text-sm text-muted">{t.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        <div className="mt-24">
          <Reveal className="mb-8 flex items-end justify-between border-b border-line pb-5">
            <p className="eyebrow">Architecture</p>
            <p className="eyebrow hidden sm:block">Agent · Voice · Data · Delivery</p>
          </Reveal>
          <StackGroups
            groups={[
              { label: "Agent", items: ["Google Gemini via LangChain", "create_agent (LangGraph runtime)", "Pydantic structured output", "Dynamic per-board prompt", "Tool-call limit middleware"] },
              { label: "Voice", items: ["Gemini transcription tuned for English and Indian languages, including code-mixed speech", "Sarvam AI speech-to-text"] },
              { label: "Data & memory", items: ["PostgreSQL", "asyncpg + psycopg pools", "LangGraph Postgres checkpointer for per-chat memory", "Curated example programs"] },
              { label: "Delivery", items: ["FastAPI + Uvicorn", "JWT auth", "Concurrency cap and backoff with jitter for rate limits", "LangSmith tracing", "GitHub Actions deploy with health check and rollback"] },
            ]}
          />
        </div>
      </div>
    </article>
  );
}
