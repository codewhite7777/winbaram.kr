import { prisma } from "@/lib/prisma"
import { PostList, Pagination } from "@/components/board"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageLayout } from "@/components/layout"

type PageProps = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

const POSTS_PER_PAGE = 20

export default async function BoardCategoryPage({ params, searchParams }: PageProps) {
  const { category: categorySlug } = await params
  const { page } = await searchParams
  const currentPage = parseInt(page || "1", 10)

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  })

  if (!category) {
    notFound()
  }

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where: { categoryId: category.id },
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { comments: true } },
      },
      orderBy: [{ isNotice: "desc" }, { createdAt: "desc" }],
      skip: (currentPage - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where: { categoryId: category.id } }),
  ])

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

  // Date를 string으로 변환
  const formattedPosts = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
  }))

  return (
    <PageLayout>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-amber-900">{category.name}</h1>
        <Link
          href={`/board/${categorySlug}/write`}
          className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
        >
          글쓰기
        </Link>
      </div>

      {/* 게시글 목록 */}
      <PostList posts={formattedPosts} categorySlug={categorySlug} />

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-4">
          <ClientPagination
            currentPage={currentPage}
            totalPages={totalPages}
            categorySlug={categorySlug}
          />
        </div>
      )}
    </PageLayout>
  )
}

// 클라이언트 컴포넌트로 페이지네이션 처리
function ClientPagination({
  currentPage,
  totalPages,
  categorySlug,
}: {
  currentPage: number
  totalPages: number
  categorySlug: string
}) {
  "use client"
  return (
    <div className="flex items-center justify-center gap-1">
      {currentPage > 1 && (
        <Link
          href={`/board/${categorySlug}?page=${currentPage - 1}`}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          이전
        </Link>
      )}
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
        const pageNum = start + i
        if (pageNum > totalPages) return null
        return (
          <Link
            key={pageNum}
            href={`/board/${categorySlug}?page=${pageNum}`}
            className={`px-3 py-1.5 text-sm border rounded ${
              pageNum === currentPage
                ? "bg-amber-500 text-white border-amber-500"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {pageNum}
          </Link>
        )
      })}
      {currentPage < totalPages && (
        <Link
          href={`/board/${categorySlug}?page=${currentPage + 1}`}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          다음
        </Link>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { category: categorySlug } = await params
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  })

  return {
    title: category ? `${category.name} - 바람의 나라` : "게시판",
  }
}
