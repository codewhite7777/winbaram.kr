import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET } from "./route"

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
    },
  },
}))

import { prisma } from "@/lib/prisma"

describe("GET /api/categories", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return all active categories", async () => {
    const mockCategories = [
      { id: "1", name: "자유게시판", slug: "free", description: "자유롭게 이야기", order: 1, isActive: true },
      { id: "2", name: "공략게시판", slug: "guide", description: "게임 공략", order: 2, isActive: true },
    ]

    vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockCategories)
    expect(prisma.category.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })
  })

  it("should return empty array when no categories exist", async () => {
    vi.mocked(prisma.category.findMany).mockResolvedValue([])

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual([])
  })

  it("should return 500 when database error occurs", async () => {
    vi.mocked(prisma.category.findMany).mockRejectedValue(new Error("Database error"))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe("카테고리를 불러오는데 실패했습니다.")
  })
})
