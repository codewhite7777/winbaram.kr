import { PrismaClient } from "../generated/prisma/client"
import { Pool } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"

declare global {
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined
}

const createPrismaClient = () => {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required")
  }

  const pool = new Pool({ connectionString: databaseUrl })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaNeon(pool as any)

  return new PrismaClient({ adapter })
}

export const prisma = global.prismaClient ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  global.prismaClient = prisma
}
