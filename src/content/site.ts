/**
 * Site-wide identity & contact configuration.
 *
 * Email and LinkedIn come from the resume; environment variables override them
 * (`.env.local` or the Vercel project settings):
 *
 *   NEXT_PUBLIC_SITE_URL=https://your-domain.com
 *   NEXT_PUBLIC_CONTACT_EMAIL=you@example.com
 *   NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/in/your-handle
 *   NEXT_PUBLIC_GITHUB_URL=https://github.com/your-handle
 *
 * Any link left empty is simply not rendered (GitHub is not on the resume).
 */
export const site = {
  name: "Kerthik Dharshan",
  role: "AI & ML Engineer",
  location: "Chennai, Tamil Nadu",
  // Your own domain if set; otherwise the production URL Vercel provides
  // automatically (e.g. dharshan-portfolio.vercel.app); localhost in development.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  description:
    "Kerthik Dharshan is an AI & ML Engineer working across machine learning, Edge AI, computer vision, grounded AI systems and full-stack engineering.",
  links: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "kerthi0708@gmail.com",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/in/kerthik-dharshan-s-5b9268293",
    github: process.env.NEXT_PUBLIC_GITHUB_URL || "",
  },
} as const;
