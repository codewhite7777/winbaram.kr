import { describe, it, expect, vi, beforeEach } from "vitest"
import { PUT, DELETE } from "./route"
import { NextRequest } from "next/server"

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    comment: {
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

const mockParams = { params: Promise.resolve({ id: "comment1" }) }

describe("PUT /api/comments/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const request = new NextRequest("http://localhost:3000/api/comments/comment1", {
      method: "PUT",
      body: JSON.stringify({ content: "수정된 댓글" }),
    })

    const response = await PUT(request, mockParams)
    expect(response.status).toBe(401)
  })

  it("should return 403 when user is not author", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "other-user", name: "다른유저" },
    } as unknown as ReturnType<typeof auth>)

    vi.mocked(prisma.comment.findUnique).mockResolvedValue({
      id: "comment1",
      authorId: "user1",
    } as ReturnType<typeof prisma.comment.findUnique>)

    const request = new NextRequest("http://localhost:3000/api/comments/comment1", {
      method: "PUT",
      body: JSON.stringify({ content: "수정된 댓글" }),
    })

    const response = await PUT(request, mockParams)
    expect(response.status).toBe(403)
  })

  it("should update comment when user is author", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user1", name: "테스터" },
    } as unknown as ReturnType<typeof auth>)

    vi.mocked(prisma.comment.findUnique).mockResolvedValue({
      id: "comment1",
      authorId: "user1",
    } as ReturnType<typeof prisma.comment.findUnique>)

    vi.mocked(prisma.comment.update).mockResolvedValue({
      id: "comment1",
      content: "수정된 댓글",
    } as ReturnType<typeof prisma.comment.update>)

    const request = new NextRequest("http://localhost:3000/api/comments/comment1", {
      method: "PUT",
      body: JSON.stringify({ content: "수정된 댓글" }),
    })

    const response = await PUT(request, mockParams)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.content).toBe("수정된 댓글")
  })
})

describe("DELETE /api/comments/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const request = new NextRequest("http://localhost:3000/api/comments/comment1", {
      method: "DELETE",
    })

    const response = await DELETE(request, mockParams)
    expect(response.status).toBe(401)
  })

  it("should delete comment when user is author", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user1", name: "테스터" },
    } as unknown as ReturnType<typeof auth>)

    vi.mocked(prisma.comment.findUnique).mockResolvedValue({
      id: "comment1",
      authorId: "user1",
    } as ReturnType<typeof prisma.comment.findUnique>)

    vi.mocked(prisma.comment.delete).mockResolvedValue({
      id: "comment1",
    } as ReturnType<typeof prisma.comment.delete>)

    const request = new NextRequest("http://localhost:3000/api/comments/comment1", {
      method: "DELETE",
    })

    const response = await DELETE(request, mockParams)
    expect(response.status).toBe(200)
  })
})
