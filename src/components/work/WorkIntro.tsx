import { Reveal } from "@/components/ui/Reveal";
import { ScrollDrift } from "@/components/ui/ScrollDrift";

const INDEX = [
  { id: "petaledge", n: "01", name: "PetalEdge", line: "End-to-end Edge AI platform", tags: "Edge AI · Computer vision · MLOps", color: "var(--edge)" },
  { id: "codecraft", n: "02", name: "Code Craft AI", line: "Chat and voice to robot programs", tags: "AI agents · Structured output", color: "var(--craft)" },
  { id: "pramoj", n: "03", name: "Pramoj AI", line: "Idea to a working IoT app on real hardware", tags: "Generative AI · Agent workflows", color: "var(--pramoj)" },
  { id: "petalyellow", n: "04", name: "Petal Yellow AI", line: "Grounded health and fitness assistant", tags: "Grounded AI · Tool calling", color: "var(--yellow)" },
];

export function WorkIntro() {
  return (
    <div className="overflow-hidden px-4 pt-28 sm:px-8 md:pt-40 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <Reveal className="flex items-center justify-between border-b border-line pb-5">
          <p className="eyebrow">
            <span className="text-accent">02</span> — Selected work
          </p>
          <p className="eyebrow">Four products · 2026</p>
        </Reveal>
      </div>

      <h2 id="work-title" className="sr-only">Selected work</h2>
      <ScrollDrift from={4} to={-6} className="mt-10 whitespace-nowrap">
        <p aria-hidden="true" className="display text-[clamp(3rem,11vw,13rem)] uppercase">
          Selected <span className="font-serif font-normal normal-case italic tracking-normal text-accent" style={{ fontVariationSettings: "normal" }}>work</span>
        </p>
      </ScrollDrift>

      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-fg-2">
            Four AI products, each showing a different side of the work: training and deploying models
            to edge hardware, agents that generate structured programs, generative workflows that build
            real projects, and grounded systems that answer only from real data.
          </p>
        </Reveal>

        <ol className="mt-16" aria-label="Project index">
          {INDEX.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 70}>
              <a
                href={`#${p.id}`}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 border-t border-line py-6 transition-colors md:grid-cols-[4rem_1.2fr_1fr_auto]"
                style={{ ["--c" as string]: p.color }}
              >
                <span className="font-mono text-xs text-muted">{p.n}</span>
                <span className="text-2xl font-semibold tracking-tight text-fg transition-colors duration-300 group-hover:text-[var(--c)] md:text-4xl">
                  {p.name}
                </span>
                <span className="hidden text-sm text-muted md:block">
                  {p.line}
                  <span className="mt-1 block font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted/70">{p.tags}</span>
                </span>
                <span className="text-xl text-muted transition-transform duration-500 group-hover:translate-x-1 group-hover:text-[var(--c)]" aria-hidden="true">
                  ↘
                </span>
              </a>
            </Reveal>
          ))}
        </ol>
      </div>
    </div>
  );
}
