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
};

export default nextConfig;
