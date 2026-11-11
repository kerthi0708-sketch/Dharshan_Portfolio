import { Reveal } from "@/components/ui/Reveal";
import { ScrollDrift } from "@/components/ui/ScrollDrift";
import { WorkShowcase, type ShowcaseProject } from "./WorkShowcase";

const INDEX: ShowcaseProject[] = [
  { id: "petaledge", n: "01", name: "PetalEdge", kind: "Edge AI platform", line: "End-to-end Edge AI platform for training, optimizing and deploying computer vision and motion models.", tags: "Edge AI · Computer vision · MLOps", color: "var(--edge)" },
  { id: "codecraft", n: "02", name: "Code Craft AI", kind: "AI agent", line: "AI-powered workflow that transforms natural language into structured programs for connected hardware.", tags: "AI agents · Structured output", color: "var(--craft)" },
  { id: "pramoj", n: "03", name: "Pramoj AI", kind: "Generative AI workflow", line: "Generative AI platform that turns ideas into working IoT applications on real hardware.", tags: "Generative AI · Agent workflows", color: "var(--pramoj)" },
  { id: "petalyellow", n: "04", name: "Petal Yellow AI", kind: "Personalized AI", line: "Personalized AI health and fitness platform with intelligent insights and multiple AI-powered features.", tags: "Grounded AI · Tool calling", color: "var(--yellow)" },
];

export function WorkIntro() {
  return (
    <div className="overflow-hidden px-4 pt-28 sm:px-8 md:pt-40 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <Reveal className="flex items-center justify-between border-b border-line pb-5">
          <p className="eyebrow">
            <span className="text-accent">Selected work</span>
          </p>
          <p className="eyebrow">Four products · 2026</p>
        </Reveal>
      </div>

      <h2 id="work-title" className="sr-only">Selected work</h2>
      {/* Aligned to the content column; drifts only rightward from it, so it never clips. */}
      <div className="mx-auto max-w-[1500px]">
        <ScrollDrift from={6} to={0} className="mt-10 w-fit whitespace-nowrap">
          <p aria-hidden="true" className="display text-[clamp(2.6rem,9.5vw,11rem)] uppercase">
            Selected <span className="font-serif font-normal normal-case italic tracking-normal text-accent" style={{ fontVariationSettings: "normal" }}>work</span>
          </p>
        </ScrollDrift>
      </div>

      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-fg-2">
            Four AI products, each showing a different side of the work: training and deploying models
            to edge hardware, agents that generate structured programs, generative workflows that build
            real projects, and grounded systems that answer only from real data.
          </p>
        </Reveal>

        <WorkShowcase projects={INDEX} />
      </div>
    </div>
  );
}
