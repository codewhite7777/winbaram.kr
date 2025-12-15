import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

type RouteParams = {
  params: Promise<{ id: string }>
}

// 게시글 상세 조회
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true } },
        comments: {
          where: { parentId: null },
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
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 조회수 증가
    await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Failed to fetch post:", error)
    return NextResponse.json(
      { error: "게시글을 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

// 게시글 수정
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
    const { title, content, categoryId } = body

    // 권한 확인
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "수정 권한이 없습니다." },
        { status: 403 }
      )
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(content && { content: content.trim() }),
        ...(categoryId && { categoryId }),
      },
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Failed to update post:", error)
    return NextResponse.json(
      { error: "게시글 수정에 실패했습니다." },
      { status: 500 }
    )
  }
}

// 게시글 삭제
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
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "삭제 권한이 없습니다." },
        { status: 403 }
      )
    }

    await prisma.post.delete({ where: { id } })

    return NextResponse.json({ message: "게시글이 삭제되었습니다." })
  } catch (error) {
    console.error("Failed to delete post:", error)
    return NextResponse.json(
      { error: "게시글 삭제에 실패했습니다." },
      { status: 500 }
    )
  }
}
