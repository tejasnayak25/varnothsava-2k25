import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  serverExternalPackages: ["firebase-admin"],
  transpilePackages: ["@splinetool/react-spline"],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};


export default nextConfig;
