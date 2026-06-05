/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // GLASSES exhibit — a self-contained static page restored under
      // public/0/0/. Serve it at a clean /glasses URL.
      { source: "/glasses", destination: "/0/0/index.html" },
    ];
  },
};

export default nextConfig;
