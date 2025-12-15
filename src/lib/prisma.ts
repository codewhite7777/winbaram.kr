import { PrismaClient } from "../generated/prisma/client"
import { neon } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set")
  }

  const sql = neon(connectionString)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaNeon(sql as any)

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
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error("DATABASE_URL is not set")
      }
    })
  }
}

export const prisma = getPrismaClient()
