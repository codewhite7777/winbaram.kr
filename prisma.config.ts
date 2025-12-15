import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// .env.local 파일을 먼저 로드
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
