import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollDrift } from "@/components/ui/ScrollDrift";

export function Contact() {
  const links = [
    site.links.email && { label: "Email", href: `mailto:${site.links.email}`, value: site.links.email },
    site.links.linkedin && { label: "LinkedIn", href: site.links.linkedin, value: site.links.linkedin.replace(/^https?:\/\/(www\.)?/, "") },
    site.links.github && { label: "GitHub", href: site.links.github, value: site.links.github.replace(/^https?:\/\/(www\.)?/, "") },
  ].filter(Boolean) as { label: string; href: string; value: string }[];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line pb-10 pt-28 md:pt-40">
      <div className="px-4 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <Reveal className="flex items-center justify-between border-b border-line pb-5">
            <p className="eyebrow"><span className="text-accent">06</span> — Contact</p>
            <p className="eyebrow hidden sm:block">Open to conversations</p>
          </Reveal>
          <Reveal>
            <p className="mt-14 max-w-3xl font-serif text-3xl italic leading-tight text-fg-2 md:text-5xl">Open to AI &amp; ML engineering roles and collaborations.</p>
          </Reveal>
        </div>
      </div>

      <h2 id="contact-title" className="sr-only">Let&apos;s build something intelligent.</h2>
      <div aria-hidden="true" className="mt-6 px-4 sm:px-8 lg:px-12">
        <ScrollDrift from={-4} to={4}>
          <p className="display text-[clamp(3.2rem,11vw,12rem)] uppercase">Let&apos;s build</p>
        </ScrollDrift>
        <ScrollDrift from={6} to={-2}>
          <p className="display text-right text-[clamp(3.2rem,11vw,12rem)] uppercase">something</p>
        </ScrollDrift>
        <ScrollDrift from={-2} to={3}>
          <p className="font-serif text-[clamp(3.4rem,12vw,13rem)] italic leading-[0.95] text-accent">intelligent.</p>
        </ScrollDrift>
      </div>

      <div className="px-4 sm:px-8 lg:px-12">
        <div className="mx-auto mt-16 max-w-[1500px]">
          {links.length > 0 ? (
            <ul className={`grid gap-px overflow-hidden rounded-2xl border border-line bg-line ${links.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
              {links.map((l) => (
                <li key={l.label} className="bg-bg">
                  <a
                    href={l.href}
                    {...(l.label !== "Email" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex h-full flex-col justify-between gap-10 p-6 transition-colors duration-500 hover:bg-accent hover:text-bg sm:p-8"
                  >
                    <span className="flex items-center justify-between font-mono text-[0.72rem] uppercase tracking-[0.14em] text-muted group-hover:text-bg">
                      {l.label}
                      <span aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
                    </span>
                    <span className="break-words text-lg text-fg group-hover:text-bg md:text-xl">{l.value}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border border-dashed border-line p-6 text-sm text-muted">
              Contact links appear here once they are configured in <span className="font-mono">src/content/site.ts</span> (via environment variables).
            </p>
          )}

          <footer className="mt-24 flex flex-col gap-4 border-t border-line pt-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>© Kerthik Dharshan</span>
            <span>AI &amp; ML Engineer</span>
            <a href="#top" className="hover:text-fg">Back to top ↑</a>
          </footer>
        </div>
      </div>
    </section>
  );
}
