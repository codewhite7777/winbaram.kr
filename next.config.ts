import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lwi.nexon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.namu.wiki",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "baramhyangky.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "www.baraminside.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
