import { Reveal } from "@/components/ui/Reveal";

// Roles, titles, dates and responsibilities from the resume.
const ROLES = [
  {
    role: "AI Engineer",
    org: "Petals Automations",
    period: "January 2026 — Present",
    current: true,
    points: [
      "Develop and improve AI/ML workflows for model training, evaluation and deployment in edge AI applications.",
      "Work with Python and machine-learning tools to troubleshoot training pipelines and improve model reliability.",
      "Built PetalEdge's object detection and motion recognition pipelines end to end, from data to edge deployment.",
    ],
  },
  {
    role: "Artificial Intelligence Engineer Intern",
    org: "ISRO",
    period: "December 2023 — March 2024",
    current: false,
    points: [
      "Assisted in developing AI models for automation and data-processing tasks.",
      "Worked with image processing and deep-learning techniques for detection and classification.",
      "Analysed datasets and performed preprocessing to improve model accuracy.",
    ],
  },
];

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="border-t border-line px-4 py-28 sm:px-8 md:py-36 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <Reveal className="flex items-center justify-between border-b border-line pb-5">
          <p className="eyebrow"><span className="text-accent">Experience</span></p>
          <p className="eyebrow hidden sm:block">Timeline</p>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 id="experience-title" className="display text-[clamp(2.6rem,5vw,4.5rem)] uppercase">
              Where I&apos;ve <span className="font-serif font-normal normal-case italic tracking-normal text-accent" style={{ fontVariationSettings: "normal" }}>worked</span>
            </h2>
          </Reveal>

          <ol className="relative lg:col-span-8">
            <span className="absolute bottom-0 left-[7px] top-2 w-px bg-line" aria-hidden="true" />
            {ROLES.map((r, i) => (
              <Reveal as="li" key={r.org} delay={i * 120} className="relative pb-14 pl-10 last:pb-0">
                <span
                  className={`absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 ${
                    r.current ? "border-accent bg-accent/30" : "border-line-strong bg-bg"
                  }`}
                  aria-hidden="true"
                />
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-muted">
                  {r.period}
                  {r.current && <span className="ml-3 text-accent">● Current</span>}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-fg md:text-3xl">{r.role}</h3>
                <p className="mt-1 font-serif text-xl italic text-fg-2">{r.org}</p>
                <ul className="mt-6 max-w-3xl">
                  {r.points.map((p) => (
                    <li key={p} className="border-t border-line py-3 text-sm leading-relaxed text-muted">
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
}
