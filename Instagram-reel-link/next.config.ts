import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.instagram.com',
        port: '',
        pathname: '/static/images/**',
      },
    ],
  },
};

export default nextConfig;
