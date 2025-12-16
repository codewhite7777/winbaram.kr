import { PrismaClient } from "../generated/prisma/client"
import { neon } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"

declare global {
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required")
  }

  const sql = neon(databaseUrl)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaNeon(sql as any)

  return new PrismaClient({ adapter })
}

// Lazy initialization with Proxy to avoid build-time errors
let prismaInstance: PrismaClient | null = null

function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = global.prismaClient ?? createPrismaClient()
    if (process.env.NODE_ENV !== "production") {
      global.prismaClient = prismaInstance
    }
  }
  return prismaInstance
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: keyof PrismaClient) {
    const client = getPrismaClient()
    const value = client[prop]
    if (typeof value === "function") {
      return value.bind(client)
    }
    return value
  },
})
