import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "./route"
import { NextRequest } from "next/server"

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    post: {
      findMany: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
  },
}))

// Mock auth
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}))

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

describe("GET /api/posts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return paginated posts", async () => {
    const mockPosts = [
      {
        id: "1",
        title: "테스트 게시글",
        slug: "test-post",
        viewCount: 10,
        createdAt: new Date(),
        author: { id: "user1", name: "테스터" },
        category: { id: "cat1", name: "자유게시판", slug: "free" },
        _count: { comments: 5 },
      },
    ]

    vi.mocked(prisma.post.findMany).mockResolvedValue(mockPosts)
    vi.mocked(prisma.post.count).mockResolvedValue(1)

    const request = new NextRequest("http://localhost:3000/api/posts?page=1&limit=10")
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.posts).toHaveLength(1)
    expect(data.posts[0].title).toBe("테스트 게시글")
    expect(data.total).toBe(1)
    expect(data.page).toBe(1)
    expect(data.totalPages).toBe(1)
  })

  it("should filter posts by category", async () => {
    vi.mocked(prisma.post.findMany).mockResolvedValue([])
    vi.mocked(prisma.post.count).mockResolvedValue(0)

    const request = new NextRequest("http://localhost:3000/api/posts?category=free")
    await GET(request)

    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          category: { slug: "free" },
        }),
      })
    )
  })
})

describe("POST /api/posts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const request = new NextRequest("http://localhost:3000/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title: "새 게시글",
        content: "내용",
        categoryId: "cat1",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe("로그인이 필요합니다.")
  })

  it("should create a post when authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user1", name: "테스터", email: "test@test.com" },
    } as unknown as ReturnType<typeof auth>)

    const mockPost = {
      id: "1",
      title: "새 게시글",
      content: "내용",
      slug: "new-post-123",
      authorId: "user1",
      categoryId: "cat1",
    }

    vi.mocked(prisma.post.create).mockResolvedValue(mockPost as ReturnType<typeof prisma.post.create>)

    const request = new NextRequest("http://localhost:3000/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title: "새 게시글",
        content: "내용",
        categoryId: "cat1",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.title).toBe("새 게시글")
  })

  it("should return 400 when title is missing", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user1", name: "테스터", email: "test@test.com" },
    } as unknown as ReturnType<typeof auth>)

    const request = new NextRequest("http://localhost:3000/api/posts", {
      method: "POST",
      body: JSON.stringify({
        content: "내용",
        categoryId: "cat1",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe("제목은 필수입니다.")
  })
})
