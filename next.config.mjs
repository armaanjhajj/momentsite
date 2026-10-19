/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // GLASSES exhibit: a self-contained static page restored under
      // public/0/0/. Serve it at a clean /glasses URL.
      { source: "/glasses", destination: "/0/0/index.html" },
    ];
  },
  async redirects() {
    return [
      // The old app page. Sources match case-insensitively, so this also
      // covers /lyfstyl; /LYFESTYL is handled in src/middleware.ts.
      { source: "/LYFSTYL", destination: "/lyfestyl", permanent: true },
    ];
  },
};

export default nextConfig;
