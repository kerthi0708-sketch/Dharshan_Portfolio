"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

const LINKS = [
  { href: "#top", label: "About", mobile: false },
  { href: "#work", label: "Work", mobile: true },
  { href: "#skills", label: "Skills", mobile: false },
  { href: "#experience", label: "Experience", mobile: false },
  { href: "#contact", label: "Contact", mobile: true },
];

export function Nav() {
  const bar = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
        if (bar.current) bar.current.style.transform = `scaleX(${p})`;
        setScrolled(h.scrollTop > 40);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`flex items-center justify-between px-4 py-4 transition-colors duration-500 sm:px-8 lg:px-12 ${
          scrolled ? "bg-bg/85 backdrop-blur-md" : ""
        }`}
      >
        <a href="#top" className="group flex items-center gap-3" aria-label="Kerthik Dharshan — back to top">
          <span className="font-serif text-2xl italic leading-none text-fg">
            K<span className="text-accent">d</span>
          </span>
          <span className="hidden font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted transition-colors group-hover:text-fg sm:inline">
            Kerthik Dharshan
          </span>
        </a>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-5 sm:gap-8">
            {LINKS.map((l) => (
              <li key={l.href} className={l.mobile ? "" : "hidden sm:block"}>
                <a
                  href={l.href}
                  className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-fg-2 transition-colors hover:text-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={site.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-line-strong px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent hover:text-accent"
              >
                Resume <span aria-hidden="true">↗</span>
                <span className="sr-only"> (PDF, opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="h-px w-full bg-line">
        <div ref={bar} className="h-px origin-left scale-x-0 bg-accent" />
      </div>
    </header>
  );
}
