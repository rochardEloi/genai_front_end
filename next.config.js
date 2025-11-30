/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: 'output: export' removed to enable server-side features
  // If static export is required, re-enable this but some features will be limited

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    // Unoptimized for static export compatibility
    // Remove if using standard Next.js deployment
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.pexels.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // Enable experimental features for better performance
  experimental: {
    // Server Actions enabled by default in Next.js 14
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Webpack configuration for better tree-shaking
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },

  // Performance optimizations
  swcMinify: true,

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

module.exports = nextConfig;
