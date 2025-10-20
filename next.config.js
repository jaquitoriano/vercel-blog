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
  // We'll keep error checking for production
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  // Optimize for production
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Avoid issues with native Node modules
    serverComponentsExternalPackages: ['bcrypt', 'node-gyp-build']
  },
  // Ensure environment variables are properly loaded
  env: {
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    NEXT_PUBLIC_STORE_ID: process.env.NEXT_PUBLIC_STORE_ID,
    NEXT_CONFIG_BLOB_TOKEN: 'loaded', // Indicator that we've loaded the token in next.config
  },
  webpack: (config) => {
    // Resolve issues with native modules like bcrypt
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      dns: false,
      child_process: false,
      node_gyp_build: false,
    };
    return config;
  },
};

module.exports = nextConfig;