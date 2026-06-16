import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/assets/**',
      },
      {
        pathname: '/api/restaurants',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
      },
      {
        protocol: 'https',
        hostname: 'parks.seoul.go.kr',
      },
      {
        protocol: 'https',
        hostname: 'culture.seoul.go.kr',
      },
    ],
  },
  reactStrictMode: false,
};

export default withBundleAnalyzer(nextConfig);
