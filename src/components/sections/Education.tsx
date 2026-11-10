import { Reveal } from "@/components/ui/Reveal";

// Degrees, institution, dates and certifications from the resume.
const DEGREES = [
  { degree: "M.Sc. Data Science", school: "The American College, Madurai", period: "2022 — 2024" },
  { degree: "B.Sc. Computer Science", school: "The American College, Madurai", period: "2019 — 2022" },
];

const CERTIFICATIONS = [
  { name: "Crash Course on Python", by: "Google (Coursera)", year: "2024" },
  { name: "Databases and SQL for Data Science", by: "IBM (Coursera)", year: "2024" },
  { name: "Data Analytics", by: "Accord Info Matrix", year: "2025" },
];

export function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="border-t border-line px-4 py-28 sm:px-8 md:py-36 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <Reveal className="flex items-center justify-between border-b border-line pb-5">
          <p className="eyebrow"><span className="text-accent">05</span> — Education</p>
          <p className="eyebrow hidden sm:block">Foundations</p>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 id="education-title" className="display text-[clamp(2.6rem,5vw,4.5rem)] uppercase">
              <span className="font-serif font-normal normal-case italic tracking-normal text-accent" style={{ fontVariationSettings: "normal" }}>Education</span>
            </h2>
          </Reveal>

          <div className="lg:col-span-8">
            <ul>
              {DEGREES.map((d, i) => (
                <Reveal
                  as="li"
                  key={d.degree}
                  delay={i * 100}
                  className="grid gap-2 border-t border-line py-6 last:border-b sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8"
                >
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-fg md:text-3xl">{d.degree}</h3>
                    <p className="mt-1 font-serif text-lg italic text-fg-2">{d.school}</p>
                  </div>
                  <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-muted">{d.period}</p>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={220} className="mt-12">
              <h3 className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">Certifications</h3>
              <ul className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-3">
                {CERTIFICATIONS.map((c) => (
                  <li key={c.name} className="text-sm leading-relaxed">
                    <span className="text-fg-2">{c.name}</span>
                    <span className="block text-muted">
                      {c.by} · {c.year}
                    </span>
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
