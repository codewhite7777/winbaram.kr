import { PrismaClient } from "../generated/prisma/client"
import { neon } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"

declare global {
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined
}

function getDatabaseUrl(): string {
  // Use bracket notation to prevent build-time replacement
  const url = process.env["DATABASE_URL"]

  if (!url) {
    const envKeys = Object.keys(process.env).filter(k => k.includes("DATABASE") || k.includes("POSTGRES"))
    throw new Error(
      `DATABASE_URL is not set. Available DB-related env vars: [${envKeys.join(", ")}]. ` +
      `NODE_ENV: ${process.env.NODE_ENV}`
    )
  }

  return url
}

function createPrismaClient(): PrismaClient {
  const databaseUrl = getDatabaseUrl()
  const sql = neon(databaseUrl)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaNeon(sql as any)
  return new PrismaClient({ adapter })
}

// Lazy initialization
let prismaInstance: PrismaClient | null = null

function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = global.prismaClient ?? createPrismaClient()
    if (process.env["NODE_ENV"] !== "production") {
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
