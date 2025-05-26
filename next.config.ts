import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    serverActions: {}, // Instead of `serverActions: true`
  },
  images: {
    domains: [
      'example.com', 
      'cdn.newsapi.org'
    ], // add valid sources
  },
};

export default nextConfig;
