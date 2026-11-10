import { Reveal } from "@/components/ui/Reveal";

const GROUPS = [
  {
    n: "A",
    title: "AI & Machine Learning",
    items: ["Python", "TensorFlow", "PyTorch", "scikit-learn", "Deep Learning", "CNNs", "Regression", "Classification"],
    note: "Model training, evaluation and edge optimisation.",
  },
  {
    n: "B",
    title: "Data & Analysis",
    items: ["SQL", "MySQL", "Exploratory Data Analysis", "Feature Engineering", "Model Evaluation", "Power BI", "Tableau", "Matplotlib", "Seaborn", "Excel"],
    note: "From raw datasets to decisions.",
  },
  {
    n: "C",
    title: "Full-Stack & Backend",
    items: ["FastAPI", "Next.js", "React", "TypeScript", "PostgreSQL", "REST APIs"],
    note: "The product around the model.",
  },
  {
    n: "D",
    title: "Infrastructure & Tools",
    items: ["Docker", "Redis", "Celery", "Git", "Jupyter Notebook"],
    note: "Jobs, queues and reproducible work.",
  },
];

const AI_TOOLS = ["Claude Code", "Codex", "Google Gemini"];

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="px-4 py-28 sm:px-8 md:py-36 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <Reveal className="flex items-center justify-between border-b border-line pb-5">
          <p className="eyebrow"><span className="text-accent">Skills</span></p>
          <p className="eyebrow hidden sm:block">Toolkit</p>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 id="skills-title" className="display text-[clamp(2.6rem,5vw,4.5rem)] uppercase">
              The <span className="font-serif font-normal normal-case italic tracking-normal text-accent" style={{ fontVariationSettings: "normal" }}>toolkit</span>
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-muted">
              Tools in service of the products above. These are the ones I reach for, grouped by the job they do.
            </p>
          </Reveal>

          <div className="lg:col-span-8">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {GROUPS.map((g, i) => (
              <Reveal key={g.title} delay={i * 80} className="group bg-bg p-6 transition-colors duration-500 hover:bg-bg-2 sm:p-8">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold text-fg">{g.title}</h3>
                  <span className="font-serif text-2xl italic text-muted transition-colors group-hover:text-accent">{g.n}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{g.note}</p>
                <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                  {g.items.map((s) => (
                    <li key={s} className="text-[0.95rem] text-fg-2">
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          {/* AI-assisted engineering tools: a quiet strip, secondary to the core skills */}
          <Reveal delay={360} className="mt-4 flex flex-col gap-3 rounded-2xl border border-line px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <h3 className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">AI-assisted engineering</h3>
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-2" aria-label="AI development tools">
              {AI_TOOLS.map((t, i) => (
                <li key={t} className="flex items-center gap-3">
                  {i > 0 && <span className="h-1 w-1 rounded-full bg-muted/60" aria-hidden="true" />}
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
