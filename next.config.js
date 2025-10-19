/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // This is a temporary setting for development
    // Remove this when deploying to production
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;