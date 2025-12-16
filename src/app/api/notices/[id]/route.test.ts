import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, PUT, DELETE } from "./route"
import { NextRequest } from "next/server"

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    notice: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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

const createParams = (id: string) => ({
  params: Promise.resolve({ id }),
})

describe("GET /api/notices/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return notice by id", async () => {
    vi.mocked(prisma.notice.findUnique).mockResolvedValue(mockNotice)

    const request = new NextRequest("http://localhost:3000/api/notices/notice1")
    const response = await GET(request, createParams("notice1"))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.title).toBe("테스트 공지")
  })

  it("should return 404 when notice not found", async () => {
    vi.mocked(prisma.notice.findUnique).mockResolvedValue(null)

    const request = new NextRequest("http://localhost:3000/api/notices/invalid")
    const response = await GET(request, createParams("invalid"))
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe("공지사항을 찾을 수 없습니다.")
  })
})

describe("PUT /api/notices/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const request = new NextRequest("http://localhost:3000/api/notices/notice1", {
      method: "PUT",
      body: JSON.stringify({ title: "수정된 제목" }),
    })

    const response = await PUT(request, createParams("notice1"))
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

    const request = new NextRequest("http://localhost:3000/api/notices/notice1", {
      method: "PUT",
      body: JSON.stringify({ title: "수정된 제목" }),
    })

    const response = await PUT(request, createParams("notice1"))
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.error).toBe("관리자 권한이 필요합니다.")
  })

  it("should update notice when admin", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "admin1", name: "Admin", email: "admin@test.com" },
    } as Awaited<ReturnType<typeof auth>>)

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      role: "ADMIN",
    } as Awaited<ReturnType<typeof prisma.user.findUnique>>)

    vi.mocked(prisma.notice.findUnique).mockResolvedValue(mockNotice)
    vi.mocked(prisma.notice.update).mockResolvedValue({
      ...mockNotice,
      title: "수정된 제목",
    })

    const request = new NextRequest("http://localhost:3000/api/notices/notice1", {
      method: "PUT",
      body: JSON.stringify({ title: "수정된 제목" }),
    })

    const response = await PUT(request, createParams("notice1"))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.notice.title).toBe("수정된 제목")
  })
})

describe("DELETE /api/notices/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const request = new NextRequest("http://localhost:3000/api/notices/notice1", {
      method: "DELETE",
    })

    const response = await DELETE(request, createParams("notice1"))
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

    const request = new NextRequest("http://localhost:3000/api/notices/notice1", {
      method: "DELETE",
    })

    const response = await DELETE(request, createParams("notice1"))
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.error).toBe("관리자 권한이 필요합니다.")
  })

  it("should delete notice when admin", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "admin1", name: "Admin", email: "admin@test.com" },
    } as Awaited<ReturnType<typeof auth>>)

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      role: "ADMIN",
    } as Awaited<ReturnType<typeof prisma.user.findUnique>>)

    vi.mocked(prisma.notice.findUnique).mockResolvedValue(mockNotice)
    vi.mocked(prisma.notice.delete).mockResolvedValue(mockNotice)

    const request = new NextRequest("http://localhost:3000/api/notices/notice1", {
      method: "DELETE",
    })

    const response = await DELETE(request, createParams("notice1"))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })
})
