"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode, type CSSProperties } from "react";

/**
 * Minimal scroll reveal (IntersectionObserver + CSS transition).
 * Cheap enough to use widely; GSAP is reserved for the big moments.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  y = 28,
  once = true,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion: the global CSS rule collapses the transition to ~0ms.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) setShown(false);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const style: CSSProperties = {
    transform: shown ? "none" : `translate3d(0, ${y}px, 0)`,
    opacity: shown ? 1 : 0,
    transition: `transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, opacity 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  };

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

/** Splits text into words that rise from a mask, staggered. */
export function WordsReveal({ text, className = "", stagger = 22 }: { text: string; className?: string; stagger?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), io.disconnect()), {
      rootMargin: "0px 0px -12% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const words = text.split(" ");
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <span
              className="inline-block"
              style={{
                transform: shown ? "none" : "translate3d(0,105%,0)",
                transition: `transform 1s cubic-bezier(0.16,1,0.3,1) ${i * stagger}ms`,
              }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
