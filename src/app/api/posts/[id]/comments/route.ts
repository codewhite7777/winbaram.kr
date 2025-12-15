import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

type RouteParams = {
  params: Promise<{ id: string }>
}

// 댓글 목록 조회
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: postId } = await params

    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      include: {
        author: { select: { id: true, name: true, image: true } },
        replies: {
          include: {
            author: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Failed to fetch comments:", error)
    return NextResponse.json(
      { error: "댓글을 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

// 댓글 작성
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    const { id: postId } = await params
    const body = await request.json()
    const { content, parentId } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "내용은 필수입니다." },
        { status: 400 }
      )
    }

    // 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: session.user.id,
        postId,
        ...(parentId && { parentId }),
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Failed to create comment:", error)
    return NextResponse.json(
      { error: "댓글 작성에 실패했습니다." },
      { status: 500 }
    )
  }
}
