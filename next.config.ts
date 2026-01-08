import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // eslint configuration is not part of NextConfig, so it has been removed
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
