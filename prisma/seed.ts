import { PrismaClient } from "../src/generated/prisma/client"
import { Pool, neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import ws from "ws"

// WebSocket setup for serverless
neonConfig.webSocketConstructor = ws

// Database URL 직접 사용 (로컬 개발용)
const connectionString = "postgresql://neondb_owner:npg_yiapBw0lVT1W@ep-bold-dream-a1in66t5-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

console.log("Connecting to database with:", connectionString.substring(0, 50) + "...")
const pool = new Pool({ connectionString })
console.log("Pool created:", pool)
const adapter = new PrismaNeon(pool)
console.log("Adapter created:", adapter)
const prisma = new PrismaClient({ adapter })

async function main() {
  // 기본 카테고리 생성
  const categories = [
    { name: "자유게시판", slug: "free", description: "자유롭게 이야기를 나누는 공간입니다.", order: 1 },
    { name: "공략게시판", slug: "guide", description: "게임 공략과 팁을 공유하는 공간입니다.", order: 2 },
    { name: "질문게시판", slug: "qna", description: "게임 관련 질문을 올리는 공간입니다.", order: 3 },
    { name: "거래게시판", slug: "trade", description: "아이템 거래를 위한 공간입니다.", order: 4 },
    { name: "길드홍보", slug: "guild", description: "길드를 홍보하는 공간입니다.", order: 5 },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log("Seed data created successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
