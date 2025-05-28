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
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/[...nextauth]/:path*',
      },
    ];
  },
};

export default nextConfig;
