import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Unsplash images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  // Fix for Next.js 16 blocking local network testing
  allowedDevOrigins: ["192.168.129.59"],
};

export default nextConfig;
