import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [];
  },
  images: {
    domains: ["i.imgur.com", "i.vgy.me", "i.ibb.co"],
  },
};

export default nextConfig;
