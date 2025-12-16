import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "./route"
import { NextRequest } from "next/server"

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    notice: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
    user: {
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

const mockNotice = {
  id: "notice1",
  title: "테스트 공지",
  content: "테스트 내용",
  type: "NOTICE",
  isPinned: false,
  isPublished: true,
  startDate: null,
  endDate: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
}

describe("GET /api/notices", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return paginated notices", async () => {
    vi.mocked(prisma.notice.findMany).mockResolvedValue([mockNotice])
    vi.mocked(prisma.notice.count).mockResolvedValue(1)

    const request = new NextRequest("http://localhost:3000/api/notices?page=1&limit=10")
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.notices).toHaveLength(1)
    expect(data.notices[0].title).toBe("테스트 공지")
    expect(data.total).toBe(1)
    expect(data.page).toBe(1)
  })

  it("should filter notices by type", async () => {
    vi.mocked(prisma.notice.findMany).mockResolvedValue([])
    vi.mocked(prisma.notice.count).mockResolvedValue(0)

    const request = new NextRequest("http://localhost:3000/api/notices?type=EVENT")
    await GET(request)

    expect(prisma.notice.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          type: "EVENT",
        }),
      })
    )
  })
})

describe("POST /api/notices", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const request = new NextRequest("http://localhost:3000/api/notices", {
      method: "POST",
      body: JSON.stringify({ title: "공지", content: "내용" }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe("로그인이 필요합니다.")
  })

  it("should return 403 when user is not admin", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user1", name: "User", email: "user@test.com" },
    } as Awaited<ReturnType<typeof auth>>)

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      role: "USER",
    } as Awaited<ReturnType<typeof prisma.user.findUnique>>)

    const request = new NextRequest("http://localhost:3000/api/notices", {
      method: "POST",
      body: JSON.stringify({ title: "공지", content: "내용" }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.error).toBe("관리자 권한이 필요합니다.")
  })

  it("should create notice when admin", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "admin1", name: "Admin", email: "admin@test.com" },
    } as Awaited<ReturnType<typeof auth>>)

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      role: "ADMIN",
    } as Awaited<ReturnType<typeof prisma.user.findUnique>>)

    vi.mocked(prisma.notice.create).mockResolvedValue(mockNotice)

    const request = new NextRequest("http://localhost:3000/api/notices", {
      method: "POST",
      body: JSON.stringify({
        title: "테스트 공지",
        content: "테스트 내용",
        type: "NOTICE",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.notice.title).toBe("테스트 공지")
  })

  it("should return 400 when title is missing", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "admin1", name: "Admin", email: "admin@test.com" },
    } as Awaited<ReturnType<typeof auth>>)

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      role: "ADMIN",
    } as Awaited<ReturnType<typeof prisma.user.findUnique>>)

    const request = new NextRequest("http://localhost:3000/api/notices", {
      method: "POST",
      body: JSON.stringify({ content: "내용" }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe("제목은 필수입니다.")
  })
})
