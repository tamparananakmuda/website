import bundleAnalyzer from '@next/bundle-analyzer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      const emptyModule = resolve(__dirname, 'scripts/empty-polyfill.js');
      config.plugins.push(new webpack.NormalModuleReplacementPlugin(
        /build\/polyfills\/polyfill-module/,
        emptyModule
      ));
      config.plugins.push(new webpack.NormalModuleReplacementPlugin(
        /build\/polyfills\/polyfill-nomodule/,
        emptyModule
      ));
    }
    return config;
  },
  images: {
    minimumCacheTTL: 31536000,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [384, 640, 750, 828, 1080, 1200],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ibjzssvimsmdxxekqshy.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.tamparananakmuda.com',
        pathname: '/**',
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
