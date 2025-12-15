import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET } from "./route"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    post: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}))

describe("GET /api/posts/search", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("검색어로 게시글을 검색한다", async () => {
    const mockPosts = [
      {
        id: "1",
        title: "테스트 게시글",
        content: "테스트 내용입니다",
        viewCount: 10,
        createdAt: new Date(),
        isNotice: false,
        author: { id: "user1", name: "작성자" },
        category: { id: "cat1", name: "자유게시판", slug: "free" },
        _count: { comments: 2 },
      },
    ]

    vi.mocked(prisma.post.findMany).mockResolvedValueOnce(mockPosts as never)
    vi.mocked(prisma.post.count).mockResolvedValueOnce(1)

    const request = new NextRequest("http://localhost/api/posts/search?q=테스트")
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.posts).toHaveLength(1)
    expect(data.totalCount).toBe(1)
  })

  it("검색어가 없으면 400 에러를 반환한다", async () => {
    const request = new NextRequest("http://localhost/api/posts/search")
    const response = await GET(request)

    expect(response.status).toBe(400)
  })

  it("카테고리로 검색 결과를 필터링한다", async () => {
    vi.mocked(prisma.post.findMany).mockResolvedValueOnce([] as never)
    vi.mocked(prisma.post.count).mockResolvedValueOnce(0)

    const request = new NextRequest("http://localhost/api/posts/search?q=테스트&category=free")
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          category: { slug: "free" },
        }),
      })
    )
  })

  it("페이지네이션이 적용된다", async () => {
    vi.mocked(prisma.post.findMany).mockResolvedValueOnce([] as never)
    vi.mocked(prisma.post.count).mockResolvedValueOnce(50)

    const request = new NextRequest("http://localhost/api/posts/search?q=테스트&page=2")
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.page).toBe(2)
    expect(data.totalPages).toBe(3) // 50 / 20 = 2.5 -> 3
  })
})
