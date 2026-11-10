import { site } from "@/content/site";
import { Reveal, WordsReveal } from "@/components/ui/Reveal";
import { CardStage } from "./CardStage";

const FOCUS = [
  { k: "Artificial Intelligence", v: "LLM agents, tool calling, structured output" },
  { k: "Machine Learning", v: "Training, evaluation and deployment workflows" },
  { k: "Edge AI", v: "Optimised models for constrained devices" },
  { k: "Computer Vision", v: "Object detection and image processing" },
  { k: "Grounded AI Systems", v: "Answers built from real, validated records" },
  { k: "Full-Stack Engineering", v: "FastAPI, PostgreSQL, Next.js, React" },
];

/**
 * The landing section: who I am, first. Introduction on the left, the
 * hanging ID card on the right.
 */
export function About() {
  return (
    <section
      id="top"
      aria-labelledby="about-title"
      className="relative px-4 pb-20 pt-24 sm:px-8 md:pb-28 lg:px-12 lg:pt-[5.5rem]"
    >
      <span id="about" className="absolute top-0" aria-hidden="true" />
      <div className="mx-auto max-w-[1500px]">
        <Reveal className="mb-5 flex items-center justify-between">
          <p className="eyebrow">
            <span className="text-violet">01</span> — About
          </p>
          <p className="eyebrow">{site.location}</p>
        </Reveal>

        <div className="relative overflow-hidden rounded-[28px] border border-violet/30 bg-gradient-to-br from-[#0d0d0c] via-[#111110] to-[#161514] shadow-[0_0_0_1px_rgba(157,140,242,0.06),0_0_60px_-20px_rgba(157,140,242,0.35)]">
          {/* faint violet light, top-right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-violet/10 blur-[120px]"
          />

          <div className="relative grid lg:grid-cols-12">
            {/* Left column */}
            <div className="border-b border-violet/20 p-6 sm:p-10 lg:col-span-7 lg:border-b-0 lg:border-r lg:p-11 xl:px-14">
              <h2 id="about-title" className="eyebrow text-violet">About me</h2>

              <h1 className="display mt-5 text-[clamp(2.9rem,6vw,5.4rem)] uppercase">
                <WordsReveal text="Kerthik Dharshan" />
              </h1>
              <Reveal delay={200}>
                <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.78rem] uppercase tracking-[0.16em]">
                  <span className="text-fg">AI &amp; ML Engineer</span>
                  <span className="hidden h-1 w-1 rounded-full bg-violet sm:block" aria-hidden="true" />
                  <span className="text-muted">Petals Automations</span>
                </p>
              </Reveal>

              <Reveal delay={300}>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-fg-2 md:text-xl md:leading-relaxed">
                  I develop and improve AI and machine-learning workflows, from data and training to
                  evaluation and deployment on edge devices. I hold a Master&apos;s in Data Science and
                  completed an AI engineering internship at ISRO.
                </p>
              </Reveal>
              <Reveal delay={380}>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted">
                  My work spans object detection and motion recognition for edge hardware, AI agents
                  that call tools and return structured output, grounded systems that answer only from
                  validated records, and the APIs and interfaces that turn models into products.
                </p>
              </Reveal>

              <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 xl:grid-cols-3" aria-label="Core capabilities">
                {FOCUS.map((f, i) => (
                  <Reveal as="li" key={f.k} delay={420 + i * 50} className="border-t border-line py-4">
                    <p className="flex items-center gap-2 text-fg">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet" aria-hidden="true" />
                      {f.k}
                    </p>
                    <p className="mt-1 pl-3.5 text-sm text-muted">{f.v}</p>
                  </Reveal>
                ))}
              </ul>

              <Reveal delay={700} className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#work"
                  className="rounded-full bg-fg px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-bg transition-colors hover:bg-violet"
                >
                  View work ↓
                </a>
                <a
                  href="#contact"
                  className="rounded-full border border-line-strong px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-fg-2 transition-colors hover:border-violet hover:text-fg"
                >
                  Get in touch
                </a>
                <a
                  href={site.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line-strong px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-fg-2 transition-colors hover:border-violet hover:text-fg"
                >
                  View resume <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (PDF, opens in a new tab)</span>
                </a>
              </Reveal>
            </div>

            {/* Right column — hanging ID card */}
            <div className="relative lg:col-span-5">
              <CardStage />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
