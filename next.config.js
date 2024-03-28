/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['openweathermap.org', 'parks.seoul.go.kr', 'culture.seoul.go.kr'],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
