const ITEMS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Edge AI",
  "Computer Vision",
  "Grounded Intelligent Systems",
  "Full-Stack Engineering",
];

/** Continuous band that carries the reader from the introduction into the work. */
export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {ITEMS.map((t, i) => (
        <li key={t} className="flex items-center">
          <span
            className={`display whitespace-nowrap px-6 text-[clamp(2rem,5vw,4.5rem)] uppercase ${
              i % 2 ? "font-serif !font-normal normal-case italic tracking-normal text-accent" : "text-fg"
            }`}
            style={i % 2 ? { fontVariationSettings: "normal" } : undefined}
          >
            {t}
          </span>
          <span className="text-2xl text-muted" aria-hidden="true">
            →
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative overflow-hidden border-y border-line py-6" aria-label="Areas of work">
      <div className="marquee-track flex w-max" style={{ ["--marquee-duration" as string]: "48s" }}>
        {row(false)}
        {row(true)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
