/** @type {import('next').NextConfig} */

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Performance optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    // Enable Turbopack for faster builds (Next.js 13+)
    turbo: {
      loaders: {
        '.svg': ['@svgr/webpack'],
      },
    },
    // Reduce memory usage
    workerThreads: false,
    esmExternals: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Your existing fallbacks
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "pino-pretty": false,
      "encoding": false,
      // Additional fallbacks for web3/crypto packages
      "fs": false,
      "net": false,
      "tls": false,
      "crypto": false,
      "stream": false,
      "http": false,
      "https": false,
      "os": false,
      "url": false,
      "assert": false,
    };

    // Optimize for development speed
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    // Ignore specific heavy packages during build
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });

    return config;
  },
  // Reduce bundle analysis overhead
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig