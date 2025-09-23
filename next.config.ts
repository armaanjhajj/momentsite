import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Turbopack treats the `website/` directory as the workspace root
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'static.vecteezy.com' },
      { protocol: 'https', hostname: 'yt3.googleusercontent.com' },
      { protocol: 'https', hostname: 'play-lh.googleusercontent.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/team',
        destination: '/apply',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
