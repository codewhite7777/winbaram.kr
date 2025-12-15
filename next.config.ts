import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack은 아직 Google Fonts 문제가 있음
  // Vercel 배포 시에는 기본적으로 webpack 사용
};

export default nextConfig;
