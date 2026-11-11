import { Reveal, WordsReveal } from "@/components/ui/Reveal";
import { Contribution, StackGroups } from "../shared";
import { AgentRun } from "./AgentRun";

/*
 * Verified against the Pramoj AI backend (Projects/pramoj_ai): main.py, core.py,
 * tools.py, prompt.py, prompt_pi.py, conversation_flow.py, board_profile.py,
 * database/*.json, tests/, Pi/Pi (pi_runner.py, uart_bridge.py) and git history.
 */

const LOOP = [
  { k: "Gemini agent", v: "LangGraph agent decides the next command" },
  { k: "execute_cmd", v: "Native tool call with a typed argument schema" },
  { k: "interrupt()", v: "Graph pauses; a cmd event streams to the browser" },
  { k: "On the board", v: "App Lab runs the command on the connected device" },
  { k: "resume", v: "The result returns to /call_agent and the graph continues" },
];

export function Pramoj() {
  return (
    <article id="pramoj" aria-labelledby="pramoj-title" className="relative overflow-hidden bg-[#060a12] px-4 py-28 sm:px-8 md:py-36 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-pramoj/[0.08] blur-[130px]" />
      <div className="relative mx-auto max-w-[1500px]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <p className="eyebrow"><span className="text-pramoj">Generative AI workflow</span></p>
          <p className="eyebrow">AIoT app creation · 2026</p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h3 id="pramoj-title" className="display text-[clamp(3.4rem,10vw,9rem)]">
              <WordsReveal text="Pramoj" /> <span className="text-pramoj"><WordsReveal text="AI" /></span>
            </h3>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <Reveal>
              <p className="text-xl leading-snug text-fg md:text-2xl">
                A Gemini-powered assistant that takes an idea in plain words and builds a complete,
                working IoT app on a real board.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 leading-relaxed text-muted">
                Inside a customised Arduino App Lab, the user describes what they want. The agent
                plans the app and asks for approval, then creates the project and installs what it
                needs. It writes the web UI, the Python backend, the Arduino sketch and the config,
                then runs the app, reads the logs and fixes problems before it reports back.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Idea → project ribbon */}
        <Reveal className="mt-16">
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.72rem] uppercase tracking-[0.14em]" aria-label="Workflow">
            {["Idea", "Plan & approval", "Create app", "Requirements", "Code generation", "Test & debug", "Working project"].map((s, i, a) => (
              <li key={s} className="flex items-center gap-3">
                <span className={i === 0 || i === a.length - 1 ? "text-fg" : "text-pramoj"}>{s}</span>
                {i < a.length - 1 && <span className="text-white/25" aria-hidden="true">→</span>}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-8">
          <AgentRun />
          <p className="mt-3 text-xs text-muted">
            Illustrative run. The stage names, event types (think / text / cmd), commands and file layout
            come from the agent&apos;s prompt and tools. Switch the board to see the Raspberry Pi path.
          </p>
        </Reveal>

        {/* Human-in-the-loop */}
        <div className="mt-24 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Engineering story</p>
              <h4 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                The model plans. The real board executes. Every step returns to the agent.
              </h4>
              <p className="mt-5 max-w-xl leading-relaxed text-muted">
                The AI service never touches hardware directly. Any command that changes the board
                pauses the agent graph and streams to the user&apos;s App Lab, which runs it. The
                result resumes the graph, so the agent reasons over what actually happened, not over
                what it expected.
              </p>
            </Reveal>

            <Reveal delay={120} className="relative mt-12">
              <ol className="relative grid gap-3 sm:grid-cols-5" aria-label="Human-in-the-loop command loop">
                {LOOP.map((n, i) => (
                  <li key={n.k} className="relative rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <span className="font-mono text-[0.6rem] text-pramoj">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-2 font-mono text-sm text-fg">{n.k}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{n.v}</p>
                  </li>
                ))}
              </ol>
              {/* continuous loop line */}
              <svg className="mt-3 hidden w-full sm:block" viewBox="0 0 1000 40" aria-hidden="true">
                <path d="M980 0 V20 Q980 34 966 34 H34 Q20 34 20 20 V0" fill="none" stroke="rgba(106,168,255,0.35)" strokeDasharray="4 6" />
                <circle r="4" fill="#6aa8ff" className="loop-dot">
                  <animateMotion dur="3.2s" repeatCount="indefinite" path="M980 0 V20 Q980 34 966 34 H34 Q20 34 20 20 V0" />
                </circle>
              </svg>
            </Reveal>

            <ul className="mt-12 grid gap-x-10 md:grid-cols-2">
              {[
                "A conversation state machine is added to every prompt (plan approved, build in progress, create failed, completed, and so on). It is driven by real tool results.",
                "An auth guard refuses changes until the user is logged in and a board is connected.",
                "A strict test-and-debug loop: run, wait for the build, check status, read the logs, with at most three fix attempts.",
                "Grounding data for examples and bricks is answered on the server, without a round-trip to the board.",
                "Streaming parses the model's <think> and <text> tags live. Empty or malformed Gemini responses are caught and reported, never dropped silently.",
                "Conversation state is stored in a PostgreSQL checkpointer. Voice input uses Sarvam AI speech-to-text.",
              ].map((t, i) => (
                <Reveal as="li" key={i} delay={i * 50} className="flex gap-3 border-t border-white/10 py-4 text-sm leading-relaxed text-fg-2">
                  <span className="font-mono text-[0.7rem] text-pramoj">{String(i + 1).padStart(2, "0")}</span>
                  <span>{t}</span>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="space-y-12 lg:col-span-5">
            <Contribution
              accent="var(--pramoj)"
              items={[
                "Took ownership of improving the agent workflow, including the main system prompt, command tools and streaming implementation.",
                "Expanded the platform with Raspberry Pi as a second target, including board routing, a dedicated Pi prompt and compatibility data.",
                "Developed the conversation-flow state machine to keep the AI-assisted build process structured and on track.",
                "Implemented the Raspberry Pi hardware integration layer, including a UART bridge to a USB-attached UNO R4 Minima and an upload-and-run workflow.",
              ]}
              note="Initially focused on improving the AI workflow, then expanded my contribution across the platform's Raspberry Pi support, conversation flow, and hardware integration."
            />

            <Reveal>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Deployment targets</p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-xl border border-white/10 p-4">
                  <p className="flex items-center justify-between text-fg">
                    Arduino UNO Q <span className="font-mono text-[0.6rem] uppercase tracking-wider text-pramoj">Default</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">Python and sketch linked through the board&apos;s Bridge. Apps live in ArduinoApps on the device.</p>
                </div>
                <div className="rounded-xl border border-white/10 p-4">
                  <p className="flex items-center justify-between text-fg">
                    Raspberry Pi <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted">Feature-flagged</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Python and the web UI run natively on the Pi; a USB UNO R4 Minima handles the sketch. Only
                    pure-Python bricks are allowed. The Pi compatibility layer can also run Edge Impulse
                    <span className="font-mono"> .eim</span> models locally.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-24">
          <Reveal className="mb-8 flex items-end justify-between border-b border-white/10 pb-5">
            <p className="eyebrow">Architecture</p>
            <p className="eyebrow hidden sm:block">Agent · Streaming · Data · Quality</p>
          </Reveal>
          <StackGroups
            groups={[
              { label: "Agent", items: ["Google Gemini via LangChain", "LangGraph create_agent", "Dynamic prompt middleware", "Tool-call limit", "interrupt / resume"] },
              { label: "API & streaming", items: ["FastAPI", "Server-Sent Events (think · text · cmd)", "UI context injected per request", "Sarvam AI voice input"] },
              { label: "Data", items: ["PostgreSQL", "LangGraph Postgres checkpointer", "Chat history and naming", "Curated examples and brick catalogues"] },
              { label: "Quality", items: ["pytest suite for board routing, creation flow, Pi prompt and app.yaml generation", "Hash-pinned UNO Q prompt baseline", "LangSmith tracing", "Docker"] },
            ]}
          />
        </div>
      </div>
    </article>
  );
}
