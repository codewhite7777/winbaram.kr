import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

type RouteParams = {
  params: Promise<{ id: string }>
}

// GET /api/notices/[id] - 공지사항 상세 조회
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const notice = await prisma.notice.findUnique({
      where: { id },
    })

    if (!notice) {
      return NextResponse.json(
        { error: "공지사항을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    if (!notice.isPublished) {
      // 비공개 공지는 관리자만 조회 가능
      const session = await auth()
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: "공지사항을 찾을 수 없습니다." },
          { status: 404 }
        )
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      })

      if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
        return NextResponse.json(
          { error: "공지사항을 찾을 수 없습니다." },
          { status: 404 }
        )
      }
    }

    return NextResponse.json({
      ...notice,
      createdAt: notice.createdAt.toISOString(),
      updatedAt: notice.updatedAt.toISOString(),
      startDate: notice.startDate?.toISOString() || null,
      endDate: notice.endDate?.toISOString() || null,
    })
  } catch (error) {
    console.error("Failed to fetch notice:", error)
    return NextResponse.json(
      { error: "공지사항 조회에 실패했습니다." },
      { status: 500 }
    )
  }
}

// PUT /api/notices/[id] - 공지사항 수정 (관리자 전용)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

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

    const { id } = await params

    const existingNotice = await prisma.notice.findUnique({
      where: { id },
    })

    if (!existingNotice) {
      return NextResponse.json(
        { error: "공지사항을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { title, content, type, isPinned, isPublished, startDate, endDate } = body

    const notice = await prisma.notice.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(content !== undefined && { content: content.trim() }),
        ...(type !== undefined && { type }),
        ...(isPinned !== undefined && { isPinned }),
        ...(isPublished !== undefined && { isPublished }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      },
    })

    return NextResponse.json({
      notice: {
        ...notice,
        createdAt: notice.createdAt.toISOString(),
        updatedAt: notice.updatedAt.toISOString(),
        startDate: notice.startDate?.toISOString() || null,
        endDate: notice.endDate?.toISOString() || null,
      },
    })
  } catch (error) {
    console.error("Failed to update notice:", error)
    return NextResponse.json(
      { error: "공지사항 수정에 실패했습니다." },
      { status: 500 }
    )
  }
}

// DELETE /api/notices/[id] - 공지사항 삭제 (관리자 전용)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

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

    const { id } = await params

    const existingNotice = await prisma.notice.findUnique({
      where: { id },
    })

    if (!existingNotice) {
      return NextResponse.json(
        { error: "공지사항을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    await prisma.notice.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete notice:", error)
    return NextResponse.json(
      { error: "공지사항 삭제에 실패했습니다." },
      { status: 500 }
    )
  }
}
