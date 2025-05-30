const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  env: {
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  experimental: {
    serverActions: {},
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: {
    domains: ['example.com', 'cdn.newsapi.org'],
  },
};

export default nextConfig;
