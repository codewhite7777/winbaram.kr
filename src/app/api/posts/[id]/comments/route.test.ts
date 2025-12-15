import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "./route"
import { NextRequest } from "next/server"

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    comment: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    post: {
      findUnique: vi.fn(),
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

describe("GET /api/posts/[id]/comments", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return comments for a post", async () => {
    const mockComments = [
      {
        id: "comment1",
        content: "댓글 내용",
        author: { id: "user1", name: "테스터" },
        replies: [],
      },
    ]

    vi.mocked(prisma.comment.findMany).mockResolvedValue(mockComments)

    const request = new NextRequest("http://localhost:3000/api/posts/post1/comments")
    const response = await GET(request, mockParams)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(data[0].content).toBe("댓글 내용")
  })
})

describe("POST /api/posts/[id]/comments", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const request = new NextRequest("http://localhost:3000/api/posts/post1/comments", {
      method: "POST",
      body: JSON.stringify({ content: "새 댓글" }),
    })

    const response = await POST(request, mockParams)
    expect(response.status).toBe(401)
  })

  it("should create a comment when authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user1", name: "테스터" },
    } as unknown as ReturnType<typeof auth>)

    vi.mocked(prisma.post.findUnique).mockResolvedValue({
      id: "post1",
    } as ReturnType<typeof prisma.post.findUnique>)

    const mockComment = {
      id: "comment1",
      content: "새 댓글",
      authorId: "user1",
      postId: "post1",
      author: { id: "user1", name: "테스터" },
    }

    vi.mocked(prisma.comment.create).mockResolvedValue(mockComment as ReturnType<typeof prisma.comment.create>)

    const request = new NextRequest("http://localhost:3000/api/posts/post1/comments", {
      method: "POST",
      body: JSON.stringify({ content: "새 댓글" }),
    })

    const response = await POST(request, mockParams)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.content).toBe("새 댓글")
  })

  it("should create a reply when parentId is provided", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user1", name: "테스터" },
    } as unknown as ReturnType<typeof auth>)

    vi.mocked(prisma.post.findUnique).mockResolvedValue({
      id: "post1",
    } as ReturnType<typeof prisma.post.findUnique>)

    const mockReply = {
      id: "reply1",
      content: "대댓글",
      authorId: "user1",
      postId: "post1",
      parentId: "comment1",
      author: { id: "user1", name: "테스터" },
    }

    vi.mocked(prisma.comment.create).mockResolvedValue(mockReply as ReturnType<typeof prisma.comment.create>)

    const request = new NextRequest("http://localhost:3000/api/posts/post1/comments", {
      method: "POST",
      body: JSON.stringify({ content: "대댓글", parentId: "comment1" }),
    })

    const response = await POST(request, mockParams)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.parentId).toBe("comment1")
  })

  it("should return 400 when content is empty", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user1", name: "테스터" },
    } as unknown as ReturnType<typeof auth>)

    const request = new NextRequest("http://localhost:3000/api/posts/post1/comments", {
      method: "POST",
      body: JSON.stringify({ content: "" }),
    })

    const response = await POST(request, mockParams)
    expect(response.status).toBe(400)
  })
})
