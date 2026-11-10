import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

export function StackGroups({
  groups,
  tone = "dark",
}: {
  groups: { label: string; items: string[] }[];
  tone?: "dark" | "light";
}) {
  const line = tone === "dark" ? "border-line" : "border-black/10";
  const muted = tone === "dark" ? "text-muted" : "text-black/50";
  const fg = tone === "dark" ? "text-fg-2" : "text-black/80";
  return (
    <dl className={`grid gap-px sm:grid-cols-2 lg:grid-cols-4`}>
      {groups.map((g, i) => (
        <Reveal key={g.label} delay={i * 70} className={`border-t ${line} pt-4 pb-6 sm:pr-6`}>
          <dt className={`font-mono text-[0.7rem] uppercase tracking-[0.16em] ${muted}`}>{g.label}</dt>
          <dd className={`mt-3 text-sm leading-relaxed ${fg}`}>{g.items.join(" · ")}</dd>
        </Reveal>
      ))}
    </dl>
  );
}

export function Contribution({
  items,
  note,
  accent,
  tone = "dark",
}: {
  items: string[];
  note?: ReactNode;
  accent: string;
  tone?: "dark" | "light";
}) {
  const muted = tone === "dark" ? "text-muted" : "text-black/55";
  const fg = tone === "dark" ? "text-fg-2" : "text-black/80";
  const line = tone === "dark" ? "border-line" : "border-black/10";
  return (
    <div>
      <p className={`font-mono text-[0.7rem] uppercase tracking-[0.16em] ${muted}`}>My contribution</p>
      <ul className="mt-4 space-y-0">
        {items.map((it, i) => (
          <Reveal as="li" key={i} delay={i * 50} className={`flex gap-3 border-t ${line} py-3 text-sm leading-relaxed ${fg}`}>
            <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} aria-hidden="true" />
            <span>{it}</span>
          </Reveal>
        ))}
      </ul>
      {note && <p className={`mt-4 text-xs leading-relaxed ${muted}`}>{note}</p>}
    </div>
  );
}

export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] ${className}`}
    >
      {children}
    </span>
  );
}
