import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Open the resume in the browser's PDF viewer rather than downloading it.
  async headers() {
    return [
      {
        source: "/Kerthik-Dharshan-Resume.pdf",
        headers: [{ key: "Content-Disposition", value: 'inline; filename="Kerthik-Dharshan-Resume.pdf"' }],
      },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
