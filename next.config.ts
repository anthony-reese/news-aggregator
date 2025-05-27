const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: {
    domains: ['example.com', 'cdn.newsapi.org'],
  },
};

export default nextConfig;
