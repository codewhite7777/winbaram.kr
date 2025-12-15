import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, PUT, DELETE } from "./route"
import { NextRequest } from "next/server"

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    post: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

// Mock auth
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}))

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

const mockParams = { params: Promise.resolve({ id: "post1" }) }

describe("GET /api/posts/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return post detail", async () => {
    const mockPost = {
      id: "post1",
      title: "테스트 게시글",
      content: "내용",
      slug: "test-post",
      viewCount: 10,
      author: { id: "user1", name: "테스터" },
      category: { id: "cat1", name: "자유게시판", slug: "free" },
      comments: [],
    }

    vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost)
    vi.mocked(prisma.post.update).mockResolvedValue({ ...mockPost, viewCount: 11 })

    const request = new NextRequest("http://localhost:3000/api/posts/post1")
    const response = await GET(request, mockParams)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.title).toBe("테스트 게시글")
  })

  it("should return 404 when post not found", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(null)

    const request = new NextRequest("http://localhost:3000/api/posts/nonexistent")
    const response = await GET(request, mockParams)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe("게시글을 찾을 수 없습니다.")
  })
})

describe("PUT /api/posts/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const request = new NextRequest("http://localhost:3000/api/posts/post1", {
      method: "PUT",
      body: JSON.stringify({ title: "수정된 제목" }),
    })

    const response = await PUT(request, mockParams)
    expect(response.status).toBe(401)
  })

  it("should return 403 when user is not author", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "other-user", name: "다른유저" },
    } as unknown as ReturnType<typeof auth>)

    vi.mocked(prisma.post.findUnique).mockResolvedValue({
      id: "post1",
      authorId: "user1",
    } as ReturnType<typeof prisma.post.findUnique>)

    const request = new NextRequest("http://localhost:3000/api/posts/post1", {
      method: "PUT",
      body: JSON.stringify({ title: "수정된 제목" }),
    })

    const response = await PUT(request, mockParams)
    expect(response.status).toBe(403)
  })

  it("should update post when user is author", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user1", name: "테스터" },
    } as unknown as ReturnType<typeof auth>)

    vi.mocked(prisma.post.findUnique).mockResolvedValue({
      id: "post1",
      authorId: "user1",
    } as ReturnType<typeof prisma.post.findUnique>)

    vi.mocked(prisma.post.update).mockResolvedValue({
      id: "post1",
      title: "수정된 제목",
    } as ReturnType<typeof prisma.post.update>)

    const request = new NextRequest("http://localhost:3000/api/posts/post1", {
      method: "PUT",
      body: JSON.stringify({ title: "수정된 제목" }),
    })

    const response = await PUT(request, mockParams)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.title).toBe("수정된 제목")
  })
})

describe("DELETE /api/posts/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const request = new NextRequest("http://localhost:3000/api/posts/post1", {
      method: "DELETE",
    })

    const response = await DELETE(request, mockParams)
    expect(response.status).toBe(401)
  })

  it("should delete post when user is author", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user1", name: "테스터" },
    } as unknown as ReturnType<typeof auth>)

    vi.mocked(prisma.post.findUnique).mockResolvedValue({
      id: "post1",
      authorId: "user1",
    } as ReturnType<typeof prisma.post.findUnique>)

    vi.mocked(prisma.post.delete).mockResolvedValue({
      id: "post1",
    } as ReturnType<typeof prisma.post.delete>)

    const request = new NextRequest("http://localhost:3000/api/posts/post1", {
      method: "DELETE",
    })

    const response = await DELETE(request, mockParams)
    expect(response.status).toBe(200)
  })
})
