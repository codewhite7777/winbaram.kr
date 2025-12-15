import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

// 게시글 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    const where = {
      isPublished: true,
      ...(category && { category: { slug: category } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { content: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true } },
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { comments: true } },
        },
        orderBy: [{ isNotice: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Failed to fetch posts:", error)
    return NextResponse.json(
      { error: "게시글을 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

// 게시글 작성
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, categoryId } = body

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "제목은 필수입니다." },
        { status: 400 }
      )
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "내용은 필수입니다." },
        { status: 400 }
      )
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: "카테고리는 필수입니다." },
        { status: 400 }
      )
    }

    // Generate unique slug
    const slug = `${title.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        slug,
        authorId: session.user.id,
        categoryId,
      },
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("Failed to create post:", error)
    return NextResponse.json(
      { error: "게시글 작성에 실패했습니다." },
      { status: 500 }
    )
  }
}
