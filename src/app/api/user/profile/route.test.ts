import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, PUT } from "./route"
import { NextRequest } from "next/server"

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

// Mock auth
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}))

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

const mockUser = {
  id: "user1",
  email: "test@test.com",
  name: "테스터",
  nickname: "tester",
  image: "https://example.com/avatar.jpg",
  role: "USER",
  createdAt: new Date("2024-01-01"),
  _count: {
    posts: 5,
    comments: 10,
  },
}

describe("GET /api/user/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe("로그인이 필요합니다.")
  })

  it("should return user profile when authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user1", name: "테스터", email: "test@test.com" },
    } as Awaited<ReturnType<typeof auth>>)

    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as Awaited<ReturnType<typeof prisma.user.findUnique>>)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.email).toBe("test@test.com")
    expect(data.nickname).toBe("tester")
    expect(data._count.posts).toBe(5)
    expect(data._count.comments).toBe(10)
  })

  it("should return 404 when user not found", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user1", name: "테스터", email: "test@test.com" },
    } as Awaited<ReturnType<typeof auth>>)

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe("사용자를 찾을 수 없습니다.")
  })
})

describe("PUT /api/user/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const request = new NextRequest("http://localhost:3000/api/user/profile", {
      method: "PUT",
      body: JSON.stringify({ nickname: "newnick" }),
    })

    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe("로그인이 필요합니다.")
  })

  it("should update nickname successfully", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user1", name: "테스터", email: "test@test.com" },
    } as Awaited<ReturnType<typeof auth>>)

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null) // No duplicate
    vi.mocked(prisma.user.update).mockResolvedValue({
      ...mockUser,
      nickname: "newnick",
    } as Awaited<ReturnType<typeof prisma.user.update>>)

    const request = new NextRequest("http://localhost:3000/api/user/profile", {
      method: "PUT",
      body: JSON.stringify({ nickname: "newnick" }),
    })

    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.user.nickname).toBe("newnick")
  })

  it("should return 400 when nickname is too short", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user1", name: "테스터", email: "test@test.com" },
    } as Awaited<ReturnType<typeof auth>>)

    const request = new NextRequest("http://localhost:3000/api/user/profile", {
      method: "PUT",
      body: JSON.stringify({ nickname: "a" }),
    })

    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe("닉네임은 2자 이상 20자 이하로 입력해주세요.")
  })

  it("should return 400 when nickname is already taken", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user1", name: "테스터", email: "test@test.com" },
    } as Awaited<ReturnType<typeof auth>>)

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "other-user",
      nickname: "taken",
    } as Awaited<ReturnType<typeof prisma.user.findUnique>>)

    const request = new NextRequest("http://localhost:3000/api/user/profile", {
      method: "PUT",
      body: JSON.stringify({ nickname: "taken" }),
    })

    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe("이미 사용 중인 닉네임입니다.")
  })

  it("should allow clearing nickname", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user1", name: "테스터", email: "test@test.com" },
    } as Awaited<ReturnType<typeof auth>>)

    vi.mocked(prisma.user.update).mockResolvedValue({
      ...mockUser,
      nickname: null,
    } as Awaited<ReturnType<typeof prisma.user.update>>)

    const request = new NextRequest("http://localhost:3000/api/user/profile", {
      method: "PUT",
      body: JSON.stringify({ nickname: "" }),
    })

    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.user.nickname).toBeNull()
  })
})
