# Kerthik Dharshan — Portfolio

A single-page, motion-led portfolio for an AI & ML Engineer.
**Editorial × Kinetic × Product engineering.**

Built with Next.js 16 (App Router, static), TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger,
Motion, and React Three Fiber + Rapier for the hanging ID card.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (fully static)
npm run lint
```

## Configure contact links

Copy `.env.example` to `.env.local` (or set the same variables in Vercel):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap, robots |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Email link in Contact |
| `NEXT_PUBLIC_LINKEDIN_URL` | LinkedIn link |
| `NEXT_PUBLIC_GITHUB_URL` | GitHub link |

Empty values are not rendered — no placeholder URLs ship.

## Structure

```
src/
  app/                  layout (fonts, SEO, JSON-LD), page, icon, OG image, robots, sitemap
  content/site.ts       identity + contact config
  assets/work/          optimised product screenshots (WebP)
  components/
    hero/               kinetic headline (variable-font axes react to the pointer)
    about/              About + hanging ID card (3D physics on desktop, 2D pendulum fallback)
    work/
      petaledge/        flagship: sticky DATA → TRAIN → OPTIMIZE → DEPLOY journey, layered depth screenshots
      codecraft/        block workspace that assembles a real example program
      pramoj/           agent run console (stages, SSE events, board toggle) + command loop
      petalyellow/      calm wellness section with interactive Health Age phone
    sections/           Skills, Experience + Education, Contact
    ui/                 Reveal, WordsReveal, ScrollDrift
```

## Motion & performance notes

- The 3D card (three.js + Rapier, ~1 MB) is code-split and only loaded on wide, fine-pointer
  screens with motion allowed, when the About section is near the viewport. Its render loop and
  physics pause when off-screen. Everyone else gets a lightweight DOM pendulum card.
- `prefers-reduced-motion` disables scrubbed movement, marquees, sway and auto-play everywhere.
- GSAP work is scoped with `gsap.matchMedia()` and reverted on unmount.
- Screenshots are pre-optimised WebP served through `next/image` with blur placeholders.

## Content accuracy

All project content was verified against the source repositories (read-only). Interface
recreations (precision selector, block workspace, agent run, Health Age phone) are labelled in
the page, and any example values are marked as illustrative. No member or personal data is used.
