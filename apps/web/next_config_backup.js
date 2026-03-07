const path = require('path');
const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
    
    // Provide process.env for client-side libraries that expect it (e.g. WASM tools)
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          NODE_ENV: process.env.NODE_ENV,
          // Add other env vars here if needed by client libs
        }),
      })
    );

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

  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' data: blob:",
      "worker-src 'self' blob:",
      "connect-src 'self' https: blob:",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; ');

    const securityHeaders = [
      { key: 'Content-Security-Policy',         value: csp },
      { key: 'X-Frame-Options',                 value: 'DENY' },
      { key: 'X-Content-Type-Options',          value: 'nosniff' },
      { key: 'Referrer-Policy',                 value: 'strict-origin-when-cross-origin' },
      { key: 'X-DNS-Prefetch-Control',          value: 'on' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(self), geolocation=(), interest-cohort=()',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
    ];

    return [
      { source: '/(.*)', headers: securityHeaders },
    ];
  },
};

module.exports = nextConfig;
