import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import type { NoticeType } from "@/generated/prisma/client"

const validNoticeTypes = ["NOTICE", "EVENT", "UPDATE", "MAINTENANCE"] as const

// GET /api/notices - 공지사항 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const typeParam = searchParams.get("type")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    // 유효한 타입인지 검증
    const type = typeParam && validNoticeTypes.includes(typeParam as NoticeType)
      ? (typeParam as NoticeType)
      : undefined

    const where = {
      isPublished: true,
      ...(type && { type }),
    }

    const [notices, total] = await Promise.all([
      prisma.notice.findMany({
        where,
        orderBy: [
          { isPinned: "desc" },
          { createdAt: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notice.count({ where }),
    ])

    return NextResponse.json({
      notices: notices.map((notice) => ({
        ...notice,
        createdAt: notice.createdAt.toISOString(),
        updatedAt: notice.updatedAt.toISOString(),
        startDate: notice.startDate?.toISOString() || null,
        endDate: notice.endDate?.toISOString() || null,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Failed to fetch notices:", error)
    return NextResponse.json(
      { error: "공지사항 조회에 실패했습니다." },
      { status: 500 }
    )
  }
}

// POST /api/notices - 공지사항 생성 (관리자 전용)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    // 관리자 권한 확인
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, content, type, isPinned, startDate, endDate } = body

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "제목은 필수입니다." },
        { status: 400 }
      )
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "내용은 필수입니다." },
        { status: 400 }
      )
    }

    const notice = await prisma.notice.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        type: type || "NOTICE",
        isPinned: isPinned || false,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    })

    return NextResponse.json(
      {
        notice: {
          ...notice,
          createdAt: notice.createdAt.toISOString(),
          updatedAt: notice.updatedAt.toISOString(),
          startDate: notice.startDate?.toISOString() || null,
          endDate: notice.endDate?.toISOString() || null,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to create notice:", error)
    return NextResponse.json(
      { error: "공지사항 작성에 실패했습니다." },
      { status: 500 }
    )
  }
}
