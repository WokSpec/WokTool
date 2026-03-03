const path = require('path');
const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3001',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '**.pixabay.com' },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  poweredByHeader: false,
  webpack(config, { isServer }) {
    config.plugins = config.plugins ?? [];
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /onnxruntime-web/,
        path.resolve(__dirname, 'src/lib/stubs/onnxruntime-stub.js')
      )
    );
    if (!isServer) {
      config.resolve = config.resolve ?? {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;
