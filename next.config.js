/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Needed for Netlify deployments
  distDir: 'out',
  trailingSlash: true,
  reactStrictMode: true,
};

module.exports = nextConfig;
