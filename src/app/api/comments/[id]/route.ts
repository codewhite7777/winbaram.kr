import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

type RouteParams = {
  params: Promise<{ id: string }>
}

// 댓글 수정
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { content } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "내용은 필수입니다." },
        { status: 400 }
      )
    }

    // 권한 확인
    const existingComment = await prisma.comment.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!existingComment) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    if (existingComment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "수정 권한이 없습니다." },
        { status: 403 }
      )
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content: content.trim() },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    })

    return NextResponse.json(updatedComment)
  } catch (error) {
    console.error("Failed to update comment:", error)
    return NextResponse.json(
      { error: "댓글 수정에 실패했습니다." },
      { status: 500 }
    )
  }
}

// 댓글 삭제
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    const { id } = await params

    // 권한 확인
    const existingComment = await prisma.comment.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!existingComment) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    if (existingComment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "삭제 권한이 없습니다." },
        { status: 403 }
      )
    }

    await prisma.comment.delete({ where: { id } })

    return NextResponse.json({ message: "댓글이 삭제되었습니다." })
  } catch (error) {
    console.error("Failed to delete comment:", error)
    return NextResponse.json(
      { error: "댓글 삭제에 실패했습니다." },
      { status: 500 }
    )
  }
}
