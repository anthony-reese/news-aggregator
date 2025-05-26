// next.config.ts

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    serverActions: {}, // this is okay
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: {
    domains: ['example.com', 'cdn.newsapi.org'],
  },
};

export default nextConfig;
