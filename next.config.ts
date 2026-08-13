import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages (no Node server required)
  output: "export",
  images: {
    unoptimized: true,
  },
  // Trailing slashes play nicer with static hosting
  trailingSlash: true,
};

export default nextConfig;
