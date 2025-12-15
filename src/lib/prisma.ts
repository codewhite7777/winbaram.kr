import { PrismaClient } from "../generated/prisma/client"
import { Pool, neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import ws from "ws"

// WebSocket 설정 (서버리스 환경용)
neonConfig.webSocketConstructor = ws

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    // 빌드 시점에는 에러를 던지지 않고 나중에 lazy하게 생성
    throw new Error("DATABASE_URL is not set")
  }

  const pool = new Pool({ connectionString })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaNeon(pool as any)

  return new PrismaClient({ adapter })
}

function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  try {
    const client = createPrismaClient()
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client
    }
    return client
  } catch {
    // 빌드 시점에는 null 반환하지 않고 proxy 사용
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error("DATABASE_URL is not set")
      }
    })
  }
}

export const prisma = getPrismaClient()
