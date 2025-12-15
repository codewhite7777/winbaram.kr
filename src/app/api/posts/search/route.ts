import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const POSTS_PER_PAGE = 20

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")
  const categorySlug = searchParams.get("category")
  const page = parseInt(searchParams.get("page") || "1", 10)

  if (!query || query.trim() === "") {
    return NextResponse.json({ error: "검색어를 입력해주세요." }, { status: 400 })
  }

  try {
    const where = {
      OR: [
        { title: { contains: query, mode: "insensitive" as const } },
        { content: { contains: query, mode: "insensitive" as const } },
      ],
      ...(categorySlug && { category: { slug: categorySlug } }),
    }

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true } },
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { comments: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * POSTS_PER_PAGE,
        take: POSTS_PER_PAGE,
      }),
      prisma.post.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

    return NextResponse.json({
      posts,
      totalCount,
      page,
      totalPages,
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "검색 중 오류가 발생했습니다." }, { status: 500 })
  }
}
