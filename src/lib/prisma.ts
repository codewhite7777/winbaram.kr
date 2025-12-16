import { PrismaClient } from "../generated/prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

declare global {
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env["DATABASE_URL"]

  if (!databaseUrl) {
    throw new Error(
      `DATABASE_URL is not set. NODE_ENV: ${process.env["NODE_ENV"]}`
    )
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })

  const adapter = new PrismaPg(pool)
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
