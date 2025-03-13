import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    serverActions: {}, // Instead of `serverActions: true`
  },
};

export default nextConfig;
