import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// 로컬 개발 시 .env.local 로드 (Vercel에서는 환경 변수가 이미 설정됨)
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
